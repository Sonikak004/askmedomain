"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { CustomerBillingDetails, RegistrantContactDetails, PaymentMethod } from "@/types";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, icannFees, taxGst, total, currencySymbol, clearCart } = useCart();

  const [customer, setCustomer] = useState<CustomerBillingDetails>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    gstin: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Karnataka",
    postalCode: "",
    country: "India",
  });

  const [useSameForRegistrant, setUseSameForRegistrant] = useState(true);
  const [registrant, setRegistrant] = useState<RegistrantContactDetails>({
    useBillingContact: true,
    registrantName: "",
    organization: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("sandbox");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Please add at least one domain to your cart before proceeding to checkout.
        </p>
        <Link
          href="/domains"
          className="px-6 py-3 rounded-xl bg-[#0052FF] text-white font-bold text-sm"
        >
          Search Domains
        </Link>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customer.fullName || !customer.email || !customer.phone || !customer.addressLine1) {
      setErrorMessage("Please complete all required customer billing fields.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("You must agree to the Registration Terms and Master Service Agreement.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `AMD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const orderPayload = {
        id: orderId,
        orderNumber: orderId,
        createdAt: new Date().toISOString(),
        items,
        subtotal,
        icannFees,
        taxGst,
        total,
        currency: "INR",
        customer,
        registrant: useSameForRegistrant
          ? {
              useBillingContact: true,
              registrantName: customer.fullName,
              organization: customer.companyName || "",
              email: customer.email,
              phone: customer.phone,
              address: customer.addressLine1,
              city: customer.city,
              state: customer.state,
              postalCode: customer.postalCode,
              country: customer.country,
            }
          : registrant,
        paymentMethod,
        paymentStatus: paymentMethod === "sandbox" ? "success" : "pending",
        domainRegistrationStatus:
          paymentMethod === "sandbox" ? "queued_for_registrar" : "pending_payment",
      };

      // Store simulated order record in localStorage for confirmation & dashboard view
      try {
        const existingOrders = JSON.parse(
          localStorage.getItem("askmedomain_orders") || "[]"
        );
        existingOrders.unshift(orderPayload);
        localStorage.setItem("askmedomain_orders", JSON.stringify(existingOrders));

        // Also add domains to active user domains in localStorage
        const existingDomains = JSON.parse(
          localStorage.getItem("askmedomain_user_domains") || "[]"
        );
        const newDomains = items.map((item) => ({
          id: `dom-${item.domain}-${Date.now()}`,
          domain: item.domain,
          status: "Active",
          registeredDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(Date.now() + item.years * 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          autoRenew: true,
          privacyProtected: true,
          nameserverType: "default",
          customNameservers: ["ns1.askmedomain.com", "ns2.askmedomain.com"],
          dnsRecords: [
            { id: "1", type: "A", name: "@", value: "192.0.2.1", ttl: 3600 },
            { id: "2", type: "CNAME", name: "www", value: item.domain, ttl: 3600 },
          ],
        }));
        localStorage.setItem(
          "askmedomain_user_domains",
          JSON.stringify([...newDomains, ...existingDomains])
        );
      } catch (err) {
        console.error("Storage save failed:", err);
      }

      // Route based on payment choice
      if (paymentMethod === "cashfree") {
        const cfResponse = await fetch("/api/payments/cashfree/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            total,
            customer,
            registrant: orderPayload.registrant,
          }),
        });

        const cfData = await cfResponse.json();

        if (!cfResponse.ok || !cfData.paymentSessionId) {
          throw new Error(
            cfData.error ||
              "Failed to initialize Cashfree payment. Please verify your CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local."
          );
        }

        // Store Cashfree order ID reference
        const cfUpdatedOrder = {
          ...orderPayload,
          id: cfData.orderId,
          orderNumber: cfData.orderId,
          cfOrderId: cfData.cfOrderId,
          paymentSessionId: cfData.paymentSessionId,
        };

        try {
          const existingOrders = JSON.parse(
            localStorage.getItem("askmedomain_orders") || "[]"
          );
          existingOrders.unshift(cfUpdatedOrder);
          localStorage.setItem("askmedomain_orders", JSON.stringify(existingOrders));
        } catch (e) {
          console.error("Failed to store Cashfree order:", e);
        }

        clearCart();

        // Check if Cashfree SDK is loaded
        if (typeof (window as any).Cashfree === "undefined") {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Cashfree payment SDK"));
            document.body.appendChild(script);
          });
        }

        const cashfree = (window as any).Cashfree({
          mode: cfData.environment === "production" ? "production" : "sandbox",
        });

        await cashfree.checkout({
          paymentSessionId: cfData.paymentSessionId,
          redirectTarget: "_self",
        });
        return;
      } else if (paymentMethod === "sandbox") {
        clearCart();
        router.push(`/order-confirmation/${orderId}?status=success`);
      } else {
        clearCart();
        // Pending status for real gateway keys until configured
        router.push(`/order-status?status=pending&orderId=${orderId}&method=${paymentMethod}`);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "An unexpected error occurred during checkout. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout &amp; Domain Registration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete your billing details and select payment method to register your domain names.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Customer Contact & Billing Details */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052FF] font-bold text-sm flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Customer &amp; Billing Details</h2>
                    <p className="text-xs text-slate-500">
                      Receipts and registration confirmation will be sent here
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Billing Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.addressLine1}
                      onChange={(e) => setCustomer({ ...customer, addressLine1: e.target.value })}
                      placeholder="Street address, building, floor"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      PIN / Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      placeholder="560001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={customer.country}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Optional GSTIN for businesses */}
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">
                        Business Tax Invoice (Optional)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={customer.companyName}
                        onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                        placeholder="Company / Legal Entity Name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052FF]"
                      />
                      <input
                        type="text"
                        value={customer.gstin}
                        onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })}
                        placeholder="GSTIN (e.g. 29AAAAA0000A1Z5)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: WHOIS Registrant Contact Information */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052FF] font-bold text-sm flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        WHOIS Registrant Information
                      </h2>
                      <p className="text-xs text-slate-500">
                        Legal domain owner record for the registry
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 mb-4">
                  <input
                    type="checkbox"
                    id="same-as-billing"
                    checked={useSameForRegistrant}
                    onChange={(e) => setUseSameForRegistrant(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0052FF] focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="same-as-billing" className="font-semibold cursor-pointer">
                    Use customer billing details as official WHOIS domain registrant
                  </label>
                </div>

                {!useSameForRegistrant && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Registrant Full Name"
                        value={registrant.registrantName}
                        onChange={(e) =>
                          setRegistrant({ ...registrant, registrantName: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="email"
                        placeholder="Registrant Email"
                        value={registrant.email}
                        onChange={(e) => setRegistrant({ ...registrant, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Registrant Phone"
                        value={registrant.phone}
                        onChange={(e) => setRegistrant({ ...registrant, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Physical Address"
                        value={registrant.address}
                        onChange={(e) => setRegistrant({ ...registrant, address: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-emerald-600 mt-2 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>WHOIS Privacy is active: your personal details will be masked in public registries.</span>
                </div>
              </div>

              {/* Step 3: Payment Gateway Selector */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5500] font-bold text-sm flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>
                    <p className="text-xs text-slate-500">
                      Encrypted payments with instant provisioning upon confirmation
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Sandbox Simulated Option */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "sandbox"
                        ? "border-[#0052FF] bg-blue-50/40 ring-1 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="sandbox"
                          checked={paymentMethod === "sandbox"}
                          onChange={() => setPaymentMethod("sandbox")}
                          className="mt-1 w-4 h-4 text-[#0052FF]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              Sandbox Test Simulation
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Instant Demo
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Simulate successful registration and instant provisioning without entering
                            real card or UPI details.
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#0052FF] shrink-0" />
                    </div>
                  </label>

                  {/* Razorpay Gateway */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "razorpay"
                        ? "border-[#0052FF] bg-blue-50/40 ring-1 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={paymentMethod === "razorpay"}
                          onChange={() => setPaymentMethod("razorpay")}
                          className="mt-1 w-4 h-4 text-[#0052FF]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              Razorpay (UPI, Netbanking, Cards)
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                              Pre-activation
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, Netbanking.
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </label>

                  {/* Cashfree Gateway */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cashfree"
                        ? "border-[#0052FF] bg-blue-50/40 ring-1 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cashfree"
                          checked={paymentMethod === "cashfree"}
                          onChange={() => setPaymentMethod("cashfree")}
                          className="mt-1 w-4 h-4 text-[#0052FF]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              Cashfree Payments (UPI, Cards, NetBanking)
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0052FF]">
                              Direct Gateway
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Google Pay, PhonePe, Paytm, BHIM UPI, RuPay, Visa, Mastercard, NetBanking.
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </label>
                </div>

                {/* Clear Compliance & Gateway Policy Notice */}
                <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#0052FF] shrink-0 mt-0.5" />
                  <span>
                    <strong>Fulfillment Security Policy:</strong> Domains are not marked as registered
                    until payment settlement and registrar API confirmation are both validated.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Checkout Summary
                </h3>

                {/* Items in Checkout */}
                <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{item.domain}</span>
                        <div className="text-[10px] text-slate-400">
                          {item.years} {item.years === 1 ? "Year" : "Years"} registration
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {currencySymbol}
                        {item.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      {currencySymbol}
                      {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>ICANN Mandated Fees</span>
                    <span className="font-semibold text-slate-900">
                      {currencySymbol}
                      {icannFees.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>WHOIS Privacy</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-slate-900">
                      {currencySymbol}
                      {taxGst.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Final Total</span>
                    <span className="text-2xl font-black text-slate-900">
                      {currencySymbol}
                      {total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#0052FF]"
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/terms-and-conditions" target="_blank" className="text-[#0052FF] underline">
                        Registration Agreement
                      </Link>
                      ,{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-[#0052FF] underline">
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link href="/refund-policy" target="_blank" className="text-[#0052FF] underline">
                        Refund Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-4 rounded-xl bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? "Registering Domain..."
                        : `Pay ${currencySymbol}${total.toLocaleString("en-IN")}`}
                    </span>
                    {!isProcessing && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-[10px] text-slate-400">
                    256-bit TLS encrypted bank-grade checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
