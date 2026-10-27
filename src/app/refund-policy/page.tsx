import React from "react";
import { siteConfig } from "@/config/site";

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Consumer Protection
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Refund and Cancellation Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: January 1, 2026 • Policy Code: AMD-REFUND-2026
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                1. Registry Non-Refundable Policy for Domain Names
              </h2>
              <p>
                Domain name registrations involve immediate, irreversible delegation in global
                central registries (such as Verisign, Public Interest Registry, and NIXI). Once a
                domain name registration request is submitted to and accepted by the central
                registry, the registry assesses a non-refundable, non-reversible transaction fee.
              </p>
              <p className="mt-2 font-semibold text-slate-800">
                Consequently, successfully registered, renewed, or transferred domain names are
                non-refundable once fulfilled in the global registry database.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                2. Scenarios Eligible for a Full Refund
              </h2>
              <p>
                We will issue a complete (100%) refund to your original payment method under the
                following conditions:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5 text-slate-600">
                <li>
                  <strong>Technical Fulfillment Failure:</strong> If payment was successfully
                  debited from your account, but the registrar API was unable to register the domain
                  due to registry downtime, pricing mismatches, or sudden unavailability.
                </li>
                <li>
                  <strong>Duplicate Billing:</strong> If your account was charged more than once for
                  the same order transaction due to a network glitch.
                </li>
                <li>
                  <strong>Pre-Delegation Cancellation:</strong> If an order is flagged or cancelled
                  before any registry command has been transmitted.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                3. Refund Processing &amp; Settlement Timeline
              </h2>
              <p>
                Approved refunds are processed back to the original source of payment:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                <li>
                  <strong>UPI Transactions:</strong> 2 to 4 business days.
                </li>
                <li>
                  <strong>Credit / Debit Cards &amp; Netbanking:</strong> 5 to 7 business days,
                  depending on your issuing bank.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Cancellation Requests</h2>
              <p>
                To request cancellation of an unfulfilled order or report a billing irregularity,
                submit a ticket through our Support Portal or email{" "}
                <span className="text-[#0052FF] font-semibold">{siteConfig.supportEmail}</span> with
                your Order ID and transaction timestamp.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
