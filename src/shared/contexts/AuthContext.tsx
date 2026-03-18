"use client";

import { createContext, ReactNode, useMemo, useState } from "react";
import { User } from "@/shared/types/domain";
import {
  getStoredToken,
  getStoredUser,
  removeStoredToken,
  removeStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/shared/lib/storage/authStorage";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

function parseJwtRoles(token: string | null) {
  if (!token) return [] as string[];
  const parts = token.split(".");
  if (parts.length < 2) return [] as string[];

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      Array.from(atob(padded))
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    const payload = JSON.parse(json) as Record<string, unknown>;
    const roleKey =
      "role" in payload
        ? "role"
        : "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" in payload
          ? "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          : null;
    if (!roleKey) return [] as string[];
    const raw = payload[roleKey];
    if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
    if (typeof raw === "string") return [raw];
    return [] as string[];
  } catch {
    return [] as string[];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getStoredUser<User>());

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isAdmin: parseJwtRoles(token).includes("Admin"),
      login: (nextToken, nextUser) => {
        setStoredToken(nextToken);
        setStoredUser(nextUser);
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        removeStoredToken();
        removeStoredUser();
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
