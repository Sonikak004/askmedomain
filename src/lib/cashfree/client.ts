export interface CashfreeCredentials {
  appId: string;
  secretKey: string;
  isProduction: boolean;
  baseUrl: string;
}

export interface CreateOrderParams {
  orderId: string;
  amount: number;
  currency?: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
  };
  returnUrl: string;
  note?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED";
  order_amount: number;
  order_currency: string;
  payment_session_id: string;
}

export function getCashfreeCredentials(): CashfreeCredentials {
  const appId = process.env.CASHFREE_APP_ID || "";
  const secretKey = process.env.CASHFREE_SECRET_KEY || "";
  const env = (process.env.CASHFREE_ENV || "sandbox").toLowerCase();
  const isProduction = env === "production" || env === "prod";

  const baseUrl = isProduction
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

  return { appId, secretKey, isProduction, baseUrl };
}

export function isCashfreeConfigured(): boolean {
  const { appId, secretKey } = getCashfreeCredentials();
  return Boolean(appId && secretKey);
}

/**
 * Creates a Cashfree payment order using the 2023-08-01 API
 */
export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const { appId, secretKey, baseUrl } = getCashfreeCredentials();

  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree credentials are not configured. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local."
    );
  }

  // Ensure clean 10-digit phone without country code or spaces
  const cleanPhone = params.customer.phone.replace(/[^0-9]/g, "").slice(-10);
  const customerId = (params.customer.id || `cust_${cleanPhone || Date.now()}`).slice(0, 50);

  const payload = {
    order_id: params.orderId,
    order_amount: Number(params.amount.toFixed(2)),
    order_currency: params.currency || "INR",
    customer_details: {
      customer_id: customerId,
      customer_name: params.customer.name.slice(0, 100),
      customer_email: params.customer.email.slice(0, 100),
      customer_phone: cleanPhone || "9999999999",
    },
    order_meta: {
      return_url: params.returnUrl,
    },
    order_note: params.note || "Domain Registration Order",
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMsg =
      responseData?.message ||
      responseData?.error?.description ||
      `Cashfree error (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  return responseData as CashfreeOrderResponse;
}

/**
 * Verifies a Cashfree order status
 */
export async function verifyCashfreeOrder(orderId: string): Promise<{
  orderId: string;
  status: "PAID" | "ACTIVE" | "EXPIRED" | "FAILED" | "UNKNOWN";
  amount: number;
  currency: string;
  raw: any;
}> {
  const { appId, secretKey, baseUrl } = getCashfreeCredentials();

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials are not configured.");
  }

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Failed to verify order ${orderId}`);
  }

  return {
    orderId: data.order_id,
    status: data.order_status,
    amount: data.order_amount,
    currency: data.order_currency,
    raw: data,
  };
}
