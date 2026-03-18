import { apiRequest } from "@/shared/lib/api/client";
import { PagedResponse, QueryParams } from "@/shared/types/api";
import { Address, User } from "@/shared/types/domain";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateAddressPayload {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export async function getUserById(id: string) {
  return apiRequest<User>(`/api/User/${id}`);
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  return apiRequest<User>(`/api/User/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAddresses(page = 1, pageSize = 50) {
  return apiRequest<PagedResponse<Address>>("/api/Address", undefined, {
    page,
    pageSize,
  } as QueryParams);
}

export async function getAddressById(id: string) {
  return apiRequest<Address>(`/api/Address/${id}`);
}

export async function createAddress(payload: CreateAddressPayload) {
  return apiRequest<Address>("/api/Address", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(id: string, payload: UpdateAddressPayload) {
  return apiRequest<Address>(`/api/Address/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string) {
  return apiRequest<null>(`/api/Address/${id}`, {
    method: "DELETE",
  });
}
