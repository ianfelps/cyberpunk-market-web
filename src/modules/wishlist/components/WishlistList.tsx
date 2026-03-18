"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ExternalLink, Heart, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency } from "@/shared/lib/utils/format";
import { WishlistItem } from "@/shared/types/domain";
import { useWishlist } from "@/modules/wishlist/hooks/useWishlist";
import styles from "./wishlist.module.css";

export function WishlistList() {
  const { items, loading, error, remove } = useWishlist();
  const [deletingItem, setDeletingItem] = useState<WishlistItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleAskDelete = useCallback((item: WishlistItem) => {
    setDeletingItem(item);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (deleting) return;
    setDeletingItem(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await remove(deletingItem.id);
      setDeletingItem(null);
    } finally {
      setDeleting(false);
    }
  }, [deletingItem, remove]);

  if (loading) return <p className="loading-text">Carregando wishlist...</p>;
  if (error) return <p className="inline-error">{error}</p>;

  return (
    <Panel title="Wishlist" subtitle="Produtos que você deseja acompanhar.">
      <ConfirmDialog
        open={deletingItem !== null}
        title="Remover da wishlist"
        description={
          deletingItem
            ? `Tem certeza que deseja remover "${deletingItem.productName}" da sua wishlist?`
            : "Tem certeza que deseja remover este item da wishlist?"
        }
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />
      {!items.length ? (
        <p style={{ color: "var(--text-muted)", paddingTop: "0.5rem" }}>
          Nenhum item na wishlist.
        </p>
      ) : null}
      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <h3>
                <Heart size={13} style={{ display: "inline", marginRight: "0.35rem", color: "var(--danger)", verticalAlign: "middle" }} />
                {item.productName}
              </h3>
              <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>
              <p className={styles.notify}>
                {item.notifyOnPriceDrop ? "Notificar queda de preço ativo" : "Sem notificação de preço"}
              </p>
            </div>
            <div className={styles.actions}>
              <Link href={`/products/${item.productId}`} className={styles.viewLink}>
                <ExternalLink size={13} />
                Ver produto
              </Link>
              <Button variant="danger" size="sm" onClick={() => handleAskDelete(item)}>
                <Trash2 size={13} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
