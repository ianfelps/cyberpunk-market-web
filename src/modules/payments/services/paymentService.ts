import { apiRequest } from "@/shared/lib/api/client";
import { Payment } from "@/shared/types/domain";

export async function getPayment(orderId: string) {
  return apiRequest<Payment>(`/api/Payment/${orderId}`);
}

export async function completePayment(orderId: string, externalId?: string) {
  return apiRequest<Payment>(
    `/api/Payment/${orderId}/complete`,
    { method: "POST" },
    externalId ? { externalId } : undefined,
  );
}

export async function failPayment(orderId: string, externalId?: string) {
  return apiRequest<Payment>(
    `/api/Payment/${orderId}/fail`,
    { method: "POST" },
    externalId ? { externalId } : undefined,
  );
}
