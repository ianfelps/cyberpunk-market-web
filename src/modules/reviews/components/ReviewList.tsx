"use client";

import { memo, useCallback, useState } from "react";
import { Pencil, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Modal } from "@/shared/components/ui/Modal";
import { Panel } from "@/shared/components/ui/Panel";
import { useAuth } from "@/shared/hooks/useAuth";
import { formatDate } from "@/shared/lib/utils/format";
import { Review } from "@/shared/types/domain";
import { useReviews } from "@/modules/reviews/hooks/useReviews";
import { ReviewForm } from "./ReviewForm";
import styles from "./reviews.module.css";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onDelete: (id: string) => void;
  onEdit: (review: Review) => void;
}

const ReviewCard = memo(function ReviewCard({
  review,
  currentUserId,
  onDelete,
  onEdit,
}: ReviewCardProps) {
  const isOwner = review.userId === currentUserId;

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
          ))}
        </div>
        <span className={styles.meta}>{formatDate(review.createdAt)}</span>
      </div>
      {review.comment ? <p className={styles.comment}>{review.comment}</p> : null}
      {isOwner ? (
        <div className={styles.cardActions}>
          <Button variant="ghost" size="sm" onClick={() => onEdit(review)}>
            <Pencil size={12} />
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(review.id)}>
            <Trash2 size={12} />
            Excluir
          </Button>
        </div>
      ) : null}
    </article>
  );
});

interface Props {
  productId: string;
}

export function ReviewList({ productId }: Props) {
  const { user, isAuthenticated } = useAuth();
  const { items, loading, error, page, setPage, totalPages, create, update, remove } =
    useReviews(productId);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(
    async (id: string) => {
      const review = items.find((r) => r.id === id) ?? null;
      setDeletingReview(review);
    },
    [items],
  );

  const handleEdit = useCallback((review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  }, []);

  const handleFormSuccess = useCallback(async () => {
    setShowForm(false);
    setEditingReview(null);
  }, []);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingReview(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (deleting) return;
    setDeletingReview(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingReview) return;
    setDeleting(true);
    try {
      await remove(deletingReview.id);
      setDeletingReview(null);
    } finally {
      setDeleting(false);
    }
  }, [deletingReview, remove]);

  return (
    <Panel title="Avaliações">
      <div className={styles.section}>
        {isAuthenticated && !showForm ? (
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            <PenLine size={14} />
            Escrever avaliação
          </Button>
        ) : null}

        <Modal
          open={showForm}
          title={editingReview ? "Editar avaliação" : "Nova avaliação"}
          subtitle="Avalie com nota de 1 a 5 e deixe um comentário (opcional)."
          onClose={handleFormCancel}
        >
          <ReviewForm
            review={editingReview}
            onCreate={create}
            onUpdate={update}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Modal>

        <ConfirmDialog
          open={deletingReview !== null}
          title="Excluir avaliação"
          description="Tem certeza que deseja excluir sua avaliação?"
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDelete}
        />

        {loading ? <p className="loading-text">Carregando avaliações...</p> : null}
        {error ? <p className="inline-error">{error}</p> : null}

        {!loading && !items.length ? (
          <p className={styles.empty}>Nenhuma avaliação ainda. Seja o primeiro!</p>
        ) : null}

        <div className={styles.list}>
          {items.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={user?.id}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {totalPages > 1 ? (
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
