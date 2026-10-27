export interface SiteConfig {
  name: string;
  legalName: string;
  domain: string;
  tagline: string;
  description: string;
  supportEmail: string;
  salesEmail: string;
  phone: string;
  tollFreePhone: string;
  registeredAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  gstinPlaceholder: string;
  cinPlaceholder: string;
  supportHours: string;
  billingHours: string;
  dnsDefaultNameservers: [string, string];
  dynadotConfigured: boolean;
  paymentGatewaysConfigured: {
    razorpay: boolean;
    cashfree: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "AskMeDomain",
  legalName: "AskMeDomain Technologies (India) Pvt. Ltd. [Placeholder]",
  domain: "askmedomain.com",
  tagline: "Find a domain. Build something great.",
  description:
    "Fast, reliable domain search, instant registration, and transparent domain management built for modern creators and businesses.",
  supportEmail: "support@askmedomain.com",
  salesEmail: "sales@askmedomain.com",
  phone: "+91 80 4710 8899",
  tollFreePhone: "1800 200 4889",
  registeredAddress: {
    line1: "[Office Suite #402, Innovate Tower]",
    line2: "[Outer Ring Road, Marathahalli-Sarjapur Junction]",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560103",
    country: "India",
  },
  gstinPlaceholder: "29AAAAA0000A1Z5 [Configurable in production]",
  cinPlaceholder: "U72200KA2026PTC000000 [Configurable in production]",
  supportHours: "24/7/365 Technical Assistance via Ticket & Chat",
  billingHours: "Monday to Saturday, 9:30 AM – 6:30 PM IST",
  dnsDefaultNameservers: ["ns1.askmedomain.com", "ns2.askmedomain.com"],
  dynadotConfigured: Boolean(process.env.DYNADOT_API_KEY),
  paymentGatewaysConfigured: {
    razorpay: Boolean(process.env.RAZORPAY_KEY_ID),
    cashfree: Boolean(process.env.CASHFREE_APP_ID),
  },
};
