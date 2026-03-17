"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerBuyer, registerSeller } from "@/modules/auth/services/authService";

export function useRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [storeName, setStoreName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === "seller") {
        await registerSeller({
          name,
          email,
          password,
          storeName,
          bio,
        });
      } else {
        await registerBuyer({ name, email, password });
      }
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    email,
    password,
    role,
    storeName,
    bio,
    loading,
    error,
    setName,
    setEmail,
    setPassword,
    setRole,
    setStoreName,
    setBio,
    handleSubmit,
  };
}
