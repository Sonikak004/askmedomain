"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, DomainSearchResult } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (domain: DomainSearchResult, years?: number) => void;
  removeItem: (domainName: string) => void;
  updateYears: (domainName: string, years: number) => void;
  togglePrivacy: (domainName: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  icannFees: number;
  taxGst: number;
  total: number;
  currency: string;
  currencySymbol: string;
  isItemInCart: (domainName: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ICANN_FEE_PER_YEAR = 18; // standard ₹18 / yr fee for applicable gTLDs (.com, .net, .org, .co, .store)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("askmedomain_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore JSON parse error
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("askmedomain_cart", JSON.stringify(items));
      } catch {
        // ignore storage error
      }
    }
  }, [items, isHydrated]);

  const addItem = (domain: DomainSearchResult, years = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.domain.toLowerCase() === domain.domain.toLowerCase());
      if (existing) {
        return prev;
      }

      const hasIcannFee = !domain.extension.endsWith(".in");
      const icannFee = hasIcannFee ? ICANN_FEE_PER_YEAR : 0;

      const newItem: CartItem = {
        id: `${domain.domain}-${Date.now()}`,
        domain: domain.domain,
        name: domain.name,
        extension: domain.extension,
        years,
        pricePerYear: domain.price,
        totalPrice: domain.price * years,
        renewalPricePerYear: domain.renewalPrice,
        privacyProtection: true,
        currency: domain.currency,
        currencySymbol: domain.currencySymbol,
        icannFeePerYear: icannFee,
      };

      return [...prev, newItem];
    });
  };

  const removeItem = (domainName: string) => {
    setItems((prev) => prev.filter((i) => i.domain.toLowerCase() !== domainName.toLowerCase()));
  };

  const updateYears = (domainName: string, years: number) => {
    if (years < 1 || years > 10) return;
    setItems((prev) =>
      prev.map((i) => {
        if (i.domain.toLowerCase() === domainName.toLowerCase()) {
          return {
            ...i,
            years,
            totalPrice: i.pricePerYear * years,
          };
        }
        return i;
      })
    );
  };

  const togglePrivacy = (domainName: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.domain.toLowerCase() === domainName.toLowerCase()) {
          return {
            ...i,
            privacyProtection: !i.privacyProtection,
          };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isItemInCart = (domainName: string) => {
    return items.some((i) => i.domain.toLowerCase() === domainName.toLowerCase());
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const icannFees = items.reduce((sum, item) => sum + item.icannFeePerYear * item.years, 0);
  // GST 18% applied on subtotal + icann fees
  const taxableAmount = subtotal + icannFees;
  const taxGst = Math.round(taxableAmount * 0.18);
  const total = taxableAmount + taxGst;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateYears,
        togglePrivacy,
        clearCart,
        itemCount: items.length,
        subtotal,
        icannFees,
        taxGst,
        total,
        currency: "INR",
        currencySymbol: "₹",
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
