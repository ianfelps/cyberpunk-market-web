import { apiRequest } from "@/shared/lib/api/client";
import { PagedResponse } from "@/shared/types/api";
import { Order, OrderStatus, PaymentMethod } from "@/shared/types/domain";

interface CreateOrderPayload {
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
}

export async function getOrders(page = 1, pageSize = 10, status?: OrderStatus) {
  return apiRequest<PagedResponse<Order>>("/api/Order", undefined, {
    page,
    pageSize,
    status,
  });
}

export async function getOrderById(id: string) {
  return apiRequest<Order>(`/api/Order/${id}`);
}

export async function createOrder(payload: CreateOrderPayload) {
  return apiRequest<Order>("/api/Order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelOrder(id: string) {
  return apiRequest<null>(`/api/Order/${id}/cancel`, {
    method: "POST",
  });
}
