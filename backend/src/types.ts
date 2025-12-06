export type Locale = "en" | "bm" | "zh";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  twoFaEnabled: boolean;
  locale: Locale;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  bayId?: string;
  startedAt: Date;
  endedAt?: Date;
  feeCentsEstimate?: number;
  feeCentsFinal?: number;
  status: "active" | "ended" | "pending_payment" | "paid";
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
  timestamp: Date;
  zones: AvailabilityZone[];
}

