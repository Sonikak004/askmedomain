"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, Shield, Zap, Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { POPULAR_TLDS } from "@/config/pricing";

export const Hero: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTld, setSelectedTld] = useState(".com");

  const heroTlds = POPULAR_TLDS.filter((tld) => tld.featuredHero);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    let finalQuery = query.trim();
    if (!finalQuery.includes(".")) {
      finalQuery = `${finalQuery}${selectedTld}`;
    }
    router.push(`/domains?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleTldClick = (ext: string) => {
    setSelectedTld(ext);
    if (query.trim()) {
      const base = query.split(".")[0];
      router.push(`/domains?q=${encodeURIComponent(`${base}${ext}`)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50/60 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-100">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand logo & tagline banner */}
        <div className="inline-flex flex-col items-center justify-center mb-6">
          <Logo size="xl" showTagline={true} asLink={false} />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Find a domain.{" "}
          <span className="text-[#0052FF]">Build something great.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Your perfect domain is just a search away. Find the right name for your business,
          brand, or next big idea.
        </p>

        {/* Large Domain Search Box */}
        <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-[#0052FF]"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for your perfect domain (e.g. mybrand.com)"
                className="w-full py-3.5 pl-3 pr-4 text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {/* Quick Extension Selector on search bar */}
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-3 pr-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Default:
              </span>
              <select
                value={selectedTld}
                onChange={(e) => setSelectedTld(e.target.value)}
                className="text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded-lg border border-slate-200 cursor-pointer focus:outline-none"
              >
                <option value=".com">.com</option>
                <option value=".in">.in</option>
                <option value=".net">.net</option>
                <option value=".org">.org</option>
                <option value=".co">.co</option>
                <option value=".store">.store</option>
                <option value=".tech">.tech</option>
                <option value=".ai">.ai</option>
              </select>
            </div>

            {/* Orange Call To Action Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-base shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Search Domains</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Transparent Registrar Notice */}
          <p className="mt-2 text-xs text-slate-500 text-center">
            Instant registrar check with automatic WHOIS privacy & full DNS records control.
          </p>
        </div>

        {/* Popular Extensions Cards (Replicating the reference row cleanly) */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {heroTlds.map((tld) => {
              const isSelected = selectedTld === tld.extension;
              return (
                <button
                  key={tld.extension}
                  type="button"
                  onClick={() => handleTldClick(tld.extension)}
                  className={`p-3.5 rounded-xl border text-center transition-all group cursor-pointer bg-white ${
                    isSelected
                      ? "border-[#0052FF] ring-2 ring-blue-500/20 shadow-sm"
                      : "border-slate-200/80 hover:border-blue-300 hover:shadow-xs"
                  }`}
                >
                  <div className="text-xl font-extrabold text-[#0052FF] group-hover:scale-105 transition-transform">
                    {tld.extension}
                  </div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {tld.currencySymbol}
                    {tld.registrationPrice.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {tld.period}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Feature Badges below Hero */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0052FF] shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Instant Delegation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Live on global DNS in seconds</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0052FF] shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">WHOIS Privacy</h4>
                <p className="text-xs text-slate-500 mt-0.5">Mask your private contact info</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0052FF] shrink-0 mt-0.5">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Transparent Pricing</h4>
                <p className="text-xs text-slate-500 mt-0.5">No hidden renewal surprises</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0052FF] shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Smart Suggestions</h4>
                <p className="text-xs text-slate-500 mt-0.5">Curated available alternatives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
