import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Zap, HeartHandshake, Globe, ArrowRight, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            About AskMeDomain
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Empowering your digital identity with simplicity and trust
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We built AskMeDomain to solve the frustration of hidden fees, unwanted cart addons, and
            opaque renewal pricing common in traditional domain registrars.
          </p>
        </div>

        {/* Story & Mission Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs mb-12 space-y-6 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Mission</h2>
          <p>
            Every great venture begins with a name. Whether you are launching an innovative tech
            startup, establishing a local business in India, or protecting an international brand,
            finding and securing your domain should be fast, transparent, and frictionless.
          </p>
          <p>
            At {siteConfig.name}, we focus exclusively on domain registration and DNS management. We
            do not confuse you with dozens of unsolicited upsells at checkout. We provide clean,
            reliable domain search, honest pricing, and powerful Anycast DNS control out of the box.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Simplicity First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean interfaces without cluttered banners. Search a domain, review the true cost, and
              register in seconds.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Privacy by Default</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never charge extra for WHOIS privacy proxy masking on eligible extensions. Your
              identity is protected from day one.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Transparent Renewals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No renewal rate traps. Both registration and future renewal prices are published
              clearly before you check out.
            </p>
          </div>
        </div>

        {/* Corporate Entity Details Placeholder */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xs">
          <h3 className="text-lg font-bold mb-4">Corporate &amp; Operational Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div>
              <p className="font-semibold text-white">Registered Entity:</p>
              <p className="mt-1">{siteConfig.legalName}</p>
              <p className="mt-1 text-slate-400">
                Registered Office: {siteConfig.registeredAddress.line1},{" "}
                {siteConfig.registeredAddress.line2}, {siteConfig.registeredAddress.city},{" "}
                {siteConfig.registeredAddress.state} – {siteConfig.registeredAddress.postalCode},{" "}
                {siteConfig.registeredAddress.country}
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Registrar Architecture:</p>
              <p className="mt-1">
                Domain fulfillment is powered via server-side API integration with certified
                wholesale registrar partners (Dynadot).
              </p>
              <p className="mt-2 text-slate-400">
                Support: {siteConfig.supportEmail} | {siteConfig.phone}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to get in touch with our team for questions or enterprise inquiries?
            </p>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
