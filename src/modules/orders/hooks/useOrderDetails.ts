"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/modules/orders/services/orderService";
import { Order } from "@/shared/types/domain";

export function useOrderDetails(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar pedido.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [id]);

  return { order, loading, error };
}
