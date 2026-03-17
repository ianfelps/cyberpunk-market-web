"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { formatCurrency } from "@/shared/lib/utils/format";
import { useCart } from "@/modules/cart/hooks/useCart";
import styles from "./cart.module.css";

export function CartList() {
  const { cart, loading, error, updateQuantity, removeItem, empty } = useCart();

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
              <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>
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
          <Button variant="ghost" size="sm" onClick={empty}>
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
