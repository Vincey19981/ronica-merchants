import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Organizations = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    <header>
      <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
      <p className="mt-1 text-muted-foreground">Organization management is now owned by the Express/Mongo user model.</p>
    </header>
    <Card>
      <CardHeader>
        <CardTitle>Production setup required</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Add organization administration endpoints before enabling multi-tenant management in production. User registration currently captures an organization name and assigns the first account as admin.
      </CardContent>
    </Card>
  </div>
);

export default Organizations;
