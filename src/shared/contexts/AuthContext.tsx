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
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(() => getStoredUser<User>());

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
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
