import { apiRequest } from "@/shared/lib/api/client";
import { PagedResponse, QueryParams } from "@/shared/types/api";
import { Review } from "@/shared/types/domain";

export interface ReviewFilters {
  productId: string;
  page?: number;
  pageSize?: number;
  minRating?: number;
  maxRating?: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export async function getReviews(filters: ReviewFilters) {
  return apiRequest<PagedResponse<Review>>("/api/Review", undefined, filters as unknown as QueryParams);
}

export async function getReviewById(id: string) {
  return apiRequest<Review>(`/api/Review/${id}`);
}

export async function createReview(payload: CreateReviewPayload) {
  return apiRequest<Review>("/api/Review", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReview(id: string, payload: UpdateReviewPayload) {
  return apiRequest<Review>(`/api/Review/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteReview(id: string) {
  return apiRequest<null>(`/api/Review/${id}`, {
    method: "DELETE",
  });
}
