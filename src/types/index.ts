export interface DomainSearchResult {
  domain: string;
  name: string;
  extension: string;
  available: boolean;
  isPremium?: boolean;
  price: number;
  renewalPrice: number;
  currency: string;
  currencySymbol: string;
  period: string;
  privacyIncluded: boolean;
  recommendationReason?: string;
}

export interface DomainSearchResponse {
  query: string;
  exactMatch: DomainSearchResult;
  alternatives: DomainSearchResult[];
  isDemoMode: boolean;
  demoNotice?: string;
  timestamp: string;
}

export interface CartItem {
  id: string; // e.g. "askme-com-1"
  domain: string;
  name: string;
  extension: string;
  years: number;
  pricePerYear: number;
  totalPrice: number;
  renewalPricePerYear: number;
  privacyProtection: boolean;
  currency: string;
  currencySymbol: string;
  icannFeePerYear: number;
}

export interface CustomerBillingDetails {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  gstin?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  saveForFuture?: boolean;
}

export interface RegistrantContactDetails {
  useBillingContact: boolean;
  registrantName: string;
  organization?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = "razorpay" | "cashfree" | "sandbox";
export type PaymentStatus = "pending" | "processing" | "success" | "failed";

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  icannFees: number;
  taxGst: number;
  total: number;
  currency: string;
  customer: CustomerBillingDetails;
  registrant: RegistrantContactDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  domainRegistrationStatus: "pending_payment" | "queued_for_registrar" | "registered" | "failed";
}

export interface DNSRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface UserDomain {
  id: string;
  domain: string;
  status: "Active" | "Expiring Soon" | "Pending Verification" | "Expired";
  registeredDate: string;
  expiryDate: string;
  autoRenew: boolean;
  privacyProtected: boolean;
  nameserverType: "default" | "custom";
  customNameservers: string[];
  dnsRecords: DNSRecord[];
}
