"use client";

import { useEffect, useState } from "react";
import { getProducts, ProductFilters } from "@/modules/products/services/productService";
import { Product } from "@/shared/types/domain";

export function useProducts(initialFilters?: ProductFilters) {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 8,
    isActive: true,
    ...initialFilters,
  });
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts(filters);
        setItems(response.data.items);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar produtos.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [filters]);

  return {
    filters,
    items,
    loading,
    error,
    totalPages,
    setFilters,
  };
}
