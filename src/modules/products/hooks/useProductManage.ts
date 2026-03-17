"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createProduct,
  CreateProductPayload,
  deleteProduct,
  getProducts,
  ProductFilters,
  updateProduct,
  UpdateProductPayload,
} from "@/modules/products/services/productService";
import { Product } from "@/shared/types/domain";

export function useProductManage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, pageSize: 10 });
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(filters);
      setItems(response.data.items);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload: CreateProductPayload) => {
      await createProduct(payload);
      await load();
    },
    [load],
  );

  const update = useCallback(
    async (id: string, payload: UpdateProductPayload) => {
      await updateProduct(id, payload);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteProduct(id);
      await load();
    },
    [load],
  );

  return { items, filters, loading, error, totalPages, setFilters, create, update, remove };
}
