import { API_BASE_URL, ADMIN_TOKEN_KEY } from "../config/site";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      msg = body.message ?? msg;
    } catch { /* ignore */ }
    throw new ApiError(msg, res.status);
  }
  if (res.status === 204 || res.status === 205) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) throw new ApiError("Not authenticated", 401);
  return apiRequest<T>(path, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
