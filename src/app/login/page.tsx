"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { useAuth } from "@/shared/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/products");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="grid-auto" style={{ maxWidth: 480 }}>
      <div className="page-title">
        <div>
          <h1>Entrar</h1>
          <p>Acesse o Cyberpunk Market com seu email e senha.</p>
        </div>
      </div>
      <LoginForm />
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
        Ainda não tem conta?{" "}
        <Link href="/register" style={{ color: "var(--accent-2)" }}>
          Criar cadastro
        </Link>
      </p>
    </div>
  );
}
