"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Contact Us
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            We are here to help
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Have questions about a domain transfer, registry pricing, or billing invoice? Reach our
            dedicated team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Official Business Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Registered Contact Information
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Email Inquiries</p>
                  <p className="text-xs text-slate-500">Technical: {siteConfig.supportEmail}</p>
                  <p className="text-xs text-slate-500">Billing: {siteConfig.salesEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Telephone Helpline</p>
                  <p className="text-xs text-slate-700 font-semibold">{siteConfig.phone}</p>
                  <p className="text-xs text-slate-500">Toll-Free: {siteConfig.tollFreePhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Registered Office Address</p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {siteConfig.legalName}
                    <br />
                    {siteConfig.registeredAddress.line1}, {siteConfig.registeredAddress.line2}
                    <br />
                    {siteConfig.registeredAddress.city}, {siteConfig.registeredAddress.state} –{" "}
                    {siteConfig.registeredAddress.postalCode}, {siteConfig.registeredAddress.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Support &amp; Desk Hours</p>
                  <p className="text-xs text-slate-600">Technical: {siteConfig.supportHours}</p>
                  <p className="text-xs text-slate-500">Billing: {siteConfig.billingHours}</p>
                </div>
              </div>

              {/* Tax & Legal Compliance Box */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p>
                  GSTIN: <span className="font-mono text-slate-700">{siteConfig.gstinPlaceholder}</span>
                </p>
                <p>
                  CIN: <span className="font-mono text-slate-700">{siteConfig.cinPlaceholder}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xs">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Send us a direct message</h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the details below and an AskMeDomain representative will respond shortly.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-emerald-900">Message Received</h4>
                  <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                    Thank you, {name}. Your message has been routed to our technical support desk. We
                    will email you at <strong>{email}</strong> within 30 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Nair"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subject / Domain In Question *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Domain transfer question regarding mybrand.in"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share details about your question, domain issue, or inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
