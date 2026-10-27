import React from "react";
import { siteConfig } from "@/config/site";
import { Globe, Clock, ShieldCheck, Mail, FileText } from "lucide-react";

export default function DeliveryPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Fulfillment Guidelines
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Digital Delivery &amp; Provisioning Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: January 1, 2026 • Policy Code: AMD-DELIVERY-2026
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                1. Nature of Products: 100% Digital Delivery
              </h2>
              <p>
                All products and services offered on {siteConfig.domain}—including domain name
                registrations, domain renewals, WHOIS privacy proxy masking, and Anycast DNS
                management—are digital intangible services.{" "}
                <strong>
                  No physical goods or physical parcels are shipped or delivered to any mailing
                  address.
                </strong>
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                2. Instant Digital Provisioning Process
              </h2>
              <p>
                Upon verified payment authorization through our payment gateways (Razorpay, Cashfree,
                or Sandbox):
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                    <Globe className="w-4 h-4 text-[#0052FF]" />
                    <span>Registry Delegation</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Domain delegation commands are transmitted immediately to the central registry
                    database via Dynadot API within seconds of checkout.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Global DNS Propagation</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Default Anycast nameservers begin broadcasting worldwide immediately. Full ISP
                    cache propagation typically completes within 1 to 24 hours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                    <Mail className="w-4 h-4 text-[#FF5500]" />
                    <span>Electronic Confirmation Receipt</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    A digital Tax Invoice, order confirmation, and WHOIS registration receipt are
                    transmitted to your registered email immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Dashboard Access</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Your domain appears instantly in your user dashboard, with full authorization to
                    edit DNS zones, set A records, and lock transfers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                3. What to do if Delivery is Delayed
              </h2>
              <p>
                In rare events where a central registry is undergoing scheduled maintenance or
                experiencing API connectivity slowdowns, your order will remain in &quot;Queued for
                Fulfillment&quot; status. If your domain is not active within 60 minutes of payment,
                contact our 24/7 technical desk at{" "}
                <span className="text-[#0052FF] font-semibold">{siteConfig.supportEmail}</span> with
                your order reference number for manual expediting.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
