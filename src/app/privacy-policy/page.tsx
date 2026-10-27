import React from "react";
import { siteConfig } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Legal &amp; Compliance
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: January 1, 2026 • Effective Immediately
          </p>

          <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview and Scope</h2>
              <p>
                {siteConfig.legalName} (&quot;{siteConfig.name}&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the
                domain registration and DNS management portal located at {siteConfig.domain}. We
                respect your privacy and are committed to protecting the personal data of our users
                in compliance with the Digital Personal Data Protection (DPDP) Act 2023 and
                applicable global data protection regulations (including GDPR where relevant).
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                2. Information We Collect for Domain Registration
              </h2>
              <p>
                To comply with Internet Corporation for Assigned Names and Numbers (ICANN) mandates
                and country-code Top-Level Domain (ccTLD) registry regulations, we collect the
                following information during checkout:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                <li>
                  <strong>Registrant Contact Data:</strong> Full legal name, organization (if
                  applicable), physical postal address, telephone number, and email address.
                </li>
                <li>
                  <strong>Billing &amp; Tax Information:</strong> Payment method token, billing
                  address, and GSTIN (for Indian tax invoicing).
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, and server request logs
                  for fraud prevention and security monitoring.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                3. WHOIS Directory &amp; Privacy Proxy Protection
              </h2>
              <p>
                By default on all eligible generic top-level domains (.com, .net, .org, .co, .store),
                AskMeDomain attaches complimentary WHOIS Privacy Proxy masking. This replaces your
                personal physical address, email, and phone number with anonymized proxy data in the
                publicly queryable WHOIS directory, guarding against spam, identity theft, and
                unsolicited commercial contact.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Note: Certain country-code registries (such as .in or .us) may have specific
                regulatory guidelines regarding WHOIS disclosure that differ from gTLDs.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                4. Data Sharing with Certified Registries
              </h2>
              <p>
                To effectuate domain registration, registrant data must be securely transmitted via
                encrypted APIs to certified wholesale registrar partners (such as Dynadot LLC) and
                underlying domain registries (such as Verisign for .com, PIR for .org, and NIXI for
                .in). We never sell, rent, or trade your personal data to marketing third parties.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention &amp; Security</h2>
              <p>
                Your registration records are maintained for the active lifecycle of your registered
                domains and as required by regulatory compliance mandates. We enforce 256-bit TLS
                encryption across all sessions, database encryption at rest, and optional
                two-factor authentication for portal access.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                6. Contact Our Data Protection Officer
              </h2>
              <p>
                For data access requests, rectification, or privacy inquiries, contact:
                <br />
                Email: <span className="text-[#0052FF]">{siteConfig.supportEmail}</span>
                <br />
                Address: {siteConfig.legalName}, {siteConfig.registeredAddress.line1},{" "}
                {siteConfig.registeredAddress.city}, {siteConfig.registeredAddress.state} –{" "}
                {siteConfig.registeredAddress.postalCode}, {siteConfig.registeredAddress.country}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
