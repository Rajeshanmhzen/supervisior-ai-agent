import { apiRequest } from "./api";

type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic?: string | null;
};

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export const authService = {
  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login: async (payload: { email: string; password: string }) => {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  refresh: async () => {
    return apiRequest<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
    });
  },
  logout: async () => {
    return apiRequest<{ ok: boolean }>("/auth/logout", { method: "POST" });
  },
  forgotPassword: async (payload: { email: string }) => {
    return apiRequest<{ ok: boolean; message?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  verifyCode: async (payload: { email: string; code: string }) => {
    return apiRequest<{ ok: boolean }>("/auth/verify-code", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  resetPassword: async (payload: {
    email: string;
    code: string;
    password: string;
  }) => {
    return apiRequest<{ ok: boolean }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
