"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Lock,
  Sparkles,
  Info,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateYears,
    subtotal,
    icannFees,
    taxGst,
    total,
    currencySymbol,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-500">
            Looks like you haven&apos;t added any domains yet. Find your perfect brand name now!
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/domains"
              className="w-full py-3 px-4 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Search Domains</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
            >
              View TLD Pricing Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/domains"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052FF] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Domain Search</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Review Your Cart
            </h1>
            <p className="text-sm text-slate-500">
              {items.length} {items.length === 1 ? "domain" : "domains"} ready for registration
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Domain Name & Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-black text-slate-900">
                        {item.domain}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0052FF]">
                        New Registration
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        WHOIS Privacy Included
                      </span>
                      <span>•</span>
                      <span>Renews at {item.currencySymbol}{item.renewalPricePerYear.toLocaleString("en-IN")}/yr</span>
                    </div>
                  </div>

                  {/* Year Duration Selector & Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">
                        {item.currencySymbol}
                        {item.totalPrice.toLocaleString("en-IN")}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {item.currencySymbol}
                        {item.pricePerYear.toLocaleString("en-IN")} / year
                      </div>
                    </div>

                    {/* Term Selector */}
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`term-${item.domain}`} className="text-xs text-slate-500 font-medium">
                        Period:
                      </label>
                      <select
                        id={`term-${item.domain}`}
                        value={item.years}
                        onChange={(e) => updateYears(item.domain, parseInt(e.target.value, 10))}
                        className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="1">1 Year</option>
                        <option value="2">2 Years</option>
                        <option value="3">3 Years</option>
                        <option value="5">5 Years</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => removeItem(item.domain)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove domain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Free Included Perks Row */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Anycast DNS Management: <strong>Free</strong>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Registrar Transfer Lock: <strong>Enabled</strong>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Digital Provisioning: <strong>Instant</strong>
                  </span>
                </div>
              </div>
            ))}

            {/* Registrar notice */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#0052FF] shrink-0 mt-0.5" />
              <span>
                <strong>ICANN Compliance Notice:</strong> Top-level domain registrations require accurate
                registrant contact information. You will confirm your WHOIS details on the next step.
              </span>
            </div>
          </div>

          {/* Order Summary Card (Right 1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Domain Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {currencySymbol}
                    {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1">
                    ICANN Mandatory Fees
                    <span className="text-[10px] text-slate-400 font-mono">(₹18/yr)</span>
                  </span>
                  <span className="font-semibold text-slate-900">
                    {currencySymbol}
                    {icannFees.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span>WHOIS Privacy Protection</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span>GST / Sales Tax (18%)</span>
                  <span className="font-semibold text-slate-900">
                    {currencySymbol}
                    {taxGst.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Estimated Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">
                      {currencySymbol}
                      {total.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-slate-400">All taxes included</p>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-400">
                  Ready for Cashfree &amp; Razorpay payment gateways
                </p>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0052FF] shrink-0" />
              <span>
                256-bit encrypted checkout. Domains are immediately locked to your registrant account
                upon successful settlement.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
