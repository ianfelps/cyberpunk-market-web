"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Modal } from "@/shared/components/ui/Modal";
import { Panel } from "@/shared/components/ui/Panel";
import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";
import { useAuth } from "@/shared/hooks/useAuth";
import { Category } from "@/shared/types/domain";
import { useCategoryManage } from "@/modules/categories/hooks/useCategoryManage";
import { CategoryForm } from "@/modules/categories/components/CategoryForm";
import styles from "@/modules/categories/components/categories.module.css";

export default function CategoryManagePage() {
  const { isAuthenticated } = useProtectedRoute();
  const { isAdmin } = useAuth();
  const { items, filters, loading, error, totalPages, setFilters, create, update, remove } =
    useCategoryManage();

  const [editing, setEditing] = useState<Category | null | "new">(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [processingDelete, setProcessingDelete] = useState(false);

  const handleOpenNew = useCallback(() => {
    setEditing("new");
  }, []);

  const handleOpenEdit = useCallback((category: Category) => {
    setEditing(category);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setEditing(null);
  }, []);

  const handleAskDelete = useCallback((category: Category) => {
    setDeleting(category);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (processingDelete) return;
    setDeleting(null);
  }, [processingDelete]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleting) return;
    setProcessingDelete(true);
    try {
      await remove(deleting.id);
      setDeleting(null);
    } finally {
      setProcessingDelete(false);
    }
  }, [deleting, remove]);

  const isEditing = editing !== null;
  const page = filters.page ?? 1;

  const footer = useMemo(() => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
        >
          ← Anterior
        </Button>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
        >
          Próxima →
        </Button>
      </div>
    );
  }, [page, setFilters, totalPages]);

  if (!isAuthenticated) return null;
  if (!isAdmin) return <p className="inline-error">Acesso restrito a administradores.</p>;

  return (
    <div className="grid-auto">
      <div className="page-title">
        <div>
          <h1>Categorias</h1>
          <p>Crie, edite e exclua categorias do marketplace.</p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={13} />
              Catálogo
            </Button>
          </Link>
          {!isEditing ? (
            <Button size="sm" onClick={handleOpenNew}>
              <Plus size={13} />
              Nova categoria
            </Button>
          ) : null}
        </div>
      </div>

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Nova categoria" : "Editar categoria"}
        subtitle="Apenas administradores podem alterar categorias."
        onClose={handleCloseEdit}
      >
        {editing !== null ? (
          <CategoryForm
            category={editing === "new" ? null : editing}
            onCreate={create}
            onUpdate={update}
            onSuccess={handleSuccess}
            onCancel={handleCloseEdit}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir categoria"
        description={
          deleting ? `Tem certeza que deseja excluir "${deleting.name}"?` : "Tem certeza que deseja excluir?"
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        loading={processingDelete}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />

      <Panel>
        <div className={styles.filters}>
          <input
            placeholder="Buscar por nome"
            value={filters.name ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, name: e.target.value }))}
          />
        </div>
      </Panel>

      {loading ? <p className="loading-text">Carregando categorias...</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}

      {!loading && !items.length ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
          Nenhuma categoria encontrada.
        </p>
      ) : null}

      <div className={styles.list}>
        {items.map((category) => (
          <article key={category.id} className={styles.item}>
            <div style={{ display: "grid", gap: "0.25rem" }}>
              <h3 style={{ fontSize: "1rem" }}>{category.name}</h3>
              <span className={styles.meta}>{category.slug}</span>
            </div>
            <div className={styles.actions}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenEdit(category)}
                disabled={isEditing}
              >
                <Pencil size={12} />
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAskDelete(category)}
                disabled={isEditing}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {footer}
    </div>
  );
}

