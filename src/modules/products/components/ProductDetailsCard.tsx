"use client";

import { useCallback, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/shared/types/domain";
import { formatCurrency } from "@/shared/lib/utils/format";
import { Button } from "@/shared/components/ui/Button";
import { Panel } from "@/shared/components/ui/Panel";
import { addCartItem } from "@/modules/cart/services/cartService";
import { addWishlistItem } from "@/modules/wishlist/services/wishlistService";
import styles from "./products.module.css";

interface Props {
  product: Product;
}

export function ProductDetailsCard({ product }: Props) {
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const [wishFeedback, setWishFeedback] = useState<string | null>(null);

  const handleAddCart = useCallback(async () => {
    try {
      await addCartItem({ productId: product.id, quantity: 1 });
      setCartFeedback("Adicionado ao carrinho!");
      setTimeout(() => setCartFeedback(null), 2500);
    } catch (err) {
      setCartFeedback(err instanceof Error ? err.message : "Erro ao adicionar.");
    }
  }, [product.id]);

  const handleAddWishlist = useCallback(async () => {
    try {
      await addWishlistItem({ productId: product.id, notifyOnPriceDrop: true });
      setWishFeedback("Adicionado à wishlist!");
      setTimeout(() => setWishFeedback(null), 2500);
    } catch (err) {
      setWishFeedback(err instanceof Error ? err.message : "Erro ao adicionar.");
    }
  }, [product.id]);

  return (
    <Panel title={product.name} subtitle={product.description}>
      <div className={styles.detailRows}>
        <div>
          <span>Preço</span>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <div>
          <span>Estoque</span>
          <strong>{product.stockQuantity} unid.</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <div>
          <Button
            onClick={handleAddCart}
            disabled={!product.isActive || product.stockQuantity === 0}
          >
            <ShoppingCart size={15} />
            Adicionar ao carrinho
          </Button>
          {cartFeedback ? (
            <p style={{ color: "var(--ok)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
              {cartFeedback}
            </p>
          ) : null}
        </div>
        <div>
          <Button variant="secondary" onClick={handleAddWishlist}>
            <Heart size={15} />
            Favoritar
          </Button>
          {wishFeedback ? (
            <p style={{ color: "var(--ok)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
              {wishFeedback}
            </p>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
