import React from "react";
import Link from "next/link";
import { Search, CheckCircle, Settings, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Search your domain",
      description:
        "Enter your desired brand, business name, or creative idea. Our real-time search engine queries registry availability and suggests high-impact TLDs.",
      icon: Search,
    },
    {
      number: "02",
      title: "Choose an available name",
      description:
        "Review instant availability, registration terms, and transparent renewal prices. Select the best match (.com, .in, .tech, etc.) and add it to your cart.",
      icon: CheckCircle,
    },
    {
      number: "03",
      title: "Register and manage it",
      description:
        "Complete secure checkout. Your domain is instantly delegated, with complete access to edit DNS records, configure nameservers, or enable auto-renew.",
      icon: Settings,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Effortless Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How domain registration works on AskMeDomain
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From idea to active domain in three simple steps.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-slate-100 -translate-y-8 z-0 pointer-events-none" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative z-10 bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 text-[#0052FF] flex items-center justify-center mb-6 shadow-xs">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-black tracking-widest text-[#FF5500] mb-2">
                  STEP {step.number}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs transition-colors"
          >
            <span>Start Your Domain Search</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
