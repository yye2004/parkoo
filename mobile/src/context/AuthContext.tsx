import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../api/client";
import { User } from "../types";

type AuthContextValue = {
  user?: User;
  accessToken?: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
        "/auth/login",
        { email, password }
      );
      setUser(res.user);
      setAccessToken(res.accessToken);
    } finally {
      setLoading(false);
    }
  };

  const register = async (params: { email: string; password: string; name: string; phone?: string }) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
        "/auth/register",
        params
      );
      setUser(res.user);
      setAccessToken(res.accessToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(undefined);
    setAccessToken(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

