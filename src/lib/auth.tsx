"use client";

/**
 * Mock authentication for the admin frontend.
 *
 * There is no backend yet, so this simply gates the /admin shell behind a
 * hardcoded demo credential and remembers the "session" in localStorage.
 * Replace `login()` with a real API call (and the stored flag with an
 * httpOnly session/JWT check) once the backend is wired up.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const SESSION_KEY = "kc-admin-session";

export const DEMO_EMAIL = "admin@kalpataru.co.in";
export const DEMO_PASSWORD = "buildwhatlasts";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminName: string;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const flag = typeof window !== "undefined" && window.localStorage.getItem(SESSION_KEY);
    setIsAuthenticated(flag === "true");
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      window.localStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, error: "That email and password don't match our records." };
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, adminName: "Meera Iyer", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
