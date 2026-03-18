"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Category, Product } from "@/shared/types/domain";
import { useCategoryOptions } from "@/modules/categories/hooks/useCategoryOptions";
import {
  CreateProductPayload,
  UpdateProductPayload,
} from "@/modules/products/services/productService";
import styles from "./products.module.css";

interface Props {
  product?: Product | null;
  onCreate: (payload: CreateProductPayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateProductPayload) => Promise<void>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onCreate, onUpdate, onSuccess, onCancel }: Props) {
  const { items: categories, loading: loadingCategories, error: categoriesError } =
    useCategoryOptions();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setPrice(product?.price?.toString() ?? "");
    setStockQuantity(product?.stockQuantity?.toString() ?? "");
    setCategoryId(product?.categoryId ?? "");
  }, [product]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (product) {
        await onUpdate(product.id, {
          name: name || undefined,
          description: description || undefined,
          price: price ? parseFloat(price) : undefined,
          stockQuantity: stockQuantity ? parseInt(stockQuantity, 10) : undefined,
          categoryId: categoryId || undefined,
        });
      } else {
        if (!name || !price || !stockQuantity || !categoryId) {
          setError("Preencha todos os campos obrigatórios.");
          return;
        }
        await onCreate({
          name,
          description: description || undefined,
          price: parseFloat(price),
          stockQuantity: parseInt(stockQuantity, 10),
          categoryId,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  }, [name, description, price, stockQuantity, categoryId, product, onCreate, onUpdate, onSuccess]);

  return (
    <div className={styles.productForm}>
      <Input label="Nome *" value={name} onChange={(e) => setName(e.target.value)} required />
      <label className={styles.formField}>
        <span>Descrição</span>
        <textarea
          placeholder="Descrição do produto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>
      <div className={styles.formRow}>
        <Input
          label="Preço *"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <Input
          label="Estoque *"
          type="number"
          min="0"
          step="1"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />
      </div>
      <label className={styles.formField}>
        <span>Categoria *</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={loadingCategories}
          required
        >
          <option value="">{loadingCategories ? "Carregando..." : "Selecione uma categoria"}</option>
          {categories.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      {categoriesError ? <p className="inline-error">{categoriesError}</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : product ? "Salvar" : "Criar produto"}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
