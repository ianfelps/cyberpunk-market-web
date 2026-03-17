import { apiRequest } from "@/shared/lib/api/client";
import { Cart } from "@/shared/types/domain";

interface AddCartItemPayload {
  productId: string;
  quantity: number;
}

export async function getCart() {
  return apiRequest<Cart>("/api/Cart");
}

export async function addCartItem(payload: AddCartItemPayload) {
  return apiRequest<Cart>("/api/Cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCartItem(itemId: string, quantity: number) {
  return apiRequest<Cart>(`/api/Cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: string) {
  return apiRequest<null>(`/api/Cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return apiRequest<null>("/api/Cart", {
    method: "DELETE",
  });
}
