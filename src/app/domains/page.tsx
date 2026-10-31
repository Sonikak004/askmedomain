"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { DomainSearchResponse, DomainSearchResult } from "@/types";
import { POPULAR_TLDS } from "@/config/pricing";
import { getDomainSuggestions, DomainSuggestion } from "@/lib/domainSuggestions";
import { AiDomainAssistantModal } from "@/components/home/AiDomainAssistantModal";
import {
  Search,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Check,
  Clock,
  AlertCircle,
  Info,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Globe,
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

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [data, setData] = useState<DomainSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchingDomain, setCurrentSearchingDomain] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);

  // Suggestions state while typing
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // AI Assistant Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Filters & Sorting for alternative extensions
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc">("recommended");

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

  // Suggestions update as user types
  useEffect(() => {
    if (inputQuery.trim().length >= 1) {
      const results = getDomainSuggestions(inputQuery.trim(), 6);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;

    setShowSuggestions(false);
    setData(null);
    setError(null);
    setCurrentSearchingDomain(term);
    setLoading(true);

    try {
      const res = await fetch(`/api/domains/search?domain=${encodeURIComponent(term)}`);
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || "We couldn’t check availability. Please try again.");
      }
      setData(responseData);
    } catch (err: unknown) {
      setData(null);
      setError(
        err instanceof Error ? err.message : "We couldn’t check availability. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery.trim()) {
      setInputQuery(initialQuery.trim());
      performSearch(initialQuery.trim());
    } else if (initialTld.trim()) {
      setInputQuery(`mybrand${initialTld.trim()}`);
      performSearch(`mybrand${initialTld.trim()}`);
    } else {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, [initialQuery, initialTld]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    setShowSuggestions(false);
    router.push(`/domains?q=${encodeURIComponent(inputQuery.trim())}`);
    performSearch(inputQuery.trim());
  };

  const handleSelectSuggestion = (suggestedDomain: string) => {
    setShowSuggestions(false);
    setInputQuery(suggestedDomain);
    router.push(`/domains?q=${encodeURIComponent(suggestedDomain)}`);
    performSearch(suggestedDomain);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestionIndex].domain);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Best available alternative when exact match is already registered
  const topAvailableAlternative = useMemo(() => {
    if (!data || data.exactMatch.available) return null;
    return data.alternatives.find((a) => a.available) || null;
  }, [data]);

  // Filtered & sorted alternatives
  const displayedAlternatives = useMemo(() => {
    if (!data?.alternatives) return [];

    let list = [...data.alternatives];

    if (activeFilter === "under-1000") {
      list = list.filter((a) => a.price < 1000);
    } else if (activeFilter !== "all") {
      list = list.filter((a) => a.extension.toLowerCase() === activeFilter.toLowerCase());
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [data?.alternatives, activeFilter, sortBy]);

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Search Bar with Autocomplete Suggestions */}
        <div ref={searchBoxRef} className="relative z-30 mb-8">
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Search for a domain (e.g. yourbusiness.com)"
                  className="w-full pl-11 pr-4 py-3.5 text-base sm:text-lg text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0052FF]"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {/* AI Assistant Button */}
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-[#0052FF] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Generate domain ideas with free AI"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ask AI</span>
              </button>

              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="px-8 py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-black text-base shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
              >
                <span>Search</span>
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Extension Chips */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Popular:</span>
              {[".com", ".in", ".net", ".org", ".store", ".tech", ".co"].map((ext) => (
                <button
                  key={ext}
                  type="button"
                  onClick={() => {
                    const base = inputQuery.trim() ? inputQuery.split(".")[0].trim() : "";
                    if (base) {
                      const newTerm = `${base}${ext}`;
                      setInputQuery(newTerm);
                      router.push(`/domains?q=${encodeURIComponent(newTerm)}`);
                      performSearch(newTerm);
                    } else {
                      setInputQuery(`mybrand${ext}`);
                    }
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-colors cursor-pointer"
                >
                  {ext}
                </button>
              ))}
            </div>
          </div>

          {/* Autocomplete Suggestions Dropdown while typing */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden divide-y divide-slate-100 z-40 text-left animate-in fade-in-50 duration-100">
              <div className="px-4 py-2 bg-slate-50/90 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Suggested Domains for &ldquo;{inputQuery}&rdquo;</span>
                <span className="text-[10px] text-slate-400">Use ↑↓ keys to navigate</span>
              </div>

              {suggestions.map((item, index) => {
                const isActive = index === activeSuggestionIndex;
                return (
                  <button
                    key={item.domain}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.domain)}
                    className={`w-full px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                      isActive ? "bg-blue-50 text-[#0052FF]" : "hover:bg-slate-50 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0052FF] flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900">
                            {item.domain}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="font-black text-sm text-slate-900">
                          {item.currencySymbol}
                          {item.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-400"> {item.period}</span>
                      </div>
                      <span className="text-xs font-bold text-[#0052FF]">
                        Search &rarr;
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom AI Suggestion Shortcut */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Looking for unique creative names?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    setAiModalOpen(true);
                  }}
                  className="font-bold text-[#0052FF] hover:underline cursor-pointer"
                >
                  Ask Free AI Assistant &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#0052FF] border-t-transparent animate-spin shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Checking availability…
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Querying registry for{" "}
                    <span className="text-[#0052FF] font-semibold">{currentSearchingDomain}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{elapsedTime.toFixed(1)}s</span>
              </div>
            </div>

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

            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
                  <div className="w-48 h-6 bg-slate-200 rounded" />
                  <div className="w-28 h-8 bg-slate-200 rounded-xl" />
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
              <h3 className="text-lg font-bold text-slate-900">
                We couldn’t check availability. Please try again.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                We encountered an intermittent connection issue verifying availability with the registry.
              </p>
            </div>
            <button
              onClick={() => performSearch(currentSearchingDomain || inputQuery)}
              className="px-6 py-2.5 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Retry Search
            </button>
          </div>
        )}

        {/* INITIAL PAGE LOAD: Only show search box and popular extensions directory */}
        {!loading && !error && !data && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center py-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Live Registry Search
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Search available domains across 500+ extensions
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
                Type your brand, business name, or domain idea above to check real-time availability and wholesale registration pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[".com", ".in", ".net", ".org", ".store", ".tech"].map((ext) => {
                const tld = POPULAR_TLDS.find((t) => t.extension === ext);
                if (!tld) return null;
                return (
                  <button
                    key={tld.extension}
                    type="button"
                    onClick={() => {
                      const base = inputQuery.trim() ? inputQuery.split(".")[0].trim() : "";
                      if (base) {
                        const newTerm = `${base}${tld.extension}`;
                        setInputQuery(newTerm);
                        router.push(`/domains?q=${encodeURIComponent(newTerm)}`);
                        performSearch(newTerm);
                      } else {
                        setInputQuery(`mybrand${tld.extension}`);
                      }
                    }}
                    className="bg-white rounded-xl p-4 border border-slate-200/90 hover:border-[#0052FF] hover:shadow-md transition-all text-center group cursor-pointer"
                  >
                    <div className="text-2xl font-black text-[#0052FF] group-hover:scale-105 transition-transform">
                      {tld.extension}
                    </div>
                    <div className="mt-1 text-base font-extrabold text-slate-900">
                      {tld.currencySymbol}
                      {tld.registrationPrice.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{tld.period}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CONFIRMED RESULTS DISPLAY */}
        {!loading && data && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* CASE 1: EXACT MATCH IS AVAILABLE */}
            {data.exactMatch.available && (
              <div className="bg-white rounded-3xl p-7 sm:p-10 border-2 border-emerald-400 ring-4 ring-emerald-500/10 transition-all shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Domain Available</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight break-all">
                      {data.exactMatch.domain}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500">
                      Verified available for instant registration with WHOIS privacy & Anycast DNS included.
                    </p>
                  </div>

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
                </div>
              </div>
            )}

            {/* CASE 2: EXACT MATCH IS ALREADY REGISTERED (Clear notification + BIG RECOMMENDED ALTERNATIVE) */}
            {!data.exactMatch.available && !data.exactMatch.isUnsupported && (
              <div className="space-y-6">
                {/* A. Crystal-clear "Already Registered" Banner for the searched domain */}
                <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 break-all">
                          {data.exactMatch.domain}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-rose-200/80 text-rose-800">
                          Already Registered
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        This exact domain is currently taken by another owner. Explore the top available alternative below!
                      </p>
                    </div>
                  </div>
                </div>

                {/* B. BIG PROMINENT HERO CARD for the Best Available Alternative */}
                {topAvailableAlternative && (
                  <div className="bg-white rounded-3xl p-7 sm:p-10 border-2 border-[#0052FF] ring-4 ring-blue-500/10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#0052FF] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Top Available Alternative</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
                      <div className="space-y-2.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Available to Register Now</span>
                        </div>

                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight break-all">
                          {topAvailableAlternative.domain}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500">
                          Secure your brand under this top available extension. Includes free WHOIS privacy & full DNS management.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        <div className="text-left lg:text-right">
                          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                            {topAvailableAlternative.currencySymbol}
                            {topAvailableAlternative.price.toLocaleString("en-IN")}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 font-medium">
                            First year · Renews at {topAvailableAlternative.currencySymbol}
                            {topAvailableAlternative.renewalPrice.toLocaleString("en-IN")}/yr · Plus taxes
                          </div>
                        </div>

                        {isItemInCart(topAvailableAlternative.domain) ? (
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
                            onClick={() => addItem(topAvailableAlternative)}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-black text-base shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CASE 3: UNSUPPORTED TLD */}
            {data.exactMatch.isUnsupported && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Automated Registry Check Unavailable</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{data.exactMatch.domain}</h3>
                  <p className="text-xs text-slate-600 max-w-xl">
                    Automated lookup is not enabled for this extension on this API gateway. Please browse verified alternatives below or contact our desk.
                  </p>
                </div>
                <Link
                  href="/support"
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors inline-flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Contact Domain Desk</span>
                </Link>
              </div>
            )}

            {/* MATCHING EXTENSIONS SECTION */}
            {data.alternatives.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      More matching extensions for &ldquo;{data.exactMatch.name}&rdquo;
                    </h3>
                    <p className="text-xs text-slate-400">
                      Verified real-time registry availability & wholesale rates
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    Filter:
                  </span>
                  {[
                    { id: "all", label: "All" },
                    { id: ".com", label: ".com" },
                    { id: ".net", label: ".net" },
                    { id: ".org", label: ".org" },
                    { id: ".store", label: ".store" },
                    { id: ".tech", label: ".tech" },
                    { id: "under-1000", label: "Under ₹1,000" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeFilter === filter.id
                          ? "bg-[#0052FF] text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Rows of Alternative Results */}
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {displayedAlternatives.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No matching extensions found for this filter. Try selecting &ldquo;All&rdquo;.
                    </div>
                  ) : (
                    displayedAlternatives.map((alt) => {
                      const inCart = isItemInCart(alt.domain);
                      return (
                        <div
                          key={alt.domain}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                              {alt.domain}
                            </span>
                            {alt.available ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Available
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                                Registered
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-5">
                            {alt.available && (
                              <div className="text-left sm:text-right">
                                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                  {alt.currencySymbol}
                                  {alt.price.toLocaleString("en-IN")}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  1st year · Renews at {alt.currencySymbol}
                                  {alt.renewalPrice.toLocaleString("en-IN")}/yr
                                </div>
                              </div>
                            )}

                            {alt.available ? (
                              inCart ? (
                                <Link
                                  href="/cart"
                                  className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-colors shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>In Cart</span>
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addItem(alt)}
                                  className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
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
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Domain Assistant Modal */}
      <AiDomainAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectDomain={(domain) => {
          setInputQuery(domain);
          router.push(`/domains?q=${encodeURIComponent(domain)}`);
          performSearch(domain);
        }}
      />
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
