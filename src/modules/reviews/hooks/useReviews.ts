"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createReview,
  CreateReviewPayload,
  deleteReview,
  getReviews,
  updateReview,
  UpdateReviewPayload,
} from "@/modules/reviews/services/reviewService";
import { Review } from "@/shared/types/domain";

export function useReviews(productId: string) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getReviews({ productId, page, pageSize: 10 });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar avaliações.");
    } finally {
      setLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload: Omit<CreateReviewPayload, "productId">) => {
      await createReview({ ...payload, productId });
      await load();
    },
    [productId, load],
  );

  const update = useCallback(
    async (id: string, payload: UpdateReviewPayload) => {
      await updateReview(id, payload);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteReview(id);
      await load();
    },
    [load],
  );

  return { items, loading, error, totalPages, page, setPage, create, update, remove, reload: load };
}
