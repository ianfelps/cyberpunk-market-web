import { getStoredToken } from "@/shared/lib/storage/authStorage";
import { ApiResponse, QueryParams } from "@/shared/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5249";

function buildUrl(path: string, query?: QueryParams): string {
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const normalized = withSlash.startsWith("/api/") ? withSlash : `/api${withSlash}`;
  const url = new URL(normalized, API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    const fallback = payload.errors?.join(" | ") || payload.message || "Erro inesperado.";
    throw new Error(fallback);
  }

  return payload;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  query?: QueryParams,
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers);

  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers,
  });

  return parseResponse<T>(response);
}
