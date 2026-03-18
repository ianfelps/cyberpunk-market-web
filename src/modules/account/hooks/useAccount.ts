"use client";

import { useCallback, useEffect, useState } from "react";
import { getAddresses, getUserById, updateUser } from "@/modules/account/services/accountService";
import { useAuth } from "@/shared/hooks/useAuth";
import { Address, User } from "@/shared/types/domain";

export function useAccount() {
  const { user, token, login } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const saveProfile = useCallback(async () => {
    if (!profile?.id) return false;
    setSavingProfile(true);
    setError(null);

    try {
      const response = await updateUser(profile.id, { name, email });
      setProfile(response.data);
      if (token) {
        login(token, response.data);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar perfil.");
      return false;
    } finally {
      setSavingProfile(false);
    }
  }, [profile?.id, name, email, token, login]);

  const changePassword = useCallback(
    async (nextPassword: string) => {
      if (!profile?.id) return false;
      setChangingPassword(true);
      setPasswordError(null);
      try {
        await updateUser(profile.id, { password: nextPassword });
        return true;
      } catch (err) {
        setPasswordError(err instanceof Error ? err.message : "Erro ao trocar senha.");
        return false;
      } finally {
        setChangingPassword(false);
      }
    },
    [profile?.id],
  );

  return {
    profile,
    addresses,
    loading,
    savingProfile,
    error,
    name,
    email,
    setName,
    setEmail,
    saveProfile,
    changePassword,
    changingPassword,
    passwordError,
  };
}
