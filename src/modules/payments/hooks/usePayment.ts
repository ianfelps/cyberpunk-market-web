"use client";

import { useCallback, useEffect, useState } from "react";
import {
  completePayment,
  failPayment,
  getPayment,
} from "@/modules/payments/services/paymentService";
import { Payment } from "@/shared/types/domain";

export function usePayment(orderId: string) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPayment(orderId);
      setPayment(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pagamento.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const complete = useCallback(async () => {
    setActing(true);
    setError(null);
    try {
      const response = await completePayment(orderId);
      setPayment(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao confirmar pagamento.");
    } finally {
      setActing(false);
    }
  }, [orderId]);

  const fail = useCallback(async () => {
    setActing(true);
    setError(null);
    try {
      const response = await failPayment(orderId);
      setPayment(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao marcar pagamento como falho.");
    } finally {
      setActing(false);
    }
  }, [orderId]);

  return { payment, loading, acting, error, complete, fail, reload: load };
}
