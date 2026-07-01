import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/auth";

const Users = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    <header>
      <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
      <p className="mt-1 text-muted-foreground">Role-based access is enforced by JWT middleware in the MERN API.</p>
    </header>
    <Card>
      <CardHeader>
        <CardTitle>Available roles</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {ALL_ROLES.map((role) => (
          <span key={role} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {ROLE_LABELS[role]}
          </span>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default Users;
