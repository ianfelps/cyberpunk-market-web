"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Review } from "@/shared/types/domain";
import { CreateReviewPayload, UpdateReviewPayload } from "@/modules/reviews/services/reviewService";
import styles from "./reviews.module.css";

interface Props {
  review?: Review | null;
  onCreate: (payload: Omit<CreateReviewPayload, "productId">) => Promise<void>;
  onUpdate: (id: string, payload: UpdateReviewPayload) => Promise<void>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ review, onCreate, onUpdate, onSuccess, onCancel }: Props) {
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRating(review?.rating ?? 0);
    setComment(review?.comment ?? "");
  }, [review]);

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      setError("Selecione uma nota de 1 a 5.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (review) {
        await onUpdate(review.id, { rating, comment: comment || undefined });
      } else {
        await onCreate({ rating, comment: comment || undefined });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar avaliação.");
    } finally {
      setLoading(false);
    }
  }, [rating, comment, review, onCreate, onUpdate, onSuccess]);

  return (
    <div className={styles.form}>
      <div className={styles.starsInput}>
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          return (
            <button
              key={i}
              type="button"
              className={`${styles.starBtn} ${value <= (hovered || rating) ? styles.filled : ""}`}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(value)}
            >
              ★
            </button>
          );
        })}
      </div>

      <textarea
        placeholder="Comentário (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />

      {error ? <p className="inline-error">{error}</p> : null}

      <div style={{ display: "flex", gap: "0.6rem" }}>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : review ? "Atualizar" : "Publicar"}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
