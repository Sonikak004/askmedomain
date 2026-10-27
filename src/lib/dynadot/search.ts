import { queryDynadotDomainSearch, UnsupportedTldError } from "./client";
import { processDynadotTierPricing } from "../pricing/markup";
import { DomainSearchResult, DomainSearchResponse } from "@/types";

// Extensions verified for Dynadot RESTful v2
export const POPULAR_SUGGESTION_TLDS = [
  ".com",
  ".net",
  ".org",
  ".co",
  ".store",
  ".tech",
  ".online",
  ".io",
  ".xyz",
  ".site",
  ".biz",
];

// Short-lived in-memory cache for search results (3 minutes TTL)
interface CacheEntry {
  data: DomainSearchResult;
  timestamp: number;
}
const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 3 * 60 * 1000;

export interface NormalizedDomainInput {
  sld: string;
  tld: string;
  fullDomain: string;
  isBareKeyword: boolean;
}

/**
 * Validates and normalizes user input into clean SLD and TLD.
 * Handles "my business", "mybusiness", "https://mybusiness.com", etc.
 */
export function normalizeDomainInput(rawInput: string): NormalizedDomainInput {
  let cleaned = rawInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "");

  let sld = cleaned;
  let tld = "com";
  let isBareKeyword = true;

  if (cleaned.includes(".")) {
    const parts = cleaned.split(".");
    sld = parts[0];
    tld = parts.slice(1).join(".");
    isBareKeyword = false;
  }

  // Validate domain characters (letters, numbers, hyphens)
  const labelRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
  if (!labelRegex.test(sld)) {
    throw new Error(
      "Invalid domain format. Domain names can only contain letters, numbers, and hyphens (not starting or ending with a hyphen)."
    );
  }

  return {
    sld,
    tld,
    fullDomain: `${sld}.${tld}`,
    isBareKeyword,
  };
}

/**
 * High-speed single domain search with in-memory caching.
 */
export async function searchSingleDomainCached(
  domainName: string
): Promise<DomainSearchResult> {
  const cleanDomain = domainName.trim().toLowerCase();
  const cached = searchCache.get(cleanDomain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const parts = cleanDomain.split(".");
  const sld = parts[0];
  const ext = `.${parts.slice(1).join(".")}`;

  try {
    const dynadotRes = await queryDynadotDomainSearch(cleanDomain);
    const data = dynadotRes.data;

    if (!data) {
      throw new Error(`No registry data returned for ${cleanDomain}`);
    }

    const isAvailable = data.available?.toLowerCase() === "yes";
    const isPremium = data.premium?.toLowerCase() === "yes";

    let customerRegPrice = 860;
    let customerRenewalPrice = 1099;
    let customerTransferPrice = 860;
    const currencySymbol = "₹";

    const tier = data.price_list?.[0];
    if (tier) {
      const pricing = await processDynadotTierPricing(
        tier.registration_price,
        tier.renewal_price,
        tier.transfer_price,
        tier.currency || "INR",
        isPremium
      );

      customerRegPrice = pricing.registration.customerSellingPriceINR;
      customerRenewalPrice = pricing.renewal.customerSellingPriceINR;
      customerTransferPrice = pricing.transfer
        ? pricing.transfer.customerSellingPriceINR
        : customerRegPrice;
    }

    const result: DomainSearchResult = {
      domain: cleanDomain,
      name: sld,
      extension: ext,
      available: isAvailable,
      isPremium,
      price: customerRegPrice,
      renewalPrice: customerRenewalPrice,
      currency: "INR",
      currencySymbol,
      period: "/year",
      privacyIncluded: true,
      recommendationReason: isAvailable
        ? "Verified available for instant registration"
        : "Currently registered by another party",
    };

    searchCache.set(cleanDomain, { data: result, timestamp: Date.now() });
    return result;
  } catch (err: unknown) {
    if (err instanceof UnsupportedTldError) {
      const fallbackResult: DomainSearchResult = {
        domain: cleanDomain,
        name: sld,
        extension: ext,
        available: false,
        isPremium: false,
        isUnsupported: true,
        price: 0,
        renewalPrice: 0,
        currency: "INR",
        currencySymbol: "₹",
        period: "/year",
        privacyIncluded: false,
        recommendationReason: `Automated registry lookup is temporarily unavailable for ${ext} on this API gateway. Please browse verified alternatives below or contact our support team.`,
      };
      return fallbackResult;
    }
    throw err;
  }
}

/**
 * Searches alternative extensions progressively for a given SLD.
 */
export async function searchAlternativeExtensions(
  sld: string,
  excludeTld: string
): Promise<DomainSearchResult[]> {
  const targetTlds = POPULAR_SUGGESTION_TLDS.filter(
    (ext) => ext !== `.${excludeTld}`
  ).slice(0, 5);

  const promises = targetTlds.map(async (ext) => {
    try {
      return await searchSingleDomainCached(`${sld}${ext}`);
    } catch {
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r): r is DomainSearchResult => r !== null);
}

/**
 * Fast primary domain search. Returns exact match and concurrently loads alternatives.
 */
export async function executeFastDomainSearch(
  query: string
): Promise<DomainSearchResponse> {
  const normalized = normalizeDomainInput(query);
  const startTime = Date.now();

  // 1. Fetch exact match
  const exactMatch = await searchSingleDomainCached(normalized.fullDomain);

  // 2. Fetch alternative extensions concurrently (limited to top 4 for maximum speed)
  const targetExtensions = POPULAR_SUGGESTION_TLDS.filter(
    (ext) => ext !== `.${normalized.tld}`
  ).slice(0, 4);

  const altPromises = targetExtensions.map((ext) =>
    searchSingleDomainCached(`${normalized.sld}${ext}`).catch(() => null)
  );

  const alternativesRaw = await Promise.all(altPromises);
  const alternatives = alternativesRaw.filter(
    (item): item is DomainSearchResult => item !== null
  );

  return {
    query: normalized.fullDomain,
    exactMatch,
    alternatives,
    isDemoMode: false,
    timestamp: new Date().toISOString(),
  };
}
