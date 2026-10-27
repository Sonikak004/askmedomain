"use client";

import React, { useState } from "react";
import Link from "next/link";
import { POPULAR_TLDS, PRICING_DISCLAIMER } from "@/config/pricing";
import { ArrowRight, Check, Search, Info } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Extensions" },
    { id: "popular", label: "Most Popular" },
    { id: "tech", label: "Tech & AI" },
    { id: "business", label: "Business & Startups" },
    { id: "country", label: "India (.IN)" },
  ];

  const filteredTLDs = POPULAR_TLDS.filter((tld) => {
    if (filter === "all") return true;
    if (filter === "popular") return tld.popular;
    if (filter === "tech") return tld.category === "tech";
    if (filter === "business") return tld.category === "business";
    if (filter === "country") return tld.category === "country";
    return true;
  });

  return (
    <section className="py-16 sm:py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Transparent Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fair, predictable pricing for every domain extension
          </h2>
          <p className="mt-3 text-base text-slate-600">
            No unexpected checkout markups. Every registration includes free DNS control,
            WHOIS privacy, and domain locking.
          </p>

          {/* Sample Pricing Notice Badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Info className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>{PRICING_DISCLAIMER}</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                filter === cat.id
                  ? "bg-[#0052FF] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTLDs.map((tld) => (
            <div
              key={tld.extension}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all bg-white hover:shadow-md ${
                tld.popular
                  ? "border-blue-300 ring-1 ring-blue-400/20"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {tld.popular && (
                <div className="absolute -top-3 right-5 bg-[#0052FF] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Popular Choice
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {tld.extension}
                  </span>
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {tld.category}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 min-h-8">
                  {tld.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {tld.currencySymbol}
                      {tld.registrationPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {tld.period}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Renews at {tld.currencySymbol}
                    {tld.renewalPrice.toLocaleString("en-IN")}
                    {tld.period}
                  </div>
                </div>

                {/* Key Features */}
                <ul className="mt-5 space-y-2 text-xs text-slate-600">
                  {tld.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/domains?tld=${encodeURIComponent(tld.extension)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-[#0052FF] hover:text-white text-slate-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Search {tld.extension} Domains</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All TLDs Link */}
        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0052FF] hover:text-[#0043D6] group"
          >
            <span>View complete registry pricing directory and renewal schedules</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
