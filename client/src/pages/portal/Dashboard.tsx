import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth, ROLE_LABELS } from "@/lib/auth";

const Dashboard = () => {
  const { profile, roles, isAdmin } = useAuth();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your role-aware workspace for tenders, orders, invoices, and support.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Account</CardDescription>
            <CardTitle className="text-lg">{profile?.email}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {(isAdmin ? ["admin", ...roles.filter((r) => r !== "admin")] : roles).map((r) => (
                <Badge key={r} variant="secondary">
                  {ROLE_LABELS[r]}
                </Badge>
              ))}
              {roles.length === 0 && !isAdmin && (
                <Badge variant="outline">Pending role assignment</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Organization</CardDescription>
            <CardTitle className="text-lg">{profile?.org_id ? "Linked" : "Not assigned"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile?.org_id
                ? "Your account is linked to an organization. Contract pricing is active."
                : "An administrator will link your account to your organization."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Security</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              {profile?.mfa_enrolled ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> 2FA on
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 text-amber-600" /> 2FA off
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="outline">
              <Link to="/portal/profile">
                Manage security <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon in your portal</CardTitle>
          <CardDescription>
            Phase 1 ships the secure shell. Catalog, tenders, orders, invoices, and tickets land in the next phases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li>• Browse a contract-priced catalog</li>
            <li>• Create and submit tenders with documents</li>
            <li>• Place and track orders end-to-end</li>
            <li>• View invoices and pay online</li>
            <li>• Raise IT support tickets with SLA tracking</li>
            <li>• Access your compliance document library</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;