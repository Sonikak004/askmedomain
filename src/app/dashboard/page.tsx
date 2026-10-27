"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserDomain, DNSRecord } from "@/types";
import {
  Globe,
  Settings,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  ExternalLink,
  Receipt,
  User,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"domains" | "dns" | "orders" | "settings">("domains");
  const [userDomains, setUserDomains] = useState<UserDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<UserDomain | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [nameserverMode, setNameserverMode] = useState<"default" | "custom">("default");
  const [customNs1, setCustomNs1] = useState("ns1.cloudflare.com");
  const [customNs2, setCustomNs2] = useState("ns2.cloudflare.com");
  const [orders, setOrders] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // New DNS Record Form state
  const [newRecordType, setNewRecordType] = useState<"A" | "CNAME" | "MX" | "TXT">("A");
  const [newRecordName, setNewRecordName] = useState("@");
  const [newRecordValue, setNewRecordValue] = useState("");
  const [newRecordTtl, setNewRecordTtl] = useState(3600);

  useEffect(() => {
    try {
      const storedDomains = JSON.parse(
        localStorage.getItem("askmedomain_user_domains") || "[]"
      );
      if (storedDomains.length > 0) {
        setUserDomains(storedDomains);
        setSelectedDomain(storedDomains[0]);
        setDnsRecords(storedDomains[0].dnsRecords || []);
      } else {
        // Sample default domains for dashboard exploration
        const defaultSampleDomains: UserDomain[] = [
          {
            id: "dom-sample-1",
            domain: "mybrandhq.com",
            status: "Active",
            registeredDate: "2026-01-15",
            expiryDate: "2027-01-15",
            autoRenew: true,
            privacyProtected: true,
            nameserverType: "default",
            customNameservers: ["ns1.askmedomain.com", "ns2.askmedomain.com"],
            dnsRecords: [
              { id: "1", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 },
              { id: "2", type: "CNAME", name: "www", value: "cname.vercel-dns.com", ttl: 3600 },
              { id: "3", type: "MX", name: "@", value: "mail.askmedomain.com", ttl: 3600, priority: 10 },
            ],
          },
          {
            id: "dom-sample-2",
            domain: "innovateindia.in",
            status: "Active",
            registeredDate: "2026-03-20",
            expiryDate: "2027-03-20",
            autoRenew: false,
            privacyProtected: true,
            nameserverType: "default",
            customNameservers: ["ns1.askmedomain.com", "ns2.askmedomain.com"],
            dnsRecords: [
              { id: "1", type: "A", name: "@", value: "192.0.2.1", ttl: 3600 },
            ],
          },
        ];
        setUserDomains(defaultSampleDomains);
        setSelectedDomain(defaultSampleDomains[0]);
        setDnsRecords(defaultSampleDomains[0].dnsRecords);
      }

      const storedOrders = JSON.parse(localStorage.getItem("askmedomain_orders") || "[]");
      setOrders(storedOrders);
    } catch {
      // fallback
    }
  }, []);

  const handleSelectDomainForDns = (domain: UserDomain) => {
    setSelectedDomain(domain);
    setDnsRecords(domain.dnsRecords || []);
    setNameserverMode(domain.nameserverType || "default");
    setActiveTab("dns");
  };

  const handleAddDnsRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordValue.trim()) return;

    const newRec: DNSRecord = {
      id: `rec-${Date.now()}`,
      type: newRecordType,
      name: newRecordName.trim() || "@",
      value: newRecordValue.trim(),
      ttl: Number(newRecordTtl),
    };

    const updated = [...dnsRecords, newRec];
    setDnsRecords(updated);
    setNewRecordValue("");
    showBanner("DNS Record added successfully (propagating to Anycast nodes).");
  };

  const handleDeleteDnsRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter((r) => r.id !== id));
    showBanner("DNS Record removed.");
  };

  const handleSaveNameservers = () => {
    showBanner(
      nameserverMode === "default"
        ? "Assigned default AskMeDomain Anycast Nameservers."
        : `Delegated custom nameservers: ${customNs1}, ${customNs2}`
    );
  };

  const toggleAutoRenew = (domainId: string) => {
    setUserDomains((prev) =>
      prev.map((d) => {
        if (d.id === domainId) {
          const updated = { ...d, autoRenew: !d.autoRenew };
          showBanner(`Auto-renewal ${updated.autoRenew ? "enabled" : "disabled"} for ${d.domain}.`);
          return updated;
        }
        return d;
      })
    );
  };

  const showBanner = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Registrar Client Portal
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              Domain Management Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage nameservers, DNS zones, renewals, and billing records in one place.
            </p>
          </div>

          <Link
            href="/domains"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-xs shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Domain</span>
          </Link>
        </div>

        {/* Temporary Notification Toast */}
        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Architecture Notice */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#0052FF] shrink-0" />
            <span>
              <strong>Dynadot Registry Integration:</strong> DNS changes propagate through Anycast
              DNS servers. In production, changes sync directly via authenticated registrar API commands.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#0052FF] font-bold shrink-0">
            Anycast Active
          </span>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          {[
            { id: "domains", label: "My Domains", count: userDomains.length },
            { id: "dns", label: "DNS & Nameservers" },
            { id: "orders", label: "Order History", count: orders.length },
            { id: "settings", label: "Account & WHOIS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#0052FF] text-[#0052FF]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: MY DOMAINS */}
        {activeTab === "domains" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Domain Name</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Expiry Date</th>
                      <th className="py-3.5 px-4">WHOIS Privacy</th>
                      <th className="py-3.5 px-4">Auto-Renew</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {userDomains.map((dom) => (
                      <tr key={dom.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#0052FF]" />
                            <span>{dom.domain}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{dom.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-600">
                          {dom.expiryDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Protected</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            type="button"
                            onClick={() => toggleAutoRenew(dom.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                              dom.autoRenew
                                ? "bg-blue-50 text-[#0052FF] hover:bg-blue-100"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {dom.autoRenew ? "ON" : "OFF"}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectDomainForDns(dom)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0052FF] hover:text-white text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Manage DNS
                            </button>
                            <Link
                              href={`/cart`}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                            >
                              Renew
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DNS & NAMESERVERS */}
        {activeTab === "dns" && (
          <div className="space-y-8">
            {/* Domain Selector Dropdown if multiple */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  Active Domain Zone
                </label>
                <div className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0052FF]" />
                  <span>{selectedDomain?.domain || "Select a domain"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Switch:</span>
                <select
                  value={selectedDomain?.domain}
                  onChange={(e) => {
                    const match = userDomains.find((d) => d.domain === e.target.value);
                    if (match) {
                      setSelectedDomain(match);
                      setDnsRecords(match.dnsRecords || []);
                    }
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {userDomains.map((d) => (
                    <option key={d.id} value={d.domain}>
                      {d.domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nameserver Management Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Nameserver (NS) Configuration
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Choose whether AskMeDomain manages your DNS records or delegate authority to custom
                nameservers (e.g. Cloudflare, AWS Route53).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    nameserverMode === "default"
                      ? "border-[#0052FF] bg-blue-50/40 ring-1 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="nsMode"
                      value="default"
                      checked={nameserverMode === "default"}
                      onChange={() => setNameserverMode("default")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        Default AskMeDomain Anycast Nameservers (Recommended)
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Ultra-low latency global DNS propagation with built-in DDoS mitigation.
                      </p>
                      <div className="mt-2 font-mono text-[11px] text-blue-800 space-y-0.5">
                        <p>ns1.askmedomain.com</p>
                        <p>ns2.askmedomain.com</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    nameserverMode === "custom"
                      ? "border-[#0052FF] bg-blue-50/40 ring-1 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="nsMode"
                      value="custom"
                      checked={nameserverMode === "custom"}
                      onChange={() => setNameserverMode("custom")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        Custom Third-Party Nameservers
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Point to Cloudflare, AWS, DigitalOcean, or your web host.
                      </p>
                      {nameserverMode === "custom" && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            value={customNs1}
                            onChange={(e) => setCustomNs1(e.target.value)}
                            placeholder="Primary NS (e.g. ns1.example.com)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={customNs2}
                            onChange={(e) => setCustomNs2(e.target.value)}
                            placeholder="Secondary NS (e.g. ns2.example.com)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveNameservers}
                className="px-5 py-2.5 rounded-xl bg-[#0052FF] hover:bg-[#0043D6] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Save Nameserver Changes
              </button>
            </div>

            {/* DNS Records Table */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">DNS Zone Records</h3>
                  <p className="text-xs text-slate-500">
                    Add A, CNAME, MX, or TXT records for your website, Google Workspace, or email.
                  </p>
                </div>
              </div>

              {/* Add New Record Form */}
              <form
                onSubmit={handleAddDnsRecord}
                className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Type</label>
                  <select
                    value={newRecordType}
                    onChange={(e) => setNewRecordType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  >
                    <option value="A">A (IPv4)</option>
                    <option value="CNAME">CNAME (Alias)</option>
                    <option value="MX">MX (Mail)</option>
                    <option value="TXT">TXT (Verification)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Name / Host</label>
                  <input
                    type="text"
                    value={newRecordName}
                    onChange={(e) => setNewRecordName(e.target.value)}
                    placeholder="@ or www"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Target / Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRecordValue}
                    onChange={(e) => setNewRecordValue(e.target.value)}
                    placeholder="e.g. 76.76.21.21 or cname.vercel.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-lg bg-[#FF5500] hover:bg-[#E54D00] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Record</span>
                  </button>
                </div>
              </form>

              {/* Records List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Host / Name</th>
                      <th className="py-2.5 px-4">Value / Destination</th>
                      <th className="py-2.5 px-4">TTL</th>
                      <th className="py-2.5 px-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {dnsRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-[#0052FF]">{rec.type}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{rec.name}</td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-600">{rec.value}</td>
                        <td className="py-3 px-4 text-slate-400">{rec.ttl}s</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteDnsRecord(rec.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No past orders yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Once you complete a domain checkout, your tax invoices and order histories will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-6">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Registered Items</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-6 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                        <td className="py-4 px-4 text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          {o.items?.map((i: any) => i.domain).join(", ")}
                        </td>
                        <td className="py-4 px-4 uppercase font-mono text-[11px] text-slate-600">
                          {o.paymentMethod}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900">
                          ₹{o.total?.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/order-confirmation/${o.id}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                          >
                            View Receipt
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Account &amp; Security</h3>
            <p className="text-xs text-slate-500 mb-6">
              Manage your login security and default WHOIS contact details.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Email</label>
                <input
                  type="email"
                  readOnly
                  value="demo-customer@askmedomain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Two-Factor Authentication (2FA)
                </label>
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Registrar 2FA Protection</p>
                    <p className="text-slate-500 text-[11px]">
                      Requires authenticator app confirmation before releasing domain transfers.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Lock</label>
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Registry Lock (EPP 60-day Lock)</p>
                    <p className="text-slate-500 text-[11px]">
                      Prevents unauthorized or fraudulent domain transfers between registrars.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-[#0052FF]">
                    Enforced
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
