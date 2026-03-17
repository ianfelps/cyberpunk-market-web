"use client";

import { useCallback, useState } from "react";
import { MapPin, Pencil, Plus, Trash2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Panel } from "@/shared/components/ui/Panel";
import { useAccount } from "@/modules/account/hooks/useAccount";
import { useAddresses } from "@/modules/account/hooks/useAddresses";
import { Address } from "@/shared/types/domain";
import { CreateAddressPayload } from "@/modules/account/services/accountService";
import styles from "./account.module.css";

const EMPTY_FORM: CreateAddressPayload = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  isDefault: false,
};

export function ProfilePanel() {
  const { loading, saving, error, name, email, setName, setEmail, save } = useAccount();
  const { addresses, loading: loadingAddresses, create, update, remove } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<CreateAddressPayload>(EMPTY_FORM);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const handleEditAddress = useCallback((address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street,
      number: address.number,
      complement: address.complement ?? "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  }, []);

  const handleNewAddress = useCallback(() => {
    setEditingAddress(null);
    setAddressForm(EMPTY_FORM);
    setShowAddressForm(true);
  }, []);

  const handleCancelAddress = useCallback(() => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressError(null);
  }, []);

  const handleSaveAddress = useCallback(async () => {
    setSavingAddress(true);
    setAddressError(null);
    try {
      if (editingAddress) {
        await update(editingAddress.id, addressForm);
      } else {
        await create(addressForm);
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : "Erro ao salvar endereço.");
    } finally {
      setSavingAddress(false);
    }
  }, [editingAddress, addressForm, create, update]);

  const updateForm = useCallback(
    (field: keyof CreateAddressPayload, value: string | boolean) => {
      setAddressForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  if (loading) return <p className="loading-text">Carregando conta...</p>;

  return (
    <div className={styles.layout}>
      <Panel title="Perfil" subtitle="Atualize seus dados principais.">
        <form className={styles.form} onSubmit={save}>
          <div className={styles.sectionIcon}>
            <User size={14} />
            <span>Informações pessoais</span>
          </div>
          <Input
            label="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {error ? <p className="inline-error">{error}</p> : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar perfil"}
          </Button>
        </form>
      </Panel>

      <Panel title="Endereços" subtitle="Seus endereços cadastrados.">
        <div className={styles.formHeader}>
          <div className={styles.sectionIcon}>
            <MapPin size={14} />
            <span>{addresses.length} endereço{addresses.length !== 1 ? "s" : ""}</span>
          </div>
          {!showAddressForm ? (
            <Button size="sm" onClick={handleNewAddress}>
              <Plus size={13} />
              Novo endereço
            </Button>
          ) : null}
        </div>

        {showAddressForm ? (
          <div className={styles.form}>
            <div className={styles.formRow}>
              <Input
                label="Rua *"
                value={addressForm.street}
                onChange={(e) => updateForm("street", e.target.value)}
                required
              />
              <Input
                label="Número *"
                value={addressForm.number}
                onChange={(e) => updateForm("number", e.target.value)}
                required
              />
            </div>
            <Input
              label="Complemento"
              value={addressForm.complement ?? ""}
              onChange={(e) => updateForm("complement", e.target.value)}
            />
            <Input
              label="Bairro *"
              value={addressForm.neighborhood}
              onChange={(e) => updateForm("neighborhood", e.target.value)}
              required
            />
            <div className={styles.formRow}>
              <Input
                label="Cidade *"
                value={addressForm.city}
                onChange={(e) => updateForm("city", e.target.value)}
                required
              />
              <Input
                label="Estado *"
                value={addressForm.state}
                onChange={(e) => updateForm("state", e.target.value)}
                required
              />
              <Input
                label="CEP *"
                value={addressForm.zipCode}
                onChange={(e) => updateForm("zipCode", e.target.value)}
                required
              />
            </div>
            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => updateForm("isDefault", e.target.checked)}
              />
              Endereço padrão
            </label>
            {addressError ? <p className="inline-error">{addressError}</p> : null}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <Button onClick={handleSaveAddress} disabled={savingAddress}>
                {savingAddress ? "Salvando..." : editingAddress ? "Atualizar" : "Adicionar"}
              </Button>
              <Button variant="ghost" onClick={handleCancelAddress} disabled={savingAddress}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : null}

        {loadingAddresses ? <p className="loading-text">Carregando endereços...</p> : null}

        {!loadingAddresses && !addresses.length && !showAddressForm ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Nenhum endereço cadastrado.
          </p>
        ) : null}

        <div className={styles.addressList}>
          {addresses.map((address) => (
            <article key={address.id} className={styles.addressCard}>
              <div className={styles.addressInfo}>
                <h3>
                  {address.street}, {address.number}
                  {address.complement ? `, ${address.complement}` : ""}
                </h3>
                <p>
                  {address.neighborhood} — {address.city}/{address.state}
                </p>
                <small>CEP: {address.zipCode}</small>
                {address.isDefault ? <div className={styles.defaultBadge}>Padrão</div> : null}
              </div>
              <div className={styles.addressActions}>
                <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                  <Pencil size={12} />
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => remove(address.id)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
