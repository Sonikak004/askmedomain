import crypto from "crypto";
import fs from "fs";
import path from "path";

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

// 2. Official Dynadot RESTful v2 HMAC-SHA256 Signature Builder
function buildSignature(apiKey, apiSecret, fullPathAndQuery, xRequestId, requestBody = "") {
  const stringToSign = `${apiKey}\n${fullPathAndQuery}\n${xRequestId || ""}\n${requestBody || ""}`;
  return crypto.createHmac("sha256", apiSecret).update(stringToSign, "utf-8").digest("base64");
}

async function performSearch(domainName) {
  const env = loadEnv();
  const apiKey = env.DYNADOT_API_KEY;
  const apiSecret = env.DYNADOT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing DYNADOT_API_KEY or DYNADOT_API_SECRET in .env.local");
  }

  const endpointPath = `/restful/v2/domains/${encodeURIComponent(domainName)}/search?show_price=true&currency=INR`;
  const xRequestId = crypto.randomUUID();
  const xSignature = buildSignature(apiKey, apiSecret, endpointPath, xRequestId, "");

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    Connection: "close",
    "User-Agent": "AskMeDomain-Client/1.0",
    "X-Request-ID": xRequestId,
    "X-Signature": xSignature,
  };

  const url = `https://api.dynadot.com${endpointPath}`;

  console.log(`[Dynadot Test] Target Domain: ${domainName}`);
  console.log(`[Dynadot Test] Request Endpoint: ${endpointPath}`);
  console.log(`[Dynadot Test] Generated X-Request-ID: ${xRequestId}`);
  console.log(`[Dynadot Test] Signature Generated (HMAC-SHA256 Base64): [Length ${xSignature.length}]`);
  console.log(`[Dynadot Test] Authorization Header format: Bearer [REDACTED_API_KEY]`);

  const startTime = Date.now();
  const response = await fetch(url, { method: "GET", headers });
  const latency = Date.now() - startTime;

  console.log(`[Dynadot Test] HTTP Status: ${response.status} ${response.statusText} (${latency}ms)`);

  const rawJson = await response.json();

  console.log("[Dynadot Test] Parsed Response Payload:");
  console.log(JSON.stringify(rawJson, null, 2));

  // Verify availability parsing
  const isAvailable = rawJson?.data?.available?.toLowerCase() === "yes";
  const isPremium = rawJson?.data?.premium?.toLowerCase() === "yes";
  const prices = rawJson?.data?.price_list || [];

  console.log("\n--- Verification Summary ---");
  console.log(`Domain: ${rawJson?.data?.domain_name || domainName}`);
  console.log(`Available: ${isAvailable ? "YES (Available)" : "NO (Registered / Taken)"}`);
  console.log(`Premium: ${isPremium ? "YES" : "NO"}`);
  if (prices.length > 0) {
    console.log(`Registration Price (1 yr): ${prices[0].registration_price} ${prices[0].currency}`);
    console.log(`Renewal Price (1 yr): ${prices[0].renewal_price} ${prices[0].currency}`);
  }
}

async function run() {
  try {
    console.log("=== 1. Testing read-only search for google.com ===");
    await performSearch("google.com");

    console.log("\nWaiting 1.5s to respect Dynadot rate limit...");
    await new Promise((r) => setTimeout(r, 1500));

    console.log("\n=== 2. Testing read-only search for askmedomain.com ===");
    await performSearch("askmedomain.com");

    console.log("\nWaiting 1.5s to respect Dynadot rate limit...");
    await new Promise((r) => setTimeout(r, 1500));

    const randomDomain = `testdomain-${Date.now().toString(36)}.com`;
    console.log(`\n=== 3. Testing available domain: ${randomDomain} ===`);
    await performSearch(randomDomain);
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

run();
