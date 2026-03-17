"use client";

import { useEffect, useState } from "react";
import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/modules/cart/services/cartService";
import { Cart } from "@/shared/types/domain";

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar carrinho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateCartItem(itemId, quantity);
    await loadCart();
  };

  const removeItem = async (itemId: string) => {
    await removeCartItem(itemId);
    await loadCart();
  };

  const empty = async () => {
    await clearCart();
    await loadCart();
  };

  return {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    empty,
    reload: loadCart,
  };
}
