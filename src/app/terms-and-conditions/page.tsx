import React from "react";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Terms of Service
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: January 1, 2026 • Master Domain Registration Agreement
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
              <p>
                By creating an account, searching, submitting a domain registration order, or
                utilizing DNS management services on {siteConfig.domain}, you agree to be bound by
                these Terms and Conditions, all applicable ICANN policies, and the registry-specific
                rules for your chosen domain extension.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                2. Role of AskMeDomain &amp; Wholesale Registrars
              </h2>
              <p>
                {siteConfig.name} operates as a domain registrar interface and management platform.
                Live registrations are processed through accredited registrar infrastructure
                (including Dynadot LLC). Your registration is subject to the master ICANN Registrar
                Accreditation Agreement and relevant Registry Agreements.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                3. Registrant Responsibilities &amp; WHOIS Accuracy
              </h2>
              <p>
                You warrant that all contact information provided during registration (name,
                address, email, phone) is accurate, current, and verifiable. Providing willfully
                false information constitutes a material breach of this Agreement and may lead to
                immediate domain suspension per ICANN regulations.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                4. Fees, Payment, and Fulfillment
              </h2>
              <p>
                Domain registration fees must be settled in full prior to domain delegation.{" "}
                <strong>
                  No domain is considered legally registered or reserved until payment confirmation
                  and successful registry API fulfillment have both occurred.
                </strong>{" "}
                Prices displayed include base registry fees and applicable GST.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                5. Renewals, Expiration, and Redemption Grace Periods
              </h2>
              <p>
                Domain registrations are term-based (1–10 years). While AskMeDomain sends automated
                renewal reminders to your registered email address, the ultimate responsibility for
                renewing the domain prior to its expiration date rests solely with the registrant.
                Expired domains enter an ICANN renewal grace period followed by a redemption period
                before being returned to the public pool.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                6. Domain Dispute Resolution (UDRP / INDRP)
              </h2>
              <p>
                You agree to submit to the Uniform Domain-Name Dispute-Resolution Policy (UDRP)
                approved by ICANN, or the .IN Dispute Resolution Policy (INDRP) for .in domains, in
                the event of any trademark or intellectual property claim brought by a third party.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                7. Limitation of Liability &amp; Governing Law
              </h2>
              <p>
                To the fullest extent permitted by law, {siteConfig.legalName} shall not be liable
                for indirect, incidental, or consequential damages resulting from registry outages,
                DNS propagation delays, or third-party registry cancellations. These terms are
                governed by the laws of India, subject to the jurisdiction of courts in Bengaluru,
                Karnataka.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
