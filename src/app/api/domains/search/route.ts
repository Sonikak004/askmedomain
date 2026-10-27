import { NextRequest, NextResponse } from "next/server";
import { executeFastDomainSearch, normalizeDomainInput } from "@/lib/dynadot/search";
import { POPULAR_TLDS } from "@/config/pricing";
import { DomainSearchResponse, DomainSearchResult } from "@/types";

export async function GET(request: NextRequest) {
  const reqStart = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("domain") || searchParams.get("q") || "";

    if (!rawQuery.trim()) {
      return NextResponse.json(
        { error: "Domain name search query is required" },
        { status: 400 }
      );
    }

    let normalized;
    try {
      normalized = normalizeDomainInput(rawQuery);
    } catch (validationErr: any) {
      return NextResponse.json(
        { error: validationErr.message || "Invalid domain format" },
        { status: 400 }
      );
    }

    const hasDynadotKeys = Boolean(
      process.env.DYNADOT_API_KEY && process.env.DYNADOT_API_SECRET
    );

    // 1. LIVE DYNADOT INTEGRATION WITH IN-MEMORY CACHE
    if (hasDynadotKeys) {
      try {
        const liveResults = await executeFastDomainSearch(normalized.fullDomain);
        const elapsed = Date.now() - reqStart;
        return NextResponse.json({
          ...liveResults,
          searchLatencyMs: elapsed,
        });
      } catch (apiError: any) {
        console.error("Live registry search error:", apiError?.message || apiError);
        return NextResponse.json(
          {
            error:
              apiError?.message ||
              "Unable to verify domain availability from the central registry right now. Please try again.",
          },
          { status: 502 }
        );
      }
    }

    // 2. DEMO MODE FALLBACK (When no credentials are configured)
    const matchedTLD =
      POPULAR_TLDS.find((p) => p.extension === `.${normalized.tld}`) || {
        extension: `.${normalized.tld}`,
        registrationPrice: 860,
        renewalPrice: 1099,
        currency: "INR",
        currencySymbol: "₹",
        period: "/year",
      };

    const isAvailable = !["google", "amazon", "apple", "askmedomain"].includes(normalized.sld);

    const exactMatch: DomainSearchResult = {
      domain: normalized.fullDomain,
      name: normalized.sld,
      extension: `.${normalized.tld}`,
      available: isAvailable,
      isPremium: false,
      price: matchedTLD.registrationPrice,
      renewalPrice: matchedTLD.renewalPrice,
      currency: "INR",
      currencySymbol: "₹",
      period: "/year",
      privacyIncluded: true,
      recommendationReason: isAvailable
        ? "Available for instant registration"
        : "Currently registered",
    };

    const alternatives: DomainSearchResult[] = POPULAR_TLDS.filter(
      (p) => p.extension !== `.${normalized.tld}`
    )
      .slice(0, 4)
      .map((p) => ({
        domain: `${normalized.sld}${p.extension}`,
        name: normalized.sld,
        extension: p.extension,
        available: true,
        price: p.registrationPrice,
        renewalPrice: p.renewalPrice,
        currency: "INR",
        currencySymbol: "₹",
        period: "/year",
        privacyIncluded: true,
        recommendationReason: "Alternative extension recommendation",
      }));

    return NextResponse.json({
      query: rawQuery,
      exactMatch,
      alternatives,
      isDemoMode: true,
      demoNotice: "Demo Mode: Set DYNADOT_API_KEY and DYNADOT_API_SECRET for live registrar queries.",
      timestamp: new Date().toISOString(),
      searchLatencyMs: Date.now() - reqStart,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
