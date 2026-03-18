"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency } from "@/shared/lib/utils/format";
import { CartItem } from "@/shared/types/domain";
import { useCart } from "@/modules/cart/hooks/useCart";
import styles from "./cart.module.css";

export function CartList() {
  const { cart, loading, error, updateQuantity, removeItem, empty } = useCart();
  const [deletingItem, setDeletingItem] = useState<CartItem | null>(null);
  const [clearing, setClearing] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const handleAskDelete = useCallback((item: CartItem) => {
    setDeletingItem(item);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (clearing) return;
    setDeletingItem(null);
  }, [clearing]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingItem) return;
    setClearing(true);
    try {
      await removeItem(deletingItem.id);
      setDeletingItem(null);
    } finally {
      setClearing(false);
    }
  }, [deletingItem, removeItem]);

  const handleAskEmpty = useCallback(() => {
    setConfirmEmpty(true);
  }, []);

  const handleCloseEmpty = useCallback(() => {
    if (clearing) return;
    setConfirmEmpty(false);
  }, [clearing]);

  const handleConfirmEmpty = useCallback(async () => {
    setClearing(true);
    try {
      await empty();
      setConfirmEmpty(false);
    } finally {
      setClearing(false);
    }
  }, [empty]);

  if (loading) return <p className="loading-text">Carregando carrinho...</p>;
  if (error) return <p className="inline-error">{error}</p>;

  if (!cart || !cart.items.length) {
    return (
      <Panel title="Carrinho vazio" subtitle="Adicione produtos para montar seu pedido.">
        <Link href="/products">
          <Button variant="secondary">
            <ShoppingCart size={15} />
            Explorar produtos
          </Button>
        </Link>
      </Panel>
    );
  }

  return (
    <Panel title="Seu carrinho">
      <ConfirmDialog
        open={deletingItem !== null}
        title="Remover item"
        description={
          deletingItem
            ? `Tem certeza que deseja remover "${deletingItem.productName}" do carrinho?`
            : "Tem certeza que deseja remover este item do carrinho?"
        }
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        loading={clearing}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />
      <ConfirmDialog
        open={confirmEmpty}
        title="Esvaziar carrinho"
        description="Tem certeza que deseja remover todos os itens do carrinho?"
        confirmText="Esvaziar"
        cancelText="Cancelar"
        variant="danger"
        loading={clearing}
        onConfirm={handleConfirmEmpty}
        onClose={handleCloseEmpty}
      />
      <div className={styles.list}>
        {cart.items.map((item) => (
          <article key={item.id} className={styles.row}>
            <div>
              <h3>{item.productName}</h3>
              <p>{formatCurrency(item.unitPrice)} por unidade</p>
            </div>
            <div className={styles.actions}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
              >
                <Minus size={13} />
              </Button>
              <span className={styles.qty}>{item.quantity}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={13} />
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleAskDelete(item)}>
                <Trash2 size={13} />
              </Button>
            </div>
            <strong>{formatCurrency(item.subtotal)}</strong>
          </article>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.total}>Total: {formatCurrency(cart.totalAmount)}</span>
        <div className={styles.footerActions}>
          <Button variant="ghost" size="sm" onClick={handleAskEmpty}>
            <Trash2 size={13} />
            Esvaziar
          </Button>
          <Link href="/checkout">
            <Button>
              Finalizar pedido
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </Panel>
  );
}
