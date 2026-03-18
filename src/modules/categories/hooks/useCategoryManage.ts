"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCategory,
  CreateCategoryPayload,
  deleteCategory,
  getCategories,
  CategoryFilters,
  updateCategory,
  UpdateCategoryPayload,
} from "@/modules/categories/services/categoryService";
import { Category } from "@/shared/types/domain";

export function useCategoryManage() {
  const [filters, setFilters] = useState<CategoryFilters>({ page: 1, pageSize: 10 });
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories(filters);
      setItems(response.data.items);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload: CreateCategoryPayload) => {
      await createCategory(payload);
      await load();
    },
    [load],
  );

  const update = useCallback(
    async (id: string, payload: UpdateCategoryPayload) => {
      await updateCategory(id, payload);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteCategory(id);
      await load();
    },
    [load],
  );

  return { items, filters, loading, error, totalPages, setFilters, create, update, remove };
}

