"use client";

import { useCallback, useState } from "react";
import { KeyRound, MapPin, Pencil, Plus, Trash2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
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
  const {
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
  } = useAccount();
  const { addresses, loading: loadingAddresses, create, update, remove } = useAddresses();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localPasswordError, setLocalPasswordError] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<CreateAddressPayload>(EMPTY_FORM);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenProfile = useCallback(() => {
    setShowProfileModal(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    if (savingProfile) return;
    setShowProfileModal(false);
  }, [savingProfile]);

  const handleSaveProfile = useCallback(async () => {
    const ok = await saveProfile();
    if (ok) setShowProfileModal(false);
  }, [saveProfile]);

  const handleOpenPassword = useCallback(() => {
    setNewPassword("");
    setConfirmPassword("");
    setLocalPasswordError(null);
    setShowPasswordModal(true);
  }, []);

  const handleClosePassword = useCallback(() => {
    if (changingPassword) return;
    setShowPasswordModal(false);
    setLocalPasswordError(null);
  }, [changingPassword]);

  const handleSavePassword = useCallback(async () => {
    if (!newPassword || !confirmPassword) {
      setLocalPasswordError("Preencha os dois campos de senha.");
      return;
    }
    if (newPassword.length < 6) {
      setLocalPasswordError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalPasswordError("As senhas não coincidem.");
      return;
    }
    setLocalPasswordError(null);
    const ok = await changePassword(newPassword);
    if (ok) setShowPasswordModal(false);
  }, [newPassword, confirmPassword, changePassword]);

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

  const handleAskDelete = useCallback((address: Address) => {
    setDeletingAddress(address);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (deleting) return;
    setDeletingAddress(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingAddress) return;
    setDeleting(true);
    try {
      await remove(deletingAddress.id);
      setDeletingAddress(null);
      if (editingAddress?.id === deletingAddress.id) {
        handleCancelAddress();
      }
    } finally {
      setDeleting(false);
    }
  }, [deletingAddress, remove, editingAddress, handleCancelAddress]);

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
        <div className={styles.form}>
          <div className={styles.sectionIcon}>
            <User size={14} />
            <span>Informações pessoais</span>
          </div>
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <strong style={{ fontSize: "1rem" }}>{name}</strong>
            <span style={{ color: "var(--text-muted)" }}>{email}</span>
          </div>
          {error ? <p className="inline-error">{error}</p> : null}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={handleOpenProfile}>
              <Pencil size={13} />
              Editar perfil
            </Button>
            <Button variant="ghost" onClick={handleOpenPassword}>
              <KeyRound size={13} />
              Trocar senha
            </Button>
          </div>
        </div>

        <Modal
          open={showProfileModal}
          title="Editar perfil"
          subtitle="Atualize seu nome e email."
          onClose={handleCloseProfile}
        >
          <div className={styles.form}>
            <Input
              label="Nome *"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Input
              label="Email *"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            {error ? <p className="inline-error">{error}</p> : null}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="ghost" onClick={handleCloseProfile} disabled={savingProfile}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={showPasswordModal}
          title="Trocar senha"
          subtitle="Defina uma nova senha para sua conta."
          onClose={handleClosePassword}
        >
          <div className={styles.form}>
            <Input
              label="Nova senha *"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <Input
              label="Confirmar nova senha *"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {localPasswordError ? <p className="inline-error">{localPasswordError}</p> : null}
            {passwordError ? <p className="inline-error">{passwordError}</p> : null}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <Button onClick={handleSavePassword} disabled={changingPassword}>
                {changingPassword ? "Salvando..." : "Trocar senha"}
              </Button>
              <Button variant="ghost" onClick={handleClosePassword} disabled={changingPassword}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
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

        <Modal
          open={showAddressForm}
          title={editingAddress ? "Editar endereço" : "Novo endereço"}
          subtitle="Crie ou atualize seu endereço de entrega."
          onClose={savingAddress ? () => {} : handleCancelAddress}
        >
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
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <Button onClick={handleSaveAddress} disabled={savingAddress}>
                {savingAddress ? "Salvando..." : editingAddress ? "Atualizar" : "Adicionar"}
              </Button>
              <Button variant="ghost" onClick={handleCancelAddress} disabled={savingAddress}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          open={deletingAddress !== null}
          title="Excluir endereço"
          description={
            deletingAddress
              ? `Tem certeza que deseja excluir "${deletingAddress.street}, ${deletingAddress.number}"?`
              : "Tem certeza que deseja excluir este endereço?"
          }
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDelete}
        />

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
                <Button variant="danger" size="sm" onClick={() => handleAskDelete(address)}>
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
