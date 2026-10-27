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
  ArrowRight,
  Info,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const LOADING_STATUS_MESSAGES = [
  "Querying central domain registry...",
  "Checking real-time availability...",
  "Calculating live wholesale rates...",
  "Finding available extension alternatives...",
];

function DomainSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || searchParams.get("domain") || "";
  const initialTld = searchParams.get("tld") || "";

  const [inputQuery, setInputQuery] = useState(
    initialQuery || (initialTld ? `yourbrand${initialTld}` : "")
  );
  const [data, setData] = useState<DomainSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchingDomain, setCurrentSearchingDomain] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);

  const { addItem, isItemInCart } = useCart();

  // Active elapsed timer during loading
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let messageTimer: NodeJS.Timeout;

    if (loading) {
      setElapsedTime(0);
      setStatusMessageIndex(0);
      const start = Date.now();

      timer = setInterval(() => {
        setElapsedTime(Number(((Date.now() - start) / 1000).toFixed(1)));
      }, 100);

      messageTimer = setInterval(() => {
        setStatusMessageIndex((prev) => (prev + 1) % LOADING_STATUS_MESSAGES.length);
      }, 900);
    }

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [loading]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim();
    setCurrentSearchingDomain(term);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/domains/search?domain=${encodeURIComponent(term)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unable to check domain availability.");
      }
      const responseData: DomainSearchResponse = await res.json();
      setData(responseData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else if (initialTld) {
      performSearch(`yourbrand${initialTld}`);
    } else {
      performSearch("yourbrand.com");
    }
  }, [initialQuery, initialTld]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    router.push(`/domains?q=${encodeURIComponent(inputQuery.trim())}`);
    performSearch(inputQuery.trim());
  };

  return (
    <div className="bg-slate-50/70 min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Search Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search for a domain (e.g. yourbrand.com)"
                className="w-full pl-11 pr-4 py-3 text-base sm:text-lg text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0052FF]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
            >
              <span>Search</span>
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Extension Chips */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Popular:</span>
            {[".com", ".net", ".org", ".co", ".store", ".tech", ".online", ".in"].map((ext) => (
              <button
                key={ext}
                type="button"
                onClick={() => {
                  const base = (inputQuery.split(".")[0] || "yourbrand").trim();
                  const newTerm = `${base}${ext}`;
                  setInputQuery(newTerm);
                  router.push(`/domains?q=${encodeURIComponent(newTerm)}`);
                  performSearch(newTerm);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                {ext}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE (Immediate, within 100ms) */}
        {loading && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Live Progress Banner */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#0052FF] animate-ping" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Checking availability for{" "}
                    <span className="text-[#0052FF] font-black">{currentSearchingDomain}</span>
                  </h3>
                  <p className="text-xs text-slate-500 transition-all duration-200">
                    {LOADING_STATUS_MESSAGES[statusMessageIndex]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{elapsedTime.toFixed(1)}s</span>
              </div>
            </div>

            {/* Skeleton Primary Card matching eventual layout */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-100/70 to-transparent" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-3 w-full sm:w-2/3">
                  <div className="w-32 h-6 bg-slate-200 rounded-full" />
                  <div className="w-64 h-10 bg-slate-200 rounded-xl" />
                  <div className="w-48 h-4 bg-slate-100 rounded" />
                </div>
                <div className="space-y-2 w-full sm:w-1/3 flex flex-col sm:items-end">
                  <div className="w-36 h-10 bg-slate-200 rounded-xl" />
                  <div className="w-28 h-4 bg-slate-100 rounded" />
                  <div className="w-36 h-12 bg-slate-200 rounded-xl mt-2" />
                </div>
              </div>
            </div>

            {/* Skeleton Alternative Cards */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
                  <div className="w-40 h-6 bg-slate-200 rounded" />
                  <div className="w-24 h-8 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Notice */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registry Search Error</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">{error}</p>
            </div>
            <button
              onClick={() => performSearch(inputQuery || "yourbrand.com")}
              className="px-5 py-2.5 rounded-xl bg-[#0052FF] text-white font-bold text-xs"
            >
              Try Search Again
            </button>
          </div>
        )}

        {/* COMPLETED RESULTS DISPLAY */}
        {!loading && data && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 1. PRIMARY RESULT HERO CARD (Designed to Sell) */}
            <div
              className={`bg-white rounded-3xl p-7 sm:p-10 border-2 transition-all shadow-sm ${
                data.exactMatch.available
                  ? "border-emerald-400 ring-4 ring-emerald-500/10"
                  : data.exactMatch.isUnsupported
                  ? "border-amber-300 ring-4 ring-amber-500/10"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Side: Status & Big Domain Name */}
                <div className="space-y-3">
                  {data.exactMatch.available ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Domain Available</span>
                    </div>
                  ) : data.exactMatch.isUnsupported ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Automated Check Unavailable</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span>Already Registered</span>
                    </div>
                  )}

                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight break-all">
                    {data.exactMatch.domain}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500">
                    {data.exactMatch.recommendationReason ||
                      (data.exactMatch.available
                        ? "Verified available for instant registration."
                        : data.exactMatch.isUnsupported
                        ? "Automated verification is not currently enabled for this extension on our API tier."
                        : "This domain is currently owned by someone else.")}
                  </p>
                </div>

                {/* Right Side: Big Bold Price & Action Button */}
                {data.exactMatch.available ? (
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        {data.exactMatch.currencySymbol}
                        {data.exactMatch.price.toLocaleString("en-IN")}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 font-medium">
                        First year · Renews at {data.exactMatch.currencySymbol}
                        {data.exactMatch.renewalPrice.toLocaleString("en-IN")}/yr · Plus taxes
                      </div>
                    </div>

                    {isItemInCart(data.exactMatch.domain) ? (
                      <Link
                        href="/cart"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                      >
                        <Check className="w-5 h-5" />
                        <span>In Cart – Checkout</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addItem(data.exactMatch)}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-black text-base shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                ) : data.exactMatch.isUnsupported ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 lg:pt-0">
                    <Link
                      href="/support"
                      className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                    >
                      <Info className="w-4 h-4 text-amber-400" />
                      <span>Contact Domain Desk</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center pt-2 lg:pt-0">
                    <span className="text-xs font-semibold text-slate-400">
                      Check available matching extensions below
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. ALTERNATIVES LIST (Clean & Scannable) */}
            {data.alternatives.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-base font-bold text-slate-900">
                    More Extensions for &ldquo;{data.exactMatch.name}&rdquo;
                  </h3>
                  <span className="text-xs text-slate-400">
                    Verified availability via Dynadot API
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {data.alternatives.map((alt) => {
                    const inCart = isItemInCart(alt.domain);
                    return (
                      <div
                        key={alt.domain}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900 text-lg">
                            {alt.domain}
                          </span>
                          {alt.available ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Available
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                              Registered
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          {alt.available && (
                            <div className="text-right">
                              <span className="text-lg font-black text-slate-900">
                                {alt.currencySymbol}
                                {alt.price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs text-slate-400 font-normal">
                                {" "}
                                {alt.period}
                              </span>
                            </div>
                          )}

                          {alt.available ? (
                            inCart ? (
                              <Link
                                href="/cart"
                                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>In Cart</span>
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addItem(alt)}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#0052FF] hover:text-white text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            )
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
          <div className="w-8 h-8 rounded-full border-2 border-[#0052FF] border-t-transparent animate-spin" />
        </div>
      }
    >
      <DomainSearchContent />
    </Suspense>
  );
}
