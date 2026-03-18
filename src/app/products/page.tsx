"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { ProductFilters } from "@/modules/products/components/ProductFilters";
import { ProductGrid } from "@/modules/products/components/ProductGrid";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { useCategoryOptions } from "@/modules/categories/hooks/useCategoryOptions";
import { useAuth } from "@/shared/hooks/useAuth";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";
import { UserRole } from "@/shared/types/domain";

export default function ProductsPage() {
  const { isAuthenticated } = useProtectedRoute();
  const { filters, items, loading, error, totalPages, setFilters } = useProducts();
  const { items: categories } = useCategoryOptions();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.Seller;

  if (!isAuthenticated) return null;

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Catálogo</h1>
          <p>Listagem paginada com filtros conectados ao backend.</p>
        </div>
        {isSeller ? (
          <Link href="/products/manage">
            <Button size="sm">Meus produtos</Button>
          </Link>
        ) : null}
      </div>

      <Panel>
        <ProductFilters filters={filters} onChange={setFilters} categories={categories} />
      </Panel>

      {loading ? <p className="loading-text">Carregando produtos...</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}
      {!loading && !error ? <ProductGrid products={items} /> : null}

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
