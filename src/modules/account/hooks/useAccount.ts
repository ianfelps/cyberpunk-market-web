"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { getAddresses, getUserById, updateUser } from "@/modules/account/services/accountService";
import { useAuth } from "@/shared/hooks/useAuth";
import { Address, User } from "@/shared/types/domain";

export function useAccount() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const load = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const [profileRes, addressesRes] = await Promise.all([
        getUserById(user.id),
        getAddresses(),
      ]);
      setProfile(profileRes.data);
      setName(profileRes.data.name);
      setEmail(profileRes.data.email);
      setAddresses(addressesRes.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar conta.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!profile?.id) return;
    setSaving(true);
    setError(null);

    try {
      const response = await updateUser(profile.id, { name, email });
      setProfile(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    addresses,
    loading,
    saving,
    error,
    name,
    email,
    setName,
    setEmail,
    save,
  };
}
