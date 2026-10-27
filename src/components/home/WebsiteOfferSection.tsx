import React from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  Clock,
  ArrowRight,
  Server,
} from "lucide-react";

export const WebsiteOfferSection: React.FC = () => {
  const inclusions = [
    {
      title: "Custom 5-Page Business Website",
      desc: "Tailored layout including Home, About Us, Services/Products, Portfolio, and Contact.",
      icon: Globe,
    },
    {
      title: "1 Year Fast Cloud Hosting",
      desc: "High-speed SSD NVMe storage with 99.9% guaranteed uptime and automated backups.",
      icon: Server,
    },
    {
      title: "Free SSL Security Certificate",
      desc: "Enforced HTTPS encryption for bank-grade visitor trust and Google SEO priority.",
      icon: ShieldCheck,
    },
    {
      title: "100% Mobile Responsive",
      desc: "Optimized for lightning-fast loading across smartphones, tablets, and computers.",
      icon: Smartphone,
    },
    {
      title: "WhatsApp & Lead Contact Form",
      desc: "Instant customer inquiries routed directly to your WhatsApp and business email.",
      icon: MessageSquare,
    },
    {
      title: "Domain & DNS Setup Included",
      desc: "We connect your new or existing AskMeDomain domain with zero technical setup required.",
      icon: Zap,
    },
  ];

  return (
    <section className="py-18 sm:py-24 bg-gradient-to-b from-slate-50/70 to-white border-y border-slate-200/80" id="websites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          {/* Subtle background radial glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0052FF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left Content */}
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Ready in 3–5 Business Days</span>
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Complete 5-Page Website for Your Business at{" "}
                <span className="text-[#FF5500]">₹4,999</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                Skip the complicated site builders. Get a professionally designed, mobile-ready
                website tailored for your brand with hosting, SSL, and domain connection all included.
              </p>

              {/* Inclusions Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {inclusions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pricing Card */}
            <div className="w-full lg:w-88 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between shrink-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-2.5 py-1 rounded-md">
                  Complete Turnkey Package
                </span>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    ₹4,999
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">one-time setup</span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Includes 1st year cloud hosting, SSL security, and all 5 custom pages.
                </p>

                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5 Custom branded pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free SSL & cloud hosting for 1 year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>WhatsApp and inquiry integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No coding or technical skills needed</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <Link
                  href="/contact?service=5page-website"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Claim Website Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/support"
                  className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors block"
                >
                  Have questions? Talk to our design team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};