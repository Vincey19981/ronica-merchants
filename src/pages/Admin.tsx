import { Link } from "react-router-dom";
import { ClipboardList, FileCheck2, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

const Admin = () => {
  const { isAdmin, session } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ronica operations</h1>
            <p className="mt-1 text-muted-foreground">MERN administration workspace for tenders, compliance, and access control.</p>
          </div>
          <Button asChild variant="navy">
            <Link to={session ? "/portal" : "/auth/login"}>{session ? "Open portal" : "Sign in"}</Link>
          </Button>
        </header>

        {!isAdmin && session && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Your account is signed in but does not have the administrator role.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <AdminCard icon={ClipboardList} title="Tender management" to="/portal/tenders" />
          <AdminCard icon={FileCheck2} title="Compliance documents" to="/portal/documents" />
          <AdminCard icon={Users} title="Users and roles" to="/admin/users" />
          <AdminCard icon={ShieldCheck} title="Organizations" to="/admin/organizations" />
        </div>
      </div>
    </div>
  );
};

const AdminCard = ({ icon: Icon, title, to }: { icon: typeof ClipboardList; title: string; to: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Button asChild variant="outline" size="sm">
        <Link to={to}>Open</Link>
      </Button>
    </CardContent>
  </Card>
);

export default Admin;
