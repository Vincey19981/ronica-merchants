import { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ALL_ROLES, ROLE_LABELS, type AppRole } from "@/lib/auth";

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  org_id: string | null;
  job_title: string | null;
  mfa_enrolled: boolean;
  created_at: string;
}

interface Org { id: string; name: string }
interface RoleRow { id: string; user_id: string; role: AppRole }

const Users = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, RoleRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [newRole, setNewRole] = useState<Record<string, AppRole>>({});

  const load = async () => {
    setLoading(true);
    const [{ data: ps }, { data: os }, { data: rs }] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,org_id,job_title,mfa_enrolled,created_at").order("created_at", { ascending: false }),
      supabase.from("organizations").select("id,name").order("name"),
      supabase.from("user_roles").select("id,user_id,role"),
    ]);
    setProfiles((ps ?? []) as ProfileRow[]);
    setOrgs((os ?? []) as Org[]);
    const grouped: Record<string, RoleRow[]> = {};
    for (const r of (rs ?? []) as RoleRow[]) {
      grouped[r.user_id] = [...(grouped[r.user_id] ?? []), r];
    }
    setRolesByUser(grouped);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return profiles;
    return profiles.filter((p) =>
      (p.email ?? "").toLowerCase().includes(q) || (p.full_name ?? "").toLowerCase().includes(q),
    );
  }, [profiles, query]);

  const updateOrg = async (userId: string, orgId: string | null) => {
    const { error } = await supabase.from("profiles").update({ org_id: orgId }).eq("id", userId);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Organization updated" });
    await load();
  };

  const addRole = async (userId: string) => {
    const role = newRole[userId];
    if (!role) return;
    if ((rolesByUser[userId] ?? []).some((r) => r.role === role)) {
      return toast({ title: "Already assigned", variant: "destructive" });
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setNewRole({ ...newRole, [userId]: undefined as unknown as AppRole });
    await load();
  };

  const removeRole = async (rowId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", rowId);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    await load();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
        <p className="mt-1 text-muted-foreground">Assign organizations and grant roles for portal access.</p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>All users ({profiles.length})</CardTitle>
          <Input
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="w-[260px]">Grant role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const userRoles = rolesByUser[p.id] ?? [];
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-medium">{p.full_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                          {p.mfa_enrolled && <Badge variant="outline" className="mt-1 text-[10px]">2FA</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={p.org_id ?? "none"}
                          onValueChange={(v) => updateOrg(p.id, v === "none" ? null : v)}
                        >
                          <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="No organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">— None —</SelectItem>
                            {orgs.map((o) => (
                              <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No roles</span>}
                          {userRoles.map((r) => (
                            <Badge key={r.id} variant="secondary" className="gap-1">
                              {ROLE_LABELS[r.role]}
                              <button
                                onClick={() => removeRole(r.id)}
                                className="ml-1 rounded hover:bg-background"
                                aria-label={`Remove ${r.role}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select
                            value={newRole[p.id]}
                            onValueChange={(v) => setNewRole({ ...newRole, [p.id]: v as AppRole })}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_ROLES.map((r) => (
                                <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="navy" onClick={() => addRole(p.id)} disabled={!newRole[p.id]}>
                            Add
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;