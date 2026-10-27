"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Globe,
  Settings,
  Loader2,
} from "lucide-react";

function OrderConfirmationContent() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "AMD-DEMO-001";
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("askmedomain_orders") || "[]");
      const matched = orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);
      if (matched) {
        setOrder(matched);
      }
    } catch {
      // fallback
    }
  }, [orderId]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Payment &amp; Registration Successful
          </span>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Congratulations! Your domain is being provisioned.
          </h1>

          <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
            Order Reference: <span className="font-mono font-bold text-slate-800">{orderId}</span>
            . A confirmation receipt and DNS delegation instructions have been generated.
          </p>

          {/* Action Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Nameserver Delegation</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Assigned default AskMeDomain Anycast NS:{" "}
                  <code className="text-blue-800 font-mono text-[11px]">ns1.askmedomain.com</code>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">WHOIS Privacy Shield</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Personal identity masked on global registry databases.
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Breakdown if available */}
          {order && (
            <div className="mt-8 text-left border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Registered Domains in this Order
              </h3>
              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{item.domain}</span>
                      <span className="ml-2 text-slate-500">
                        ({item.years} {item.years === 1 ? "Year" : "Years"})
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{item.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>Total Paid (incl. ICANN &amp; GST):</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{order.total?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Manage DNS in Dashboard</span>
            </Link>

            <Link
              href="/domains"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
            >
              Register Another Domain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
