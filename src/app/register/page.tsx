"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";
import { useAuth } from "@/shared/hooks/useAuth";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/products");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="grid-auto" style={{ maxWidth: 520 }}>
      <div className="page-title">
        <div>
          <h1>Criar conta</h1>
          <p>Cadastre-se como comprador ou vendedor.</p>
        </div>
      </div>
      <RegisterForm />
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
        Já possui conta?{" "}
        <Link href="/login" style={{ color: "var(--accent-2)" }}>
          Fazer login
        </Link>
      </p>
    </div>
  );
}
