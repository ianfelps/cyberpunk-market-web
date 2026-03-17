import { apiRequest } from "@/shared/lib/api/client";
import { WishlistItem } from "@/shared/types/domain";

interface AddWishlistPayload {
  productId: string;
  notifyOnPriceDrop: boolean;
}

interface UpdateWishlistPayload {
  notifyOnPriceDrop?: boolean;
}

export async function getWishlist() {
  return apiRequest<WishlistItem[]>("/api/Wishlist");
}

export async function addWishlistItem(payload: AddWishlistPayload) {
  return apiRequest<WishlistItem>("/api/Wishlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateWishlistItem(id: string, payload: UpdateWishlistPayload) {
  return apiRequest<WishlistItem>(`/api/Wishlist/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteWishlistItem(id: string) {
  return apiRequest<null>(`/api/Wishlist/${id}`, {
    method: "DELETE",
  });
}
