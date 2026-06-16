import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth, type AppRole } from "@/lib/auth";

interface Props {
  children: ReactNode;
  roles?: AppRole[];
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { session, loading, hasRole, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={`/auth/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (roles && roles.length > 0) {
    const ok = isAdmin || roles.some((r) => hasRole(r));
    if (!ok) return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};