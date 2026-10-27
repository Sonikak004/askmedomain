import { queryDynadotDomainSearch, UnsupportedTldError } from "./client";
import { processDynadotTierPricing } from "../pricing/markup";
import { DomainSearchResult, DomainSearchResponse } from "@/types";

// Extensions verified and supported by Dynadot RESTful v2
export const SUPPORTED_EXTENSIONS = [
  ".com",
  ".net",
  ".org",
  ".co",
  ".store",
  ".tech",
  ".online",
  ".xyz",
  ".site",
  ".io",
  ".biz",
  ".info",
];

export interface NormalizedDomainInput {
  sld: string;
  tld: string;
  fullDomain: string;
  isBareKeyword: boolean;
}

/**
 * Validates and normalizes user input into SLD and TLD.
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

  // Validate domain characters (a-z, 0-9, hyphens)
  const labelRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
  if (!labelRegex.test(sld)) {
    throw new Error(
      "Invalid domain name format. Only letters, numbers, and hyphens (not leading/trailing) are permitted."
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
 * Searches a single domain via Dynadot RESTful v2 and formats with markup.
 * Handles unsupported TLDs (such as .in) cleanly without throwing fatal errors.
 */
export async function searchSingleDomainDynadot(
  domainName: string
): Promise<DomainSearchResult> {
  const parts = domainName.split(".");
  const sld = parts[0];
  const ext = `.${parts.slice(1).join(".")}`;

  try {
    const dynadotRes = await queryDynadotDomainSearch(domainName);
    const data = dynadotRes.data;

    if (!data) {
      throw new Error(`No data returned by registrar for domain ${domainName}`);
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

    return {
      domain: domainName,
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
        ? "Direct match confirmed via Dynadot registry"
        : "Currently registered by another party",
    };
  } catch (err: unknown) {
    if (err instanceof UnsupportedTldError) {
      return {
        domain: domainName,
        name: sld,
        extension: ext,
        available: false,
        isPremium: false,
        price: 599,
        renewalPrice: 799,
        currency: "INR",
        currencySymbol: "₹",
        period: "/year",
        privacyIncluded: false,
        recommendationReason: `${err.message} Please consider supported alternatives like .com, .net, or .store.`,
      };
    }
    throw err;
  }
}

/**
 * Comprehensive domain search with alternatives querying Dynadot RESTful v2.
 */
export async function executeComprehensiveDomainSearch(
  query: string
): Promise<DomainSearchResponse> {
  const normalized = normalizeDomainInput(query);
  const primaryDomain = normalized.fullDomain;

  // 1. Search primary domain
  const exactMatch = await searchSingleDomainDynadot(primaryDomain);

  // 2. Query alternative extensions (only querying API-supported extensions)
  const targetExtensions = SUPPORTED_EXTENSIONS.filter(
    (ext) => ext !== `.${normalized.tld}`
  ).slice(0, 5); // Pick top 5 alternatives

  const alternativePromises = targetExtensions.map(async (ext) => {
    const candidateDomain = `${normalized.sld}${ext}`;
    try {
      return await searchSingleDomainDynadot(candidateDomain);
    } catch {
      return null;
    }
  });

  const altResults = await Promise.all(alternativePromises);
  const validAlternatives = altResults.filter(
    (item): item is DomainSearchResult => item !== null
  );

  return {
    query,
    exactMatch,
    alternatives: validAlternatives,
    isDemoMode: false,
    timestamp: new Date().toISOString(),
  };
}
