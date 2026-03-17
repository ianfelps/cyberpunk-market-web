"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency } from "@/shared/lib/utils/format";
import { Product } from "@/shared/types/domain";
import { useProductManage } from "@/modules/products/hooks/useProductManage";
import { ProductForm } from "@/modules/products/components/ProductForm";
import { ProductFilters } from "@/modules/products/components/ProductFilters";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";
import styles from "@/modules/products/components/products.module.css";

export default function ProductManagePage() {
  const { isAuthenticated } = useProtectedRoute();
  const { items, filters, loading, error, totalPages, setFilters, create, update, remove } =
    useProductManage();
  const [editingProduct, setEditingProduct] = useState<Product | null | "new">(null);

  const handleSuccess = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingProduct(null);
  }, []);

  if (!isAuthenticated) return null;

  const isEditing = editingProduct !== null;

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Meus produtos</h1>
          <p>Crie, edite e exclua produtos do seu catálogo.</p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={13} />
              Catálogo
            </Button>
          </Link>
          {!isEditing ? (
            <Button size="sm" onClick={() => setEditingProduct("new")}>
              <Plus size={13} />
              Novo produto
            </Button>
          ) : null}
        </div>
      </div>

      {editingProduct === "new" ? (
        <ProductForm
          product={null}
          onCreate={create}
          onUpdate={update}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : null}

      {editingProduct && editingProduct !== "new" ? (
        <ProductForm
          product={editingProduct}
          onCreate={create}
          onUpdate={update}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : null}

      <Panel>
        <ProductFilters filters={filters} onChange={setFilters} />
      </Panel>

      {loading ? <p className="loading-text">Carregando produtos...</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}

      {!loading && !items.length ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
          Nenhum produto encontrado.
        </p>
      ) : null}

      <div className={styles.manageList}>
        {items.map((product) => (
          <article key={product.id} className={styles.manageCard}>
            <div className={styles.manageCardHeader}>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <h3 style={{ fontSize: "1rem" }}>{product.name}</h3>
                  <span
                    className={`status-badge ${product.isActive ? "status-active" : "status-inactive"}`}
                  >
                    {product.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {product.description}
                </p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                  <span style={{ color: "var(--accent-2)", fontWeight: 700 }}>
                    {formatCurrency(product.price)}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    Estoque: {product.stockQuantity}
                  </span>
                </div>
              </div>
              <div className={styles.manageCardActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingProduct(product)}
                  disabled={isEditing}
                >
                  <Pencil size={12} />
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => remove(product.id)}
                  disabled={isEditing}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <Button
            variant="secondary"
            size="sm"
            disabled={(filters.page ?? 1) <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
          >
            ← Anterior
          </Button>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {filters.page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={(filters.page ?? 1) >= totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
          >
            Próxima →
          </Button>
        </div>
      ) : null}
    </div>
  );
}
