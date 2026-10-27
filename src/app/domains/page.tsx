"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { DomainSearchResponse, DomainSearchResult } from "@/types";
import {
  Search,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Check,
  Shield,
  ArrowRight,
  Sparkles,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";

function DomainSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || searchParams.get("domain") || "";
  const initialTld = searchParams.get("tld") || "";

  const [inputQuery, setInputQuery] = useState(
    initialQuery || (initialTld ? `mybusiness${initialTld}` : "")
  );
  const [data, setData] = useState<DomainSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addItem, isItemInCart } = useCart();

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/domains/search?domain=${encodeURIComponent(searchTerm.trim())}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to search domain availability");
      }
      const responseData: DomainSearchResponse = await res.json();
      setData(responseData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else if (initialTld) {
      performSearch(`myidea${initialTld}`);
    } else {
      // Default initial search
      performSearch("mybrand.com");
    }
  }, [initialQuery, initialTld]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    router.push(`/domains?q=${encodeURIComponent(inputQuery.trim())}`);
    performSearch(inputQuery.trim());
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search another domain (e.g. startupidea.in)"
                className="w-full pl-11 pr-4 py-3 text-base text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <Search className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick TLD Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Quick search:</span>
            {[".com", ".in", ".org", ".net", ".co", ".store", ".tech", ".ai"].map((ext) => (
              <button
                key={ext}
                type="button"
                onClick={() => {
                  const base = (inputQuery.split(".")[0] || "mybrand").trim();
                  const newTerm = `${base}${ext}`;
                  setInputQuery(newTerm);
                  router.push(`/domains?q=${encodeURIComponent(newTerm)}`);
                  performSearch(newTerm);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#0052FF] text-slate-700 font-medium transition-colors cursor-pointer"
              >
                {ext}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Mode / Registrar Architecture Banner */}
        {data?.isDemoMode && (
          <div className="mt-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950">
              <span className="font-bold">Dynadot Registrar Integration Ready:</span>{" "}
              {data.demoNotice}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-8 space-y-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {!loading && data && (
          <div className="mt-8 space-y-8">
            {/* 1. Exact Match Card */}
            <div
              className={`rounded-2xl p-6 sm:p-8 border transition-all bg-white shadow-xs ${
                data.exactMatch.available
                  ? "border-emerald-300 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {data.exactMatch.domain}
                    </span>
                    {data.exactMatch.available ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Available Now</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Already Registered</span>
                      </span>
                    )}

                    {data.exactMatch.isPremium && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Short / Premium TLD
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {data.exactMatch.available
                      ? "Congratulations! This domain is available to register right now."
                      : "This exact name is taken. Check out recommended alternatives below."}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      Free WHOIS Privacy Protection
                    </span>
                    <span>•</span>
                    <span>Instant DNS setup</span>
                  </div>
                </div>

                {/* Pricing & Add to Cart button */}
                {data.exactMatch.available ? (
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-3xl font-black text-slate-900">
                        {data.exactMatch.currencySymbol}
                        {data.exactMatch.price.toLocaleString("en-IN")}
                        <span className="text-xs font-medium text-slate-500">
                          {data.exactMatch.period}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Renews at {data.exactMatch.currencySymbol}
                        {data.exactMatch.renewalPrice.toLocaleString("en-IN")}/yr
                      </div>
                    </div>

                    {isItemInCart(data.exactMatch.domain) ? (
                      <Link
                        href="/cart"
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>In Cart – View Checkout</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addItem(data.exactMatch)}
                        className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/support?query=transfer_${encodeURIComponent(data.exactMatch.domain)}`}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                    >
                      Check Transfer Status
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Alternative Extensions & Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF5500]" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Recommended Available Alternatives
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {data.alternatives.length} matching ideas found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.alternatives.map((alt) => {
                  const inCart = isItemInCart(alt.domain);
                  return (
                    <div
                      key={alt.domain}
                      className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base truncate">
                            {alt.domain}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 shrink-0">
                            Available
                          </span>
                        </div>
                        {alt.recommendationReason && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {alt.recommendationReason}
                          </p>
                        )}
                        <div className="mt-1 text-xs text-slate-600">
                          <span className="font-bold text-slate-900">
                            {alt.currencySymbol}
                            {alt.price.toLocaleString("en-IN")}
                          </span>{" "}
                          <span className="text-slate-400">{alt.period}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {inCart ? (
                          <Link
                            href="/cart"
                            className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>In Cart</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addItem(alt)}
                            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-[#0052FF] hover:text-white text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Select</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Checkout CTA Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg">Ready to register your selected names?</h4>
                <p className="text-xs text-blue-200 mt-0.5">
                  Secure checkout with instant digital provisioning and 24/7 technical support.
                </p>
              </div>
              <Link
                href="/cart"
                className="px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-sm shadow-md flex items-center gap-2 shrink-0 transition-colors"
              >
                <span>Proceed to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DomainsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
        </div>
      }
    >
      <DomainSearchContent />
    </Suspense>
  );
}
