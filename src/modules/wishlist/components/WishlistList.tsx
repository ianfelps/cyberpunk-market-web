"use client";

import Link from "next/link";
import { ExternalLink, Heart, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency } from "@/shared/lib/utils/format";
import { useWishlist } from "@/modules/wishlist/hooks/useWishlist";
import styles from "./wishlist.module.css";

export function WishlistList() {
  const { items, loading, error, remove } = useWishlist();

  if (loading) return <p className="loading-text">Carregando wishlist...</p>;
  if (error) return <p className="inline-error">{error}</p>;

  return (
    <Panel title="Wishlist" subtitle="Produtos que você deseja acompanhar.">
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
              <Button variant="danger" size="sm" onClick={() => remove(item.id)}>
                <Trash2 size={13} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
