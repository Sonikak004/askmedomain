import crypto from "crypto";
import { Agent as UndiciAgent, fetch as undiciFetch } from "undici";
import { DynadotSearchApiResponse } from "./types";

const DYNADOT_BASE_URL = "https://api.dynadot.com";
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_READ_ONLY_RETRIES = 2; // Up to 2 retries (3 total attempts)

// Undici dispatcher configured specifically with non-persistent connections
// to prevent stale socket reuse against Dynadot's edge load balancer
const undiciDispatcher = new UndiciAgent({
  keepAliveTimeout: 1,
  keepAliveMaxTimeout: 1,
  pipelining: 0,
  connect: {
    timeout: DEFAULT_TIMEOUT_MS,
  },
});

export interface DynadotClientConfig {
  apiKey: string;
  apiSecret: string;
  mode: "production" | "sandbox";
}

export class UnsupportedTldError extends Error {
  tld: string;
  constructor(tld: string, message: string) {
    super(message);
    this.name = "UnsupportedTldError";
    this.tld = tld;
  }
}

/**
 * Returns server-side Dynadot credentials.
 */
export function getDynadotCredentials(): DynadotClientConfig {
  const apiKey = process.env.DYNADOT_API_KEY;
  const apiSecret = process.env.DYNADOT_API_SECRET;
  const mode = (process.env.DYNADOT_API_MODE as "production" | "sandbox") || "production";

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Dynadot API credentials not configured. Please set DYNADOT_API_KEY and DYNADOT_API_SECRET."
    );
  }

  return { apiKey, apiSecret, mode };
}

/**
 * Official Dynadot RESTful v2 HMAC-SHA256 signature generator.
 */
export function generateDynadotSignature(
  apiKey: string,
  apiSecret: string,
  fullPathAndQuery: string,
  xRequestId: string,
  requestBody = ""
): string {
  const stringToSign = `${apiKey}\n${fullPathAndQuery}\n${xRequestId || ""}\n${requestBody || ""}`;
  return crypto.createHmac("sha256", apiSecret).update(stringToSign, "utf-8").digest("base64");
}

/**
 * Evaluates whether an error indicates an intermittent network / connection reset failure.
 */
export function isNetworkRetryableError(err: any): boolean {
  if (!err) return false;
  const code = String(err?.code || err?.cause?.code || "");
  const msg = (String(err?.message || "") + " " + String(err?.cause?.message || "")).toLowerCase();

  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "EAI_AGAIN" ||
    code === "UND_ERR_SOCKET" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_HEADERS_TIMEOUT" ||
    msg.includes("econnreset") ||
    msg.includes("fetch failed") ||
    msg.includes("socket hang up") ||
    msg.includes("connection reset") ||
    msg.includes("abort") ||
    msg.includes("network error")
  );
}

/**
 * Low-level single attempt HTTPS fetch using Undici dispatcher.
 */
async function sendSingleRequest(
  endpointPath: string,
  creds: DynadotClientConfig
): Promise<DynadotSearchApiResponse> {
  const xRequestId = crypto.randomUUID();
  const signature = generateDynadotSignature(creds.apiKey, creds.apiSecret, endpointPath, xRequestId);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const url = `${DYNADOT_BASE_URL}${endpointPath}`;
    const response = await undiciFetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${creds.apiKey}`,
        Connection: "close",
        "User-Agent": "AskMeDomain-Platform/1.0",
        "X-Request-ID": xRequestId,
        "X-Signature": signature,
      },
      // Pass Undici dispatcher to explicitly control connection pooling and keep-alive
      dispatcher: undiciDispatcher,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const rawData = await response.json();
    return rawData as DynadotSearchApiResponse;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    const code = isTimeout ? "ETIMEDOUT" : (err as any)?.cause?.code || (err as any)?.code || "NETWORK_ERROR";

    const errorObj = new Error(`Dynadot API request error [${code}]: ${message}`);
    (errorObj as any).code = code;
    (errorObj as any).cause = (err as any)?.cause;
    throw errorObj;
  }
}

/**
 * Executes a read-only Dynadot RESTful v2 domain search with automatic retries (up to 2 retries)
 * for ECONNRESET / network failures.
 */
export async function queryDynadotDomainSearch(domainName: string): Promise<DynadotSearchApiResponse> {
  const creds = getDynadotCredentials();
  const cleanDomain = domainName.trim().toLowerCase();
  const ext = cleanDomain.includes(".") ? `.${cleanDomain.split(".").slice(1).join(".")}` : ".com";

  const endpointPath = `/restful/v2/domains/${encodeURIComponent(
    cleanDomain
  )}/search?show_price=true&currency=INR`;

  let lastError: any = null;

  for (let attempt = 0; attempt <= MAX_READ_ONLY_RETRIES; attempt++) {
    try {
      const response = await sendSingleRequest(endpointPath, creds);

      // Dynadot REST API returns code: 200 for successful search
      if (response.code === 200) {
        return response;
      }

      // Check specifically if Dynadot flagged this TLD as unsupported via this API tier
      const errorDesc = response.error?.description || "";
      if (
        errorDesc.toLowerCase().includes("tld isn't supported") ||
        errorDesc.toLowerCase().includes("not supported via the api")
      ) {
        throw new UnsupportedTldError(
          ext,
          `Automated API check is not enabled for ${ext} on this registrar API tier.`
        );
      }

      if (errorDesc) {
        throw new Error(`Dynadot registrar error: ${errorDesc}`);
      }

      return response;
    } catch (err: any) {
      lastError = err;

      // Do not retry permanent unsupported TLD or auth errors
      if (err instanceof UnsupportedTldError) {
        throw err;
      }

      const retryable = isNetworkRetryableError(err);
      const isLastAttempt = attempt === MAX_READ_ONLY_RETRIES;

      console.warn(
        `[Dynadot API] Attempt ${attempt + 1}/${MAX_READ_ONLY_RETRIES + 1} for ${cleanDomain} failed: ${
          err?.code || err?.message
        } (retryable: ${retryable})`
      );

      if (!retryable || isLastAttempt) {
        throw err;
      }

      // Exponential backoff with jitter: 200ms-400ms for attempt 1, 400ms-600ms for attempt 2
      const jitter = Math.floor(Math.random() * 150);
      const delay = (attempt + 1) * 200 + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error(`Exhausted retries while checking domain ${domainName}`);
}
