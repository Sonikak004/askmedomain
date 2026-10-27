import crypto from "crypto";
import fs from "fs";
import path from "path";
import https from "https";

// 1. Read environment variables from .env.local safely
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local file not found");
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [k, ...v] = trimmed.split("=");
    if (k && v.length) {
      env[k.trim()] = v.join("=").trim();
    }
  }
  return env;
}

const env = loadEnv();
const apiKey = env.DYNADOT_API_KEY;
const apiSecret = env.DYNADOT_API_SECRET;

function buildSignature(endpointPath, xRequestId, body = "") {
  const stringToSign = `${apiKey}\n${endpointPath}\n${xRequestId || ""}\n${body || ""}`;
  return crypto.createHmac("sha256", apiSecret).update(stringToSign, "utf-8").digest("base64");
}

// Low-level HTTPS request runner with custom agent options
function executeHttpsRequest(domainName, options = {}) {
  const { useKeepAlive = false, timeoutMs = 8000 } = options;
  const endpointPath = `/restful/v2/domains/${encodeURIComponent(domainName)}/search?show_price=true&currency=INR`;
  const xRequestId = crypto.randomUUID();
  const xSignature = buildSignature(endpointPath, xRequestId, "");

  const agent = new https.Agent({
    keepAlive: useKeepAlive,
    maxSockets: useKeepAlive ? 10 : 1,
    timeout: timeoutMs,
  });

  const requestHeaders = {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    "User-Agent": "AskMeDomain-Client/1.0",
    "X-Request-ID": xRequestId,
    "X-Signature": xSignature,
    Connection: useKeepAlive ? "keep-alive" : "close",
  };

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const req = https.request(
      {
        hostname: "api.dynadot.com",
        port: 443,
        path: endpointPath,
        method: "GET",
        headers: requestHeaders,
        agent,
        timeout: timeoutMs,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          const duration = Date.now() - startTime;
          try {
            const parsed = JSON.parse(rawData);
            resolve({
              domain: domainName,
              statusCode: res.statusCode,
              duration,
              data: parsed,
            });
          } catch (err) {
            reject({
              domain: domainName,
              stage: "response_parsing",
              error: err.message,
              duration,
            });
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("ETIMEDOUT"));
    });

    req.on("error", (err) => {
      const duration = Date.now() - startTime;
      const stage = req.socket && req.socket.bytesWritten > 0 ? "response_reading" : "connection_establishment";
      reject({
        domain: domainName,
        stage,
        code: err.code || "UNKNOWN",
        message: err.message,
        duration,
      });
    });

    req.end();
  });
}

// Safe Read-Only Search with Exponential Backoff + Jitter
async function searchWithRetry(domainName, options = {}) {
  const maxRetries = options.maxRetries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 400;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await executeHttpsRequest(domainName, options);
      return { ...result, attempts: attempt + 1 };
    } catch (err) {
      const isRetryable = err.code === "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED";
      if (!isRetryable || attempt === maxRetries) {
        throw { ...err, attempts: attempt + 1 };
      }
      const jitter = Math.floor(Math.random() * 200);
      const delay = Math.pow(2, attempt) * baseDelayMs + jitter;
      console.log(`[Retry Handler] Attempt ${attempt + 1} failed for ${domainName} (${err.code}). Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function runBenchmark() {
  console.log("================================================================");
  console.log("       Dynadot RESTful v2 Connection & Resilience Benchmark      ");
  console.log("================================================================\n");

  const testDomains = [
    "google.com",
    "askmedomain.com",
    "amazon.com",
    "microsoft.com",
    "github.com",
    `test-domain-${Date.now().toString(36)}-1.com`,
    `test-domain-${Date.now().toString(36)}-2.com`,
    `test-domain-${Date.now().toString(36)}-3.com`,
    `test-domain-${Date.now().toString(36)}-4.com`,
    `test-domain-${Date.now().toString(36)}-5.com`,
  ];

  // TEST SUITE 1: 10 Sequential Requests with Keep-Alive ENABLED vs DISABLED
  console.log(">>> TEST SUITE 1: 10 Sequential Requests (Keep-Alive: DISABLED, Connection: close) <<<");
  const results1 = [];
  for (const domain of testDomains) {
    try {
      const res = await searchWithRetry(domain, { useKeepAlive: false });
      results1.push(res);
      const available = res.data?.data?.available || "Unknown";
      console.log(`[SUCCESS] ${domain.padEnd(32)} | HTTP ${res.statusCode} | ${res.duration}ms | Available: ${available} | Attempts: ${res.attempts}`);
    } catch (err) {
      results1.push({ failed: true, ...err });
      console.error(`[FAILED]  ${domain.padEnd(32)} | Error: ${err.code} at ${err.stage} | ${err.duration}ms | Attempts: ${err.attempts}`);
    }
    // Small inter-request gap to respect Dynadot edge rate-limiting
    await new Promise((r) => setTimeout(r, 600));
  }

  // TEST SUITE 2: Small Controlled Concurrency Test (3 concurrent requests)
  console.log("\n>>> TEST SUITE 2: Controlled Concurrency Test (3 Concurrent Requests) <<<");
  const concurrentBatch = [
    `batch-alpha-${Date.now().toString(36)}.com`,
    `batch-beta-${Date.now().toString(36)}.com`,
    `batch-gamma-${Date.now().toString(36)}.com`,
  ];

  const startTime = Date.now();
  const concurrentPromises = concurrentBatch.map((d) =>
    searchWithRetry(d, { useKeepAlive: false })
      .then((res) => ({ success: true, domain: d, ...res }))
      .catch((err) => ({ success: false, domain: d, ...err }))
  );

  const concurrentResults = await Promise.all(concurrentPromises);
  const totalConcurrentTime = Date.now() - startTime;

  concurrentResults.forEach((r) => {
    if (r.success) {
      console.log(`[CONCURRENT OK]   ${r.domain.padEnd(28)} | HTTP ${r.statusCode} | ${r.duration}ms`);
    } else {
      console.log(`[CONCURRENT FAIL] ${r.domain.padEnd(28)} | Error: ${r.code} (${r.duration}ms)`);
    }
  });

  // METRICS SUMMARY
  const successful1 = results1.filter((r) => !r.failed);
  const failed1 = results1.filter((r) => r.failed);
  const avgDuration1 = Math.round(successful1.reduce((sum, r) => sum + r.duration, 0) / (successful1.length || 1));

  const concurrentSuccess = concurrentResults.filter((r) => r.success);
  const concurrentFailed = concurrentResults.filter((r) => !r.success);

  console.log("\n================================================================");
  console.log("                      BENCHMARK REPORT                          ");
  console.log("================================================================");
  console.log(`Sequential Requests (10 Total):`);
  console.log(`  - Successful: ${successful1.length}/10 (${Math.round((successful1.length / 10) * 100)}%)`);
  console.log(`  - Failed:     ${failed1.length}/10`);
  console.log(`  - Avg Latency: ${avgDuration1}ms`);
  console.log(`\nConcurrent Requests (3 Total):`);
  console.log(`  - Successful: ${concurrentSuccess.length}/3`);
  console.log(`  - Failed:     ${concurrentFailed.length}/3`);
  console.log(`  - Total Batch Time: ${totalConcurrentTime}ms`);
  console.log("================================================================\n");
}

runBenchmark().catch(console.error);
