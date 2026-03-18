"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCategories } from "@/modules/categories/services/categoryService";
import { Category } from "@/shared/types/domain";

export function useCategoryOptions() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories({ page: 1, pageSize: 50 });
      setItems(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const options = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  return { items: options, loading, error, reload: load };
}

