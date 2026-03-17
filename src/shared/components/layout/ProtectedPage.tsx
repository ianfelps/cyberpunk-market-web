"use client";

import { ReactNode } from "react";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

export function ProtectedPage({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useProtectedRoute();

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
