"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  HelpCircle,
  Search,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Globe,
  Shield,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const articles = [
    {
      title: "How to point your domain to Vercel, Shopify, or WordPress",
      category: "DNS & Nameservers",
      readTime: "3 min read",
      snippet:
        "Learn how to configure root '@' A records and 'www' CNAME records to connect your domain to external hosts.",
    },
    {
      title: "How to transfer a domain into AskMeDomain",
      category: "Transfers",
      readTime: "4 min read",
      snippet:
        "Step-by-step instructions on obtaining your EPP authorization code and unlocking your domain at your old registrar.",
    },
    {
      title: "Enabling and managing WHOIS privacy protection",
      category: "Security",
      readTime: "2 min read",
      snippet:
        "Understand how our complimentary privacy proxy works to protect your personal contact details from public scrapers.",
    },
    {
      title: "Understanding domain renewal grace periods & redemption",
      category: "Billing & Renewals",
      readTime: "5 min read",
      snippet:
        "What happens if your domain expires, and how our automated renewal safeguards prevent domain loss.",
    },
    {
      title: "Setting up Google Workspace MX records with one click",
      category: "Email Setup",
      readTime: "3 min read",
      snippet:
        "How to configure Google Workspace or custom mail exchangers in your AskMeDomain DNS management tab.",
    },
    {
      title: "Digital Delivery & Instant Provisioning timeline",
      category: "Orders",
      readTime: "2 min read",
      snippet:
        "Detailed explanation of instant registry broadcasting and how DNS caches propagate worldwide.",
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail || !ticketMessage) return;
    setTicketSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational (DNS &amp; Registrar APIs)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Search our knowledgebase for DNS guides, or reach our 24/7 technical team directly.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles (e.g. DNS, transfer, nameservers, refund)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
            />
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Email Technical Support</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Average response time: under 30 minutes.
            </p>
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-sm font-bold text-[#0052FF] hover:underline"
            >
              {siteConfig.supportEmail}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Telephone Assistance</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              {siteConfig.billingHours}
            </p>
            <span className="text-sm font-bold text-slate-900">{siteConfig.phone}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">DNS &amp; Nameserver Help</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Interactive tools in your dashboard.
            </p>
            <Link href="/dashboard" className="text-sm font-bold text-[#0052FF] hover:underline">
              Go to DNS Dashboard →
            </Link>
          </div>
        </div>

        {/* Knowledgebase Grid */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Popular Help &amp; Setup Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((art, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:border-blue-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#0052FF] px-2 py-0.5 rounded bg-blue-50">
                    {art.category}
                  </span>
                  <span className="text-slate-400">{art.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 hover:text-[#0052FF] transition-colors">
                  {art.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{art.snippet}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xs max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Submit a Support Ticket</h3>
              <p className="text-xs text-slate-500">
                Our DNS and registrar specialists will follow up via email.
              </p>
            </div>
          </div>

          {ticketSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-emerald-900">
                Ticket #AMD-{Math.floor(10000 + Math.random() * 90000)} Created
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                We have received your request. An engineer has been notified and will reply to{" "}
                <strong className="underline">{ticketEmail}</strong> within 30 minutes.
              </p>
              <button
                onClick={() => setTicketSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Related Domain or Subject *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. DNS propagation inquiry for mybrand.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">How can we help? *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe what you are looking to configure or any issue you encountered..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
