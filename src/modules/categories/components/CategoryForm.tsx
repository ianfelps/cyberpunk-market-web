"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Category } from "@/shared/types/domain";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/modules/categories/services/categoryService";
import styles from "./categories.module.css";

interface Props {
  category?: Category | null;
  onCreate: (payload: CreateCategoryPayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateCategoryPayload) => Promise<void>;
  onSuccess: () => void;
  onCancel: () => void;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function CategoryForm({ category, onCreate, onUpdate, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(category?.name ?? "");
    setSlug(category?.slug ?? "");
  }, [category]);

  const suggestedSlug = useMemo(() => slugify(name), [name]);

  const handleUseSuggestedSlug = useCallback(() => {
    setSlug(suggestedSlug);
  }, [suggestedSlug]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (category) {
        await onUpdate(category.id, {
          name: name || undefined,
          slug: slug || undefined,
        });
      } else {
        if (!name || !slug) {
          setError("Preencha todos os campos obrigatórios.");
          return;
        }
        await onCreate({ name, slug });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar categoria.");
    } finally {
      setLoading(false);
    }
  }, [category, name, slug, onCreate, onUpdate, onSuccess]);

  return (
    <div className={styles.form}>
      <Input label="Nome *" value={name} onChange={(e) => setName(e.target.value)} required />
      <div style={{ display: "grid", gap: "0.35rem" }}>
        <Input label="Slug *" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        {!category && name ? (
          <Button variant="ghost" size="sm" onClick={handleUseSuggestedSlug} disabled={loading}>
            Usar slug sugerido: {suggestedSlug}
          </Button>
        ) : null}
      </div>

      {error ? <p className="inline-error">{error}</p> : null}

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : category ? "Salvar" : "Criar categoria"}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

