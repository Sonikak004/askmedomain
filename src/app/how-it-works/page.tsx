import React from "react";
import Link from "next/link";
import { Search, CheckCircle, Settings, ArrowRight, Shield, Globe, Lock, Cpu } from "lucide-react";

export default function HowItWorksPage() {
  const deepSteps = [
    {
      step: "01",
      title: "Search & Check Real-Time Availability",
      subtitle: "Instant registry queries via high-speed API connections",
      description:
        "Type any keyword, phrase, or brand idea into our search bar. We query global registries (Verisign, Registry.in, etc.) in milliseconds to determine if the name is available, already registered, or subject to premium registry rates.",
      features: [
        "Real-time registry availability checks",
        "Alternative extension suggestions (.com, .in, .net, .store)",
        "Automated input sanitization & format validation",
      ],
      icon: Search,
    },
    {
      step: "02",
      title: "Select Extensions & Registration Period",
      subtitle: "Transparent pricing without unwanted checkout addons",
      description:
        "Choose the perfect top-level domain for your audience. Select your registration term from 1 to 5 years, with free WHOIS privacy automatically attached to shield your personal details from public databases.",
      features: [
        "Lock in your domain for up to 5 years",
        "Free WHOIS privacy proxy included",
        "Clear pricing with zero surprise cart upsells",
      ],
      icon: CheckCircle,
    },
    {
      step: "03",
      title: "Secure Checkout & Instant Delegation",
      subtitle: "Direct gateway settlement and automated registrar provisioning",
      description:
        "Enter your registrant contact details and complete payment through secure gateways (Razorpay, Cashfree). Once payment settles, registrar commands execute automatically to secure the domain to your legal entity.",
      features: [
        "Bank-grade 256-bit encrypted checkout",
        "Instant Anycast DNS delegation",
        "Legal WHOIS ownership assignment directly in your name",
      ],
      icon: Lock,
    },
    {
      step: "04",
      title: "Manage DNS Records & Connected Services",
      subtitle: "Full control over A, CNAME, MX, and TXT records",
      description:
        "Log into your dashboard to configure nameservers or connect your domain to Vercel, Shopify, Google Workspace, or custom hosting with low-latency DNS propagation.",
      features: [
        "One-click nameserver switching (Default Anycast vs Custom)",
        "Full DNS zone editor (A, AAAA, CNAME, MX, TXT)",
        "EPP transfer lock to guard against unauthorized moves",
      ],
      icon: Settings,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Domain Lifecycle Guide
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How AskMeDomain Works
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            A transparent look into how we search, register, and protect your domain names across
            global registries.
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div className="space-y-8">
          {deepSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row items-start gap-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052FF] flex items-center justify-center shrink-0">
                  <Icon className="w-8 h-8" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black text-[#FF5500] tracking-widest uppercase">
                      Step {item.step}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{item.subtitle}</span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Domain Transfer Callout */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold text-[#0052FF] uppercase tracking-wider">
              Existing Domain Owner?
            </span>
            <h3 className="mt-1 text-2xl font-black text-slate-900">
              Transfer your existing domains to AskMeDomain
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Consolidate your domain portfolio into one clean dashboard. Transfers include a full
              1-year extension with zero downtime for your existing website and email.
            </p>
          </div>

          <Link
            href="/domains"
            className="px-6 py-3.5 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs flex items-center gap-2 shrink-0"
          >
            <span>Start a Domain Search</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
