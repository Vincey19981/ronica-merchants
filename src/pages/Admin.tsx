import { useEffect, useState } from "react";
import { Loader2, LogOut, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface Enquiry {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  enquiry_type: string;
  products_needed: string;
  source: string | null;
  attachment_path: string | null;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) checkRole(s.user.id);
      else { setIsAdmin(null); setEnquiries([]); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) checkRole(data.session.user.id);
      setLoadingAuth(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkRole = async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    const admin = !!data;
    setIsAdmin(admin);
    if (admin) loadEnquiries();
  };

  const loadEnquiries = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setEnquiries((data ?? []) as Enquiry[]);
    setLoadingData(false);
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setSubmitting(false);
    if (error) toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
  };

  const onLogout = async () => { await supabase.auth.signOut(); };

  const downloadAttachment = async (path: string) => {
    const { data, error } = await supabase.storage.from("boq-uploads").createSignedUrl(path, 60);
    if (error || !data) {
      toast({ title: "Download failed", description: error?.message, variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  if (loadingAuth) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <form onSubmit={onLogin} className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
          <h1 className="text-2xl font-bold text-primary">Admin Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enquiries dashboard for Ronica Merchants staff.</p>
          <div className="mt-6 space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
          </div>
          <Button type="submit" variant="navy" className="mt-6 w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            To create an admin: sign up via Lovable Cloud → Users, then add a row to <code className="rounded bg-muted px-1">user_roles</code> with role = <code className="rounded bg-muted px-1">admin</code>.
          </p>
        </form>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
        <h1 className="text-2xl font-bold text-primary">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Your account does not have admin access.</p>
        <Button onClick={onLogout} variant="outline" className="mt-6"><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-wide flex items-center justify-between py-4">
          <h1 className="text-xl font-bold">Enquiries Dashboard</h1>
          <Button onClick={onLogout} variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:bg-white hover:text-primary">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <div className="container-wide py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{enquiries.length} enquiries</p>
          <Button onClick={loadEnquiries} variant="outline" size="sm">Refresh</Button>
        </div>
        {loadingData ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No enquiries yet.</div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((e) => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary">{e.name} · {e.organization}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 hover:text-accent"><Mail className="h-3.5 w-3.5" />{e.email}</a>
                      <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 hover:text-accent"><Phone className="h-3.5 w-3.5" />{e.phone}</a>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="font-semibold text-accent">{e.enquiry_type}</p>
                    <p className="mt-1">{new Date(e.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-surface p-4 text-sm text-foreground">{e.products_needed}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  {e.source && <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">Source: {e.source}</span>}
                  {e.attachment_path && (
                    <Button onClick={() => downloadAttachment(e.attachment_path!)} variant="goldOutline" size="sm">
                      Download attachment
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;