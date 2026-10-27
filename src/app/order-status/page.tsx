"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, XCircle, ArrowRight, RefreshCw, HelpCircle, ShieldAlert } from "lucide-react";

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "pending";
  const orderId = searchParams.get("orderId") || "AMD-REF";
  const method = searchParams.get("method") || "gateway";

  const isFailed = status === "failed";

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-center shadow-xs">
        {isFailed ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <XCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              Payment Not Completed
            </span>
            <h1 className="mt-3 text-2xl font-black text-slate-900">
              Your transaction could not be processed
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Your payment was declined or interrupted. Note that per registrar policy,{" "}
              <strong>no domain has been registered</strong> until payment confirmation is verified.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left">
              <p className="font-semibold text-slate-800">What happened?</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-500">
                <li>Bank session or UPI PIN entry timed out</li>
                <li>Daily card limit exceeded or international usage disabled</li>
                <li>Payment cancelled by user</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout"
                className="flex-1 py-3 px-4 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Checkout</span>
              </Link>
              <Link
                href="/support"
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm"
              >
                Contact Billing Support
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              Payment Pending Gateway Confirmation
            </span>
            <h1 className="mt-3 text-2xl font-black text-slate-900">
              Awaiting Gateway Settlement
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Order ID: <span className="font-mono font-bold text-slate-800">{orderId}</span>
            </p>

            <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <ShieldAlert className="w-4 h-4 text-[#0052FF]" />
                <span>Registrar Compliance Verification</span>
              </div>
              <p>
                To prevent incomplete registrations, domain names are only queued to the Dynadot
                registry API once server-to-server payment webhooks confirm successful debit.
              </p>
              <p className="text-slate-500 text-[11px]">
                Configured Gateway: <span className="capitalize font-mono font-bold">{method}</span>.
                For sandbox testing, use the <em>Sandbox Test Simulation</em> option on checkout.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout"
                className="flex-1 py-3 px-4 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <span>Back to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm"
              >
                View Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OrderStatusContent />
    </Suspense>
  );
}
