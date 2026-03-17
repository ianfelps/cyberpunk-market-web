"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAddress,
  CreateAddressPayload,
  deleteAddress,
  getAddresses,
  updateAddress,
  UpdateAddressPayload,
} from "@/modules/account/services/accountService";
import { Address } from "@/shared/types/domain";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAddresses();
      setAddresses(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar endereços.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload: CreateAddressPayload) => {
      await createAddress(payload);
      await load();
    },
    [load],
  );

  const update = useCallback(
    async (id: string, payload: UpdateAddressPayload) => {
      await updateAddress(id, payload);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteAddress(id);
      await load();
    },
    [load],
  );

  return { addresses, loading, error, create, update, remove, reload: load };
}
