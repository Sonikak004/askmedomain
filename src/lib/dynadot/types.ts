export interface DynadotPriceTier {
  currency: string;
  unit: string; // e.g. "(price/1 year)"
  registration_price: string;
  renewal_price: string;
  transfer_price?: string;
  restore_price?: string;
}

export interface DynadotSearchRawData {
  domain_name: string;
  available: "Yes" | "No";
  premium: "yes" | "no" | "unknown";
  price_list?: DynadotPriceTier[];
}

export interface DynadotSearchApiResponse {
  code: number;
  message: string;
  data?: DynadotSearchRawData;
  error?: {
    description?: string;
  };
}

export interface DynadotDomainSearchResult {
  domain: string;
  name: string;
  extension: string;
  available: boolean;
  isPremium: boolean;
  registrarCost: number;
  markupPercent: number;
  customerPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
  currencySymbol: string;
  period: string;
  privacyIncluded: boolean;
  recommendationReason?: string;
}
