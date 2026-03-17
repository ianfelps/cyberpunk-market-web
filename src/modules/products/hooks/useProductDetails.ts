"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/modules/products/services/productService";
import { Product } from "@/shared/types/domain";

export function useProductDetails(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar produto.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [id]);

  return { product, loading, error };
}
