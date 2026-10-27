"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, User, ArrowRight } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navLinks = [
    { label: "Domains", href: "/domains" },
    { label: "Websites", href: "/#websites" },
    { label: "Help", href: "/support" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo size="md" />
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
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Account Link */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#0052FF] px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Account</span>
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-slate-700" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="bg-[#FF5500] text-white text-[11px] font-black h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex md:hidden items-center gap-2">
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
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none"
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
              className="flex items-center justify-between px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span>Account & DNS</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-slate-500" />
                <span>Cart ({itemCount})</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
