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

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// decode JWT without verifying signature — just to read expiry
const decodeTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ?? null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const exp = decodeTokenExpiry(token);
  if (!exp) return true;
  // consider expired 30s before actual expiry to avoid edge cases
  return Date.now() / 1000 >= exp - 30;
};

const isRefreshTokenExpired = (): boolean => {
  const token = authStorage.getRefreshToken();
  if (!token) return true;
  return isTokenExpired(token);
};

const tryRefreshToken = (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) return refreshPromise;

  // if refresh token itself is expired, no point trying
  if (isRefreshTokenExpired()) {
    handleUnauthorized();
    return Promise.resolve(false);
  }

  isRefreshing = true;
  const refreshToken = authStorage.getRefreshToken()!;

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.accessToken) {
        authStorage.setAccessToken(data.accessToken);
        if (data?.refreshToken) authStorage.setRefreshToken(data.refreshToken);
        return true;
      }
      return false;
    })
    .catch(() => false)
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

const handleUnauthorized = () => {
  authStorage.clear();
  window.location.href = "/login";
  throw new ApiError("Session expired", 401);
};

// proactively refresh access token before request if it's expired/expiring
const ensureValidToken = async (): Promise<void> => {
  const accessToken = authStorage.getAccessToken();
  if (!accessToken) return;
  if (!isTokenExpired(accessToken)) return;
  // access token expired — check refresh token
  if (isRefreshTokenExpired()) {
    handleUnauthorized();
  }
  const refreshed = await tryRefreshToken();
  if (!refreshed) handleUnauthorized();
};

const getAuthHeaders = (hasBody: boolean): Record<string, string> => ({
  ...(hasBody ? { "Content-Type": "application/json" } : {}),
  ...(authStorage.getAccessToken()
    ? { Authorization: `Bearer ${authStorage.getAccessToken()}` }
    : {}),
});

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const hasBody = typeof options.body !== "undefined";
  const isAuthCall = path.includes("/auth/login") || path.includes("/auth/register") || path.includes("/auth/refresh");

  if (!isAuthCall) await ensureValidToken();

  const doRequest = () =>
    fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        ...getAuthHeaders(hasBody),
        ...(options.headers || {}),
      },
    });

  let res = await doRequest();

  // fallback: if still 401 after proactive refresh, try once more
  if (res.status === 401 && !isAuthCall) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      res = await doRequest();
    } else {
      handleUnauthorized();
    }
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);

  if (!res.ok) {
    const message = (data as any)?.message || res.statusText || "Request failed";
    throw new ApiError(message, res.status, data);
  }

  return data;
};

export const apiUpload = async <T>(
  path: string,
  formData: FormData,
  method: "PUT" | "POST" = "PUT"
): Promise<T> => {
  await ensureValidToken();

  const doRequest = () =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: authStorage.getAccessToken()
        ? { Authorization: `Bearer ${authStorage.getAccessToken()}` }
        : {},
      body: formData,
    });

  let res = await doRequest();

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      res = await doRequest();
    } else {
      handleUnauthorized();
    }
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);

  if (!res.ok) {
    const message = (data as any)?.message || res.statusText || "Upload failed";
    throw new ApiError(message, res.status, data);
  }

  return data;
};
