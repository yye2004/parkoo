import { randomUUID } from "crypto";
import { AvailabilitySnapshot, Session, User } from "../types";

const users = new Map<string, User>();
const sessions = new Map<string, Session>();

const availability: AvailabilitySnapshot = {
  carparkId: "carpark-main",
  timestamp: new Date(),
  zones: [
    { id: "z-1", name: "Basement A", floor: "B1", available: 12, occupied: 88, type: "public" },
    { id: "z-2", name: "Level 1 East", floor: "L1", available: 34, occupied: 20, type: "public" },
    { id: "z-3", name: "EV Corner", floor: "L1", available: 3, occupied: 7, type: "ev" }
  ]
};

export const db = {
  getUserByEmail(email: string) {
    return Array.from(users.values()).find((u) => u.email === email);
  },
  getUserById(id: string) {
    return users.get(id);
  },
  createUser(input: Omit<User, "id" | "createdAt">) {
    const user: User = { id: randomUUID(), createdAt: new Date(), ...input };
    users.set(user.id, user);
    return user;
  },
  updateUser(id: string, updates: Partial<User>) {
    const existing = users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    users.set(id, updated);
    return updated;
  },
  upsertSession(session: Session) {
    sessions.set(session.id, session);
    return session;
  },
  getAvailability() {
    availability.timestamp = new Date();
    return availability;
  }
};

