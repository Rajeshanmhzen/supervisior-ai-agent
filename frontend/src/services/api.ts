import { authStorage } from "./authStorage";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const hasBody = typeof options.body !== "undefined";
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(authStorage.getAccessToken()
        ? { Authorization: `Bearer ${authStorage.getAccessToken()}` }
        : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);

  if (!res.ok) {
    const message =
      (data as any)?.message || res.statusText || "Request failed";
    throw new ApiError(message, res.status, data);
  }

  return data;
};
