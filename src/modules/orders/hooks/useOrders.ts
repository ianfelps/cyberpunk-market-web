"use client";

import { useEffect, useState } from "react";
import { cancelOrder, getOrders } from "@/modules/orders/services/orderService";
import { Order } from "@/shared/types/domain";

export function useOrders() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getOrders(1, 20);
      setItems(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id: string) => {
    await cancelOrder(id);
    await load();
  };

  return { items, loading, error, cancel, reload: load };
}
