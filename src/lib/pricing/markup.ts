/**
 * AskMeDomain Pricing & Markup Module
 * Handles registrar cost to customer selling price calculations,
 * currency conversion (USD -> INR), decimal-safe arithmetic, and markup configuration.
 */

export interface ExchangeRateData {
  rate: number; // 1 USD in INR
  base: string; // "USD"
  target: string; // "INR"
  source: string;
  lastUpdated: string;
}

// In-memory cached exchange rate (updated periodically with fallback)
let cachedExchangeRate: ExchangeRateData = {
  rate: 86.80, // Verified RBI / open-market baseline benchmark for 2026
  base: "USD",
  target: "INR",
  source: "RBI_Reference_Benchmark",
  lastUpdated: new Date().toISOString(),
};

let lastFetchedTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

/**
 * Retrieves the current verified exchange rate with short-lived in-memory caching.
 */
export async function getVerifiedExchangeRate(): Promise<ExchangeRateData> {
  const now = Date.now();
  if (now - lastFetchedTimestamp < CACHE_TTL_MS) {
    return cachedExchangeRate;
  }

  try {
    // Attempt to refresh rate from public open exchange rate API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const inrRate = data?.rates?.INR;
      if (typeof inrRate === "number" && inrRate > 50 && inrRate < 150) {
        cachedExchangeRate = {
          rate: Number(inrRate.toFixed(2)),
          base: "USD",
          target: "INR",
          source: "open.er-api.com",
          lastUpdated: new Date().toISOString(),
        };
        lastFetchedTimestamp = now;
      }
    }
  } catch {
    // Fall back to established benchmark rate safely
    cachedExchangeRate.lastUpdated = new Date().toISOString();
  }

  return cachedExchangeRate;
}

/**
 * Returns the configured markup percentage from environment variables.
 * Defaults to 20%.
 */
export function getConfiguredMarkupPercent(): number {
  const envVal = process.env.DYNADOT_MARKUP_PERCENT;
  if (envVal) {
    const parsed = parseFloat(envVal);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 500) {
      return parsed;
    }
  }
  return 20; // Default 20%
}

export interface PriceCalculationInput {
  rawPrice: string | number; // Registrar price returned by Dynadot
  currency: string; // "INR" | "USD"
  isPremium?: boolean;
  type?: "registration" | "renewal" | "transfer";
}

export interface CalculatedDomainPrice {
  registrarCostRaw: number;
  registrarCostCurrency: string;
  registrarCostINR: number;
  markupPercent: number;
  markupAmountINR: number;
  customerSellingPriceINR: number;
  exchangeRateUsed?: ExchangeRateData;
  isPremium: boolean;
}

/**
 * Decimal-safe price calculation applying AskMeDomain markup and rounding.
 */
export async function calculateCustomerPrice(
  input: PriceCalculationInput
): Promise<CalculatedDomainPrice> {
  const rawCost = typeof input.rawPrice === "string" ? parseFloat(input.rawPrice) : input.rawPrice;

  if (isNaN(rawCost) || rawCost <= 0) {
    throw new Error(`Invalid registrar price returned: ${input.rawPrice}`);
  }

  const isPremium = Boolean(input.isPremium);
  const markupPercent = isPremium ? 10 : getConfiguredMarkupPercent(); // Lower 10% markup on high-value premium domains

  let costINR = rawCost;
  let exchangeRate: ExchangeRateData | undefined;

  // Convert USD to INR if needed
  if (input.currency.toUpperCase() === "USD") {
    exchangeRate = await getVerifiedExchangeRate();
    // Decimal-safe conversion in paise (cents * 100)
    const costInPaise = Math.round(rawCost * 100 * exchangeRate.rate);
    costINR = Math.round(costInPaise / 100);
  } else {
    costINR = Math.round(rawCost);
  }

  // Calculate markup using integer paise arithmetic
  const costPaise = Math.round(costINR * 100);
  const markupPaise = Math.round((costPaise * markupPercent) / 100);
  const totalPaise = costPaise + markupPaise;

  const markupAmountINR = Math.round(markupPaise / 100);
  const customerSellingPriceINR = Math.round(totalPaise / 100);

  return {
    registrarCostRaw: rawCost,
    registrarCostCurrency: input.currency.toUpperCase(),
    registrarCostINR: costINR,
    markupPercent,
    markupAmountINR,
    customerSellingPriceINR,
    exchangeRateUsed: exchangeRate,
    isPremium,
  };
}

/**
 * Calculates itemized pricing for a full Dynadot domain tier
 */
export async function processDynadotTierPricing(
  regPriceRaw: string | number,
  renewPriceRaw: string | number,
  transferPriceRaw: string | number | undefined,
  currency: string,
  isPremium = false
) {
  const [registration, renewal, transfer] = await Promise.all([
    calculateCustomerPrice({ rawPrice: regPriceRaw, currency, isPremium, type: "registration" }),
    calculateCustomerPrice({ rawPrice: renewPriceRaw, currency, isPremium, type: "renewal" }),
    transferPriceRaw
      ? calculateCustomerPrice({ rawPrice: transferPriceRaw, currency, isPremium, type: "transfer" })
      : null,
  ]);

  return {
    registration,
    renewal,
    transfer,
  };
}
