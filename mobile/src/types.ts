export type Locale = "en" | "bm" | "zh";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  twoFaEnabled: boolean;
  locale: Locale;
  createdAt: string;
}

export interface AvailabilityZone {
  id: string;
  name: string;
  floor: string;
  available: number;
  occupied: number;
  type?: "public" | "staff" | "ev" | "disabled";
}

export interface AvailabilitySnapshot {
  carparkId: string;
  timestamp: string;
  zones: AvailabilityZone[];
}

