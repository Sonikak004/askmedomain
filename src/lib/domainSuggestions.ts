import { POPULAR_TLDS } from "@/config/pricing";

export interface DomainSuggestion {
  domain: string;
  name: string;
  extension: string;
  price: number;
  currencySymbol: string;
  period: string;
  badge?: string;
  isVariation?: boolean;
}

const TLD_PRIORITY = [".com", ".in", ".net", ".org", ".store", ".tech", ".co", ".io", ".ai", ".online"];

/**
 * Generates instant domain name suggestions as the user types.
 */
export function getDomainSuggestions(input: string, limit = 7): DomainSuggestion[] {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "");

  if (!cleaned || cleaned.length < 1) {
    return [];
  }

  const suggestions: DomainSuggestion[] = [];

  // Check if user has typed a dot (e.g. "mybrand.c" or "mybrand.in")
  if (cleaned.includes(".")) {
    const [base, ...rest] = cleaned.split(".");
    const extTyped = "." + rest.join(".").toLowerCase();

    if (!base) return [];

    // Match extensions that start with what user typed after the dot
    const matchingTlds = POPULAR_TLDS.filter((t) =>
      t.extension.toLowerCase().startsWith(extTyped)
    );

    for (const tld of matchingTlds) {
      suggestions.push({
        domain: `${base}${tld.extension}`,
        name: base,
        extension: tld.extension,
        price: tld.registrationPrice,
        currencySymbol: tld.currencySymbol,
        period: tld.period,
        badge: tld.category === "country" ? "India" : tld.popular ? "Popular" : undefined,
      });
      if (suggestions.length >= limit) break;
    }

    // If no direct extension match, still offer .com and .in
    if (suggestions.length === 0) {
      const defaultCom = POPULAR_TLDS.find((t) => t.extension === ".com");
      if (defaultCom) {
        suggestions.push({
          domain: `${base}.com`,
          name: base,
          extension: ".com",
          price: defaultCom.registrationPrice,
          currencySymbol: defaultCom.currencySymbol,
          period: defaultCom.period,
          badge: "Popular",
        });
      }
    }

    return suggestions;
  }

  // User typed a brand/name without a dot (e.g. "myidea")
  const base = cleaned.replace(/[^a-z0-9-]/g, "");
  if (!base) return [];

  // 1. Direct extension matches (e.g. myidea.com, myidea.in, myidea.store...)
  for (const ext of TLD_PRIORITY) {
    const tld = POPULAR_TLDS.find((t) => t.extension === ext);
    if (tld) {
      let badge: string | undefined;
      if (ext === ".in") badge = "India";
      else if (ext === ".com") badge = "Most Popular";
      else if (ext === ".store") badge = "Ecommerce";
      else if (ext === ".tech") badge = "Tech & AI";
      else if (ext === ".co") badge = "Startup";

      suggestions.push({
        domain: `${base}${ext}`,
        name: base,
        extension: ext,
        price: tld.registrationPrice,
        currencySymbol: tld.currencySymbol,
        period: tld.period,
        badge,
      });

      if (suggestions.length >= 5) break;
    }
  }

  // 2. High-converting brand variations (e.g. getmyidea.com, myideaapp.com)
  const comTld = POPULAR_TLDS.find((t) => t.extension === ".com");
  if (comTld && suggestions.length < limit) {
    const variations = [
      { prefix: "get", suffix: "", label: "Brandable" },
      { prefix: "", suffix: "app", label: "App / SaaS" },
      { prefix: "", suffix: "hq", label: "Company" },
    ];

    for (const v of variations) {
      const varDomain = `${v.prefix}${base}${v.suffix}.com`;
      if (!suggestions.some((s) => s.domain === varDomain)) {
        suggestions.push({
          domain: varDomain,
          name: `${v.prefix}${base}${v.suffix}`,
          extension: ".com",
          price: comTld.registrationPrice,
          currencySymbol: comTld.currencySymbol,
          period: comTld.period,
          badge: v.label,
          isVariation: true,
        });
      }
      if (suggestions.length >= limit) break;
    }
  }

  return suggestions;
}
