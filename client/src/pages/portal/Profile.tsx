import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const Profile = () => {
  const { profile, roles } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Security</h1>
        <p className="mt-1 text-muted-foreground">Review your account details and portal access.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>Account updates are managed by an administrator in this MERN migration.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={profile?.full_name ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Job title</Label>
            <Input value={profile?.job_title ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={profile?.phone ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input value={profile?.organization_name ?? profile?.org_id ?? ""} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Access control
          </CardTitle>
          <CardDescription>JWT authentication and role checks are enforced by the Express API.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span key={role} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {role.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
