"use client";

import { useEffect, useState } from "react";
import { deleteWishlistItem, getWishlist } from "@/modules/wishlist/services/wishlistService";
import { WishlistItem } from "@/shared/types/domain";

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWishlist();
      setItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    await deleteWishlistItem(id);
    await load();
  };

  return { items, loading, error, remove, reload: load };
}
