import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { AppShell } from "@/shared/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Cyberpunk Market",
  description: "Frontend Next.js para o marketplace cyberpunk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
