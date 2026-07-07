"use client";

/**
 * Admin authentication backed by the Express API.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, clearToken, setToken, TOKEN_KEY } from "./api";

const SESSION_KEY = "kc-admin-session";

export const DEMO_EMAIL = "admin@kalpataru.co.in";
export const DEMO_PASSWORD = "buildwhatlasts";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminName: string;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const token = typeof window !== "undefined" && window.localStorage.getItem(TOKEN_KEY);
    const savedName = typeof window !== "undefined" && window.localStorage.getItem(SESSION_KEY);
    setIsAuthenticated(Boolean(token));
    if (savedName) setAdminName(savedName);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiFetch<{ token: string; user: AdminUser }>("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      setToken(data.token);
      window.localStorage.setItem(SESSION_KEY, data.user.name);
      setAdminName(data.user.name);
      setIsAuthenticated(true);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "That email and password don't match our records.",
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setAdminName("Admin");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
