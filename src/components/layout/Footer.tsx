"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Lock, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner / Trust Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#0052FF]" />
              </div>
              <div>
                <p className="font-semibold text-white">WHOIS Privacy Ready</p>
                <p className="text-xs text-slate-400">Keep personal info private</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#FF5500]" />
              </div>
              <div>
                <p className="font-semibold text-white">DNSSEC & Domain Lock</p>
                <p className="text-xs text-slate-400">Prevent unauthorized transfers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#0052FF]" />
              </div>
              <div>
                <p className="font-semibold text-white">Instant Digital Delivery</p>
                <p className="text-xs text-slate-400">Immediate DNS delegation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">24/7 Expert Assistance</p>
                <p className="text-xs text-slate-400">Engineers ready to assist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              AskMeDomain provides fast domain discovery, secure registration, and full DNS
              management. Engineered for modern founders, businesses, and developers.
            </p>

            {/* Configurable Business Information Placeholder */}
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Registered Entity Details:</p>
              <p className="text-slate-400">{siteConfig.legalName}</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <span>
                  {siteConfig.registeredAddress.line1}, {siteConfig.registeredAddress.line2},{" "}
                  {siteConfig.registeredAddress.city}, {siteConfig.registeredAddress.state} –{" "}
                  {siteConfig.registeredAddress.postalCode}, {siteConfig.registeredAddress.country}
                </span>
              </div>
              <p className="text-slate-500">
                GSTIN: <span className="text-slate-400">{siteConfig.gstinPlaceholder}</span>
              </p>
              <p className="text-slate-500">
                CIN: <span className="text-slate-400">{siteConfig.cinPlaceholder}</span>
              </p>
            </div>
          </div>

          {/* Quick Domain Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Domains
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/domains" className="hover:text-white transition-colors">
                  Domain Search
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Domain Pricing
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/domains?q=tech" className="hover:text-white transition-colors">
                  Tech & Startup TLDs
                </Link>
              </li>
              <li>
                <Link href="/domains?q=in" className="hover:text-white transition-colors">
                  .IN Indian Domains
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  DNS Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support & Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="hover:text-white transition-colors">
                  Digital Delivery Policy
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <a href={`mailto:${siteConfig.supportEmail}`} className="hover:underline">
                    {siteConfig.supportEmail}
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>{siteConfig.phone}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Server Architecture: Dynadot API Ready</span>
            <span className="hidden sm:inline">•</span>
            <span>Payments: Razorpay & Cashfree Ready</span>
            <span className="hidden sm:inline">•</span>
            <span>Digital Delivery Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
