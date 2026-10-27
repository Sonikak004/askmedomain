import React from "react";
import { CheckCircle2, Shield, RefreshCw, Headphones, Zap, Lock } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      title: "Simple domain registration",
      description:
        "No complex steps, upselling roadblocks, or confusing jargon. Search your desired name, verify availability, and secure it in seconds.",
      icon: Zap,
    },
    {
      title: "Transparent pricing",
      description:
        "What you see is what you pay. We publish both registration and renewal prices upfront, with no hidden auto-escalation fees at checkout.",
      icon: CheckCircle2,
    },
    {
      title: "Secure domain management",
      description:
        "Protect your brand with registrar transfer locks, two-factor authentication, and instant DNS record propagation to safeguard against hijacking.",
      icon: Lock,
    },
    {
      title: "Easy, hassle-free renewals",
      description:
        "Flexible renewal options with automated reminders. Keep your domain safe from expiration without worrying about unexpected lapsed status.",
      icon: RefreshCw,
    },
    {
      title: "Helpful customer support",
      description:
        "Speak to knowledgeable technical engineers who know DNS, domain propagation, and nameserver configurations inside out.",
      icon: Headphones,
    },
    {
      title: "Complimentary WHOIS privacy",
      description:
        "Your personal address, phone number, and email are shielded from spammers and public scrapers on all eligible domain extensions.",
      icon: Shield,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Why AskMeDomain
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for domain owners who value simplicity and control
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Traditional registrars clutter your checkout with unwanted addons and obscure
            renewal costs. We keep domain ownership straightforward and transparent.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-start"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0052FF] mb-5 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
