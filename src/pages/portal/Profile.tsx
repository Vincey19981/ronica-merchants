import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const Profile = () => {
  const { profile, refresh } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [jobTitle, setJobTitle] = useState(profile?.job_title ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [factors, setFactors] = useState<{ id: string; friendly_name: string | null; status: string }[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(true);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setJobTitle(profile?.job_title ?? "");
  }, [profile]);

  const loadFactors = async () => {
    setLoadingFactors(true);
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors((data?.totp ?? []).map((f) => ({ id: f.id, friendly_name: f.friendly_name, status: f.status })));
    setLoadingFactors(false);
  };

  useEffect(() => {
    void loadFactors();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, job_title: jobTitle })
      .eq("id", profile.id);
    setSavingProfile(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Profile saved" });
    await refresh();
  };

  const removeFactor = async (id: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (error) return toast({ title: "Could not remove factor", description: error.message, variant: "destructive" });
    if (profile) await supabase.from("profiles").update({ mfa_enrolled: false }).eq("id", profile.id);
    await refresh();
    await loadFactors();
    toast({ title: "2FA removed" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Security</h1>
        <p className="mt-1 text-muted-foreground">Update your details and manage two-factor authentication.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>Email is managed by your sign-in provider.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job title</Label>
              <Input id="job" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="navy" disabled={savingProfile}>
                {savingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {profile?.mfa_enrolled ? (
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            )}
            Two-factor authentication
          </CardTitle>
          <CardDescription>Add a TOTP authenticator for stronger account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingFactors ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : factors.filter((f) => f.status === "verified").length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No authenticator enrolled yet.</p>
              <Button asChild variant="navy">
                <Link to="/auth/mfa-enroll">Enable 2FA</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {factors
                .filter((f) => f.status === "verified")
                .map((f) => (
                  <li key={f.id} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                    <span className="text-sm">{f.friendly_name || "Authenticator app"}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeFactor(f.id)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;