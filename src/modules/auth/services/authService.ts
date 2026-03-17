import { apiRequest } from "@/shared/lib/api/client";
import { User, UserRole } from "@/shared/types/domain";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterBuyerPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterSellerPayload extends RegisterBuyerPayload {
  storeName: string;
  bio?: string;
}

interface LoginData {
  token: string;
  user: User;
}

export async function login(payload: LoginPayload) {
  return apiRequest<LoginData>("/api/User/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerBuyer(payload: RegisterBuyerPayload) {
  return apiRequest<User>("/api/User/buyer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerSeller(payload: RegisterSellerPayload) {
  return apiRequest<User>("/api/User/seller", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      role: UserRole.Seller,
    }),
  });
}
