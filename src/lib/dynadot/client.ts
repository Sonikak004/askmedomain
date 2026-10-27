import crypto from "crypto";
import { DynadotSearchApiResponse } from "./types";

const DYNADOT_BASE_URL = "https://api.dynadot.com";
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_READ_ONLY_RETRIES = 2;

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
 * Low-level single attempt HTTPS fetch using non-persistent connection.
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
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${creds.apiKey}`,
        Connection: "close",
        "User-Agent": "AskMeDomain-Platform/1.0",
        "X-Request-ID": xRequestId,
        "X-Signature": signature,
      },
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
    const code = isTimeout ? "ETIMEDOUT" : (err as any)?.cause?.code || "NETWORK_ERROR";

    const errorObj = new Error(`Dynadot API call failed [${code}]: ${message}`);
    (errorObj as any).code = code;
    throw errorObj;
  }
}

/**
 * Executes a read-only Dynadot RESTful v2 domain search with exponential backoff & jitter.
 */
export async function queryDynadotDomainSearch(domainName: string): Promise<DynadotSearchApiResponse> {
  const creds = getDynadotCredentials();
  const cleanDomain = domainName.trim().toLowerCase();
  const ext = cleanDomain.includes(".") ? `.${cleanDomain.split(".").slice(1).join(".")}` : ".com";

  // Known TLDs unsupported by Dynadot's reseller API
  if (ext === ".in" || ext.endsWith(".in")) {
    throw new UnsupportedTldError(
      ext,
      `The ${ext} extension is managed by the Indian registry (NIXI) and is not supported through Dynadot's reseller API.`
    );
  }

  const endpointPath = `/restful/v2/domains/${encodeURIComponent(
    cleanDomain
  )}/search?show_price=true&currency=INR`;

  for (let attempt = 0; attempt <= MAX_READ_ONLY_RETRIES; attempt++) {
    try {
      const response = await sendSingleRequest(endpointPath, creds);

      // Dynadot REST API returns code: 200 for successful search
      if (response.code === 200) {
        return response;
      }

      // Check specifically if Dynadot flagged this TLD as unsupported
      const errorDesc = response.error?.description || "";
      if (errorDesc.toLowerCase().includes("tld isn't supported")) {
        throw new UnsupportedTldError(ext, `This TLD (${ext}) is not supported via the Dynadot API.`);
      }

      if (errorDesc) {
        throw new Error(`Dynadot registrar error: ${errorDesc}`);
      }

      return response;
    } catch (err: any) {
      if (err instanceof UnsupportedTldError) {
        throw err; // Do not retry unsupported TLDs
      }

      const isRetryable =
        err.code === "ECONNRESET" ||
        err.code === "ETIMEDOUT" ||
        err.code === "ECONNREFUSED" ||
        err.code === "EAI_AGAIN";

      if (!isRetryable || attempt === MAX_READ_ONLY_RETRIES) {
        throw err;
      }

      const jitter = Math.floor(Math.random() * 200);
      const delay = Math.pow(2, attempt) * 400 + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Exhausted retries while querying domain ${domainName}`);
}
