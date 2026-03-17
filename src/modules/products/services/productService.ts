import { apiRequest } from "@/shared/lib/api/client";
import { PagedResponse, QueryParams } from "@/shared/types/api";
import { Product } from "@/shared/types/domain";

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
}

export async function getProducts(filters: ProductFilters) {
  return apiRequest<PagedResponse<Product>>("/api/Product", undefined, filters as QueryParams);
}

export async function getProductById(id: string) {
  return apiRequest<Product>(`/api/Product/${id}`);
}

export async function createProduct(payload: CreateProductPayload) {
  return apiRequest<Product>("/api/Product", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: string, payload: UpdateProductPayload) {
  return apiRequest<Product>(`/api/Product/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string) {
  return apiRequest<null>(`/api/Product/${id}`, {
    method: "DELETE",
  });
}
