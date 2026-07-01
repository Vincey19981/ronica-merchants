import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { authApi, type AuthUser } from "@/lib/api/auth";

export type AppRole = "admin" | "procurement_officer" | "finance" | "it_manager" | "compliance" | "executive";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  org_id: string | null;
  organization_name?: string | null;
  phone: string | null;
  job_title: string | null;
  mfa_enrolled: boolean;
}

export interface AppSession {
  user: AuthUser;
}

interface AuthCtx {
  session: AppSession | null;
  user: AuthUser | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  hasRole: (r: AppRole) => boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    full_name: string;
    organization_name?: string;
    phone?: string;
    job_title?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AppSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback((user: AuthUser | null) => {
    setSession(user ? { user } : null);
    setProfile(user);
    setRoles(user?.roles ?? []);
  }, []);

  const refresh = useCallback(async () => {
    const { user } = await authApi.me();
    applyUser(user);
  }, [applyUser]);

  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then(({ user }) => {
        if (active) applyUser(user);
      })
      .catch(() => {
        localStorage.removeItem("ronica_access_token");
        if (active) applyUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applyUser]);

  const value = useMemo<AuthCtx>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      roles,
      loading,
      isAdmin: roles.includes("admin"),
      hasRole: (r) => roles.includes(r),
      refresh,
      signIn: async (email, password) => {
        const { user, token } = await authApi.login({ email, password });
        localStorage.setItem("ronica_access_token", token);
        applyUser(user);
      },
      signOut: async () => {
        await authApi.logout().catch(() => undefined);
        localStorage.removeItem("ronica_access_token");
        applyUser(null);
      },
      register: async (input) => {
        const { user, token } = await authApi.register(input);
        localStorage.setItem("ronica_access_token", token);
        applyUser(user);
      },
    }),
    [session, profile, roles, loading, refresh, applyUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrator",
  procurement_officer: "Procurement Officer",
  finance: "Finance",
  it_manager: "IT Manager",
  compliance: "Compliance",
  executive: "Executive",
};

export const ALL_ROLES: AppRole[] = [
  "admin",
  "procurement_officer",
  "finance",
  "it_manager",
  "compliance",
  "executive",
];
