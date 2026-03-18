"use client";

import { useCallback, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const footer = useMemo(
    () => (
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={handleConfirm} disabled={loading}>
          {loading ? "Processando..." : confirmText}
        </Button>
      </>
    ),
    [cancelText, confirmText, handleConfirm, loading, onClose, variant],
  );

  return (
    <Modal
      open={open}
      title={title}
      subtitle={description}
      size="sm"
      onClose={loading ? () => {} : onClose}
      footer={footer}
    >
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <AlertTriangle size={18} style={{ color: "var(--danger)", marginTop: "0.15rem" }} />
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>
            {description ?? "Tem certeza que deseja continuar?"}
          </p>
        </div>
      </div>
    </Modal>
  );
}

