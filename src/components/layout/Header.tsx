"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, User, ArrowRight, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navLinks = [
    { label: "Domains", href: "/domains" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Support", href: "/support" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Logo size="md" />
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-[11px] font-semibold text-[#0052FF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>Secure Domain Registrar</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-150 ${
                  isActive(link.href)
                    ? "text-[#0052FF] font-bold"
                    : "text-slate-700 hover:text-[#0052FF]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 text-slate-700 hover:text-[#0052FF] hover:bg-slate-50 rounded-xl transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5500] text-white text-[11px] font-bold h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            {/* Login Link */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#0052FF] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Login</span>
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold text-white bg-[#0052FF] hover:bg-[#0043D6] px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-slate-700 hover:text-[#0052FF] rounded-lg"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF5500] text-white text-[10px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-50 text-[#0052FF]"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <span>Client Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center text-sm font-semibold text-slate-700 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center text-sm font-semibold text-white bg-[#0052FF] py-2.5 rounded-xl shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
