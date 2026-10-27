"use client";

import React, { useState } from "react";
import Link from "next/link";
import { POPULAR_TLDS, PRICING_DISCLAIMER } from "@/config/pricing";
import { Search, Check, ShieldCheck, ArrowRight, Info, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All TLDs" },
    { id: "popular", label: "Most Popular" },
    { id: "country", label: "India (.IN)" },
    { id: "tech", label: "Tech & AI" },
    { id: "business", label: "Business" },
    { id: "specialty", label: "Specialty / Retail" },
  ];

  const filtered = POPULAR_TLDS.filter((tld) => {
    const matchesSearch =
      tld.extension.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tld.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ? true : tld.category === selectedCategory || (selectedCategory === "popular" && tld.popular);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Domain Directory
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Comprehensive Domain Pricing
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Compare registration, renewal, and transfer fees across all major top-level domains.
            Every registration includes free WHOIS privacy and DNS control.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <Info className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>{PRICING_DISCLAIMER}</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter extensions (e.g. .com, tech)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052FF]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0052FF] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Domain Extension</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Registration</th>
                  <th className="py-4 px-4">Renewal Price</th>
                  <th className="py-4 px-4">Transfer Fee</th>
                  <th className="py-4 px-4">WHOIS Privacy</th>
                  <th className="py-4 px-6 text-right">Search</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((tld) => (
                  <tr key={tld.extension} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900 tracking-tight">
                          {tld.extension}
                        </span>
                        {tld.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0052FF]">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{tld.description}</p>
                    </td>
                    <td className="py-4 px-4 capitalize font-medium text-slate-600">
                      {tld.category}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                      {tld.currencySymbol}
                      {tld.registrationPrice.toLocaleString("en-IN")}
                      <span className="text-[10px] font-normal text-slate-400">/yr</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {tld.currencySymbol}
                      {tld.renewalPrice.toLocaleString("en-IN")}
                      <span className="text-[10px] text-slate-400">/yr</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {tld.currencySymbol}
                      {tld.transferPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Included</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/domains?tld=${encodeURIComponent(tld.extension)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-xs transition-colors shadow-2xs"
                      >
                        <Search className="w-3 h-3" />
                        <span>Search</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQs or Guidance */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#0052FF]" />
            <span>Understanding Domain Pricing</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Registration vs. Renewal</h4>
              <p className="leading-relaxed">
                Initial registration covers the first 1–10 years. Renewals preserve your domain
                ownership at our published baseline rates with no auto-escalation surcharges.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Mandatory ICANN Fees</h4>
              <p className="leading-relaxed">
                ICANN mandates a small standard annual fee (₹18 / yr) on generic top-level domains
                like .com and .net to maintain global registry infrastructure.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Domain Transfers</h4>
              <p className="leading-relaxed">
                When you transfer an existing domain to AskMeDomain, the transfer fee includes a full
                additional 1-year registration extension added to your current expiry date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
