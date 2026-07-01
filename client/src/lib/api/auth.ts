import { apiRequest } from "./client";
import type { AppRole, Profile } from "@/lib/auth";

export interface AuthUser extends Profile {
  roles: AppRole[];
}

export const authApi = {
  login: (input: { email: string; password: string }) =>
    apiRequest<{ user: AuthUser; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  register: (input: {
    email: string;
    password: string;
    full_name: string;
    organization_name?: string;
    phone?: string;
    job_title?: string;
  }) =>
    apiRequest<{ user: AuthUser; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  me: () => apiRequest<{ user: AuthUser }>("/api/auth/me"),
  logout: () => apiRequest<{ message: string }>("/api/auth/logout", { method: "POST" }),
};
