"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "Registration",
      question: "How long does it take for my domain to become active?",
      answer:
        "Once payment and registrar confirmation are completed, your domain is instantly registered in the global registry. Worldwide DNS propagation typically finishes within a few minutes to up to 24 hours depending on ISP caching.",
    },
    {
      category: "Ownership",
      question: "Who owns the domain once it is registered?",
      answer:
        "You do. You are designated as the legal registrant and administrative contact. AskMeDomain acts solely as your registration interface and custodian. You retain 100% full legal rights to your domain name and can modify or transfer it at any time.",
    },
    {
      category: "Renewals",
      question: "How do domain renewals work, and will the price increase?",
      answer:
        "All renewal rates are transparently published in our pricing directory before you buy. You can enable automatic renewals so your domain never accidentally drops into redemption, or renew manually from your dashboard at any time prior to expiration.",
    },
    {
      category: "Transfers",
      question: "Can I transfer an existing domain to AskMeDomain?",
      answer:
        "Yes. Standard ICANN transfer regulations allow domain transfers between registrars 60 days after initial registration or a previous transfer. You will need your domain's EPP/Authorization code and an unlocked domain status at your current registrar.",
    },
    {
      category: "Privacy",
      question: "Is WHOIS privacy protection included for free?",
      answer:
        "Yes, WHOIS privacy proxy protection is included at no extra charge on all top-level domains that support proxy masking (.com, .org, .net, etc.). This shields your private email, phone, and physical address from public lookup databases.",
    },
    {
      category: "Refunds",
      question: "What is your refund and cancellation policy for domain names?",
      answer:
        "Because top-level registries assess non-refundable fees immediately upon domain creation, domain registrations are typically non-refundable once registered. However, if a technical error occurs prior to registrar fulfillment, our billing system issues a complete refund within 5–7 business days.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-200/80" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear, straightforward answers about registration, ownership, renewals, and transfers.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-2xs hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full py-4.5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "rotate-180 bg-blue-50 text-[#0052FF]" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Box */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="font-bold text-slate-900">Still have questions?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our technical support team is available 24/7 to help you choose the right domain.
            </p>
          </div>
          <Link
            href="/support"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
};
