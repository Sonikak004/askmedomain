"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, Globe, Tag } from "lucide-react";
import { POPULAR_TLDS } from "@/config/pricing";
import { getDomainSuggestions, DomainSuggestion } from "@/lib/domainSuggestions";
import { AiDomainAssistantModal } from "./AiDomainAssistantModal";

export const Hero: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const targetExtensions = [".com", ".in", ".net", ".org", ".store", ".tech"];
  const heroTlds = targetExtensions
    .map((ext) => POPULAR_TLDS.find((t) => t.extension === ext))
    .filter((tld): tld is (typeof POPULAR_TLDS)[0] => Boolean(tld));

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim().length >= 1) {
      const results = getDomainSuggestions(query.trim(), 6);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setShowSuggestions(false);
    let finalQuery = query.trim();
    if (!finalQuery.includes(".")) {
      finalQuery = `${finalQuery}.com`;
    }
    router.push(`/domains?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleSelectSuggestion = (suggestionDomain: string) => {
    setShowSuggestions(false);
    setQuery(suggestionDomain);
    router.push(`/domains?q=${encodeURIComponent(suggestionDomain)}`);
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

  const handleTldClick = (ext: string) => {
    if (query.trim()) {
      const base = query.split(".")[0];
      router.push(`/domains?q=${encodeURIComponent(`${base}${ext}`)}`);
    } else {
      router.push(`/domains?tld=${encodeURIComponent(ext)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* AI Assistant Pill Badge */}
        <div className="inline-flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0052FF] text-xs font-bold border border-blue-200 shadow-2xs transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span>Need inspiration? Try our Free AI Domain Assistant &rarr;</span>
          </button>
        </div>

        {/* Main Headline from Redesign Brief */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Your next idea starts with a domain.
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Search hundreds of domain extensions with transparent registry wholesale rates, free DNS management, and instant activation.
        </p>

        {/* Prominent High-Converting Search Box Container */}
        <div ref={containerRef} className="mt-10 sm:mt-12 max-w-3xl mx-auto relative z-20">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xl shadow-slate-900/5 border-2 border-slate-200 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-[#0052FF] focus-within:ring-4 focus-within:ring-blue-500/10"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search for your domain (e.g. yourbrand.com)"
                className="w-full py-4 pl-3 pr-4 text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {/* AI Assistant Quick Trigger in Search Bar */}
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0052FF] hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
              title="Brainstorm domain names using free AI"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ask AI</span>
            </button>

            {/* Big Orange Call to Action Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-base shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Search Domains</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* REAL-TIME DOMAIN NAME SUGGESTIONS DROPDOWN WHEN TYPING */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden divide-y divide-slate-100 z-30 text-left animate-in fade-in-50 duration-100">
              <div className="px-4 py-2 bg-slate-50/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Suggested Domains for &ldquo;{query}&rdquo;</span>
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
                      isActive ? "bg-blue-50/90 text-[#0052FF]" : "hover:bg-slate-50 text-slate-900"
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
                      <span className="text-xs font-bold text-[#0052FF] opacity-0 group-hover:opacity-100 sm:opacity-100">
                        Search &rarr;
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom AI Suggestion Shortcut */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Not seeing what you want?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    setAiModalOpen(true);
                  }}
                  className="font-bold text-[#0052FF] hover:underline cursor-pointer"
                >
                  Generate creative ideas with Free AI &rarr;
                </button>
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-500 text-center">
            Live availability check with verified wholesale registrar pricing and Anycast DNS.
          </p>
        </div>

        {/* Popular Extensions Grid with Clear Typography */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {heroTlds.map((tld) => (
              <button
                key={tld.extension}
                type="button"
                onClick={() => handleTldClick(tld.extension)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0052FF] hover:shadow-xs text-center transition-all group cursor-pointer bg-white"
              >
                <div className="text-xl font-black text-[#0052FF] group-hover:scale-105 transition-transform">
                  {tld.extension}
                </div>
                <div className="mt-1.5 text-base font-extrabold text-slate-900">
                  {tld.currencySymbol}
                  {tld.registrationPrice.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {tld.period}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Domain Assistant Modal */}
      <AiDomainAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectDomain={(domain) => {
          setQuery(domain);
          router.push(`/domains?q=${encodeURIComponent(domain)}`);
        }}
      />
    </section>
  );
};
