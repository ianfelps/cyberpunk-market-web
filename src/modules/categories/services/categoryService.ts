import { apiRequest } from "@/shared/lib/api/client";
import { PagedResponse, QueryParams } from "@/shared/types/api";
import { Category } from "@/shared/types/domain";

export interface CategoryFilters {
  page?: number;
  pageSize?: number;
  name?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
}

export async function getCategories(filters?: CategoryFilters) {
  return apiRequest<PagedResponse<Category>>("/api/Category", undefined, filters as QueryParams);
}

export async function getCategoryById(id: string) {
  return apiRequest<Category>(`/api/Category/${id}`);
}

export async function createCategory(payload: CreateCategoryPayload) {
  return apiRequest<Category>("/api/Category", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return apiRequest<Category>(`/api/Category/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string) {
  return apiRequest<null>(`/api/Category/${id}`, {
    method: "DELETE",
  });
}

