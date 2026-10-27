import React from "react";
import { Hero } from "@/components/home/Hero";
import { WebsiteOfferSection } from "@/components/home/WebsiteOfferSection";
import { PricingSection } from "@/components/home/PricingSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <WebsiteOfferSection />
      <WhyChooseUs />
      <PricingSection />
      <HowItWorks />
      <FAQSection />
    </main>
  );
}
