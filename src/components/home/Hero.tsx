"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
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
    } else {
      router.push(`/domains?q=${encodeURIComponent(`mybrand${ext}`)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Find a domain.{" "}
          <span className="text-[#0052FF]">Build something great.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Your perfect domain is just a search away. Find the right name for your business,
          brand, or next big idea.
        </p>

        {/* Prominent High-Converting Search Box */}
        <div className="mt-10 sm:mt-12 max-w-3xl mx-auto">
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
                placeholder="Search for your domain (e.g. yourbrand.com)"
                className="w-full py-4 pl-3 pr-4 text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {/* Quick Extension Selector */}
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-3 pr-2">
              <span className="text-xs font-semibold text-slate-400">
                Extension:
              </span>
              <select
                value={selectedTld}
                onChange={(e) => setSelectedTld(e.target.value)}
                className="text-sm font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 px-2.5 py-2 rounded-lg border border-slate-200 cursor-pointer focus:outline-none"
              >
                <option value=".com">.com</option>
                <option value=".net">.net</option>
                <option value=".org">.org</option>
                <option value=".co">.co</option>
                <option value=".store">.store</option>
                <option value=".tech">.tech</option>
                <option value=".in">.in</option>
              </select>
            </div>

            {/* Big Orange Call to Action Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-base shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Search Domains</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-500 text-center">
            Live availability check with verified wholesale registrar pricing and Anycast DNS.
          </p>
        </div>

        {/* Popular Extensions Grid with Clear Typography */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {heroTlds.map((tld) => {
              const isSelected = selectedTld === tld.extension;
              return (
                <button
                  key={tld.extension}
                  type="button"
                  onClick={() => handleTldClick(tld.extension)}
                  className={`p-4 rounded-xl border text-center transition-all group cursor-pointer bg-white ${
                    isSelected
                      ? "border-[#0052FF] ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
