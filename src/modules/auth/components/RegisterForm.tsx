"use client";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Panel } from "@/shared/components/ui/Panel";
import { useRegisterForm } from "@/modules/auth/hooks/useRegisterForm";
import styles from "./auth.module.css";

export function RegisterForm() {
  const {
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
  } = useRegisterForm();

  return (
    <Panel title="Criar conta" subtitle="Cadastre comprador ou vendedor.">
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <label className={styles.field}>
          <span>Tipo de conta</span>
          <select value={role} onChange={(event) => setRole(event.target.value as "buyer" | "seller")}> 
            <option value="buyer">Comprador</option>
            <option value="seller">Vendedor</option>
          </select>
        </label>

        {role === "seller" ? (
          <>
            <Input
              label="Nome da loja"
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              required
            />
            <Input label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} />
          </>
        ) : null}

        {error ? <p className="inline-error">{error}</p> : null}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Panel>
  );
}
