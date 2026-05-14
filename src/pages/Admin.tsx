import { useEffect, useMemo, useState } from "react";
import {
  Inbox, Loader2, LogOut, Mail, Package, Phone, FileText, TrendingUp,
  ClipboardList, Building2, Download as DownloadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar, type AdminSection } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { PRODUCTS } from "@/data/products";

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

type QuoteStatus = "new" | "in_review" | "quoted" | "closed";

interface QuoteItem {
  id: string;
  product_name: string;
  quantity: number;
  uom: string | null;
  notes: string | null;
}

interface QuoteRequest {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  notes: string | null;
  attachment_path: string | null;
  status: QuoteStatus;
  created_at: string;
  quote_request_items: QuoteItem[];
}

const Admin = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [section, setSection] = useState<AdminSection>("overview");

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
    if (admin) {
      loadEnquiries();
      loadQuotes();
    }
  };

  const loadEnquiries = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setEnquiries((data ?? []) as Enquiry[]);
    setLoadingData(false);
  };

  const loadQuotes = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*, quote_request_items(*)")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load quotes", description: error.message, variant: "destructive" });
    else setQuotes((data ?? []) as QuoteRequest[]);
  };

  const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    toast({ title: "Status updated" });
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

  const onGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (error) toast({ title: "Google sign-in unavailable", description: error.message, variant: "destructive" });
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
          <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
            Continue with Google
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-surface">
        <AdminSidebar active={section} onSelect={setSection} onLogout={onLogout} />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-card px-4 shadow-[var(--shadow-card)]">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <h1 className="text-sm font-bold uppercase tracking-wider text-primary">
              {section === "overview" && "Overview"}
              {section === "quotes" && "Quote Requests"}
              {section === "enquiries" && "Enquiries"}
              {section === "products" && "Products Catalogue"}
              {section === "tenders" && "Tenders"}
            </h1>
            <div className="ml-auto text-xs text-muted-foreground">
              {session.user.email}
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            {section === "overview" && (
              <OverviewPanel enquiries={enquiries} quotes={quotes} />
            )}
            {section === "quotes" && (
              <QuotesPanel
                quotes={quotes}
                onRefresh={loadQuotes}
                onDownload={downloadAttachment}
                onStatusChange={updateQuoteStatus}
              />
            )}
            {section === "enquiries" && (
              <EnquiriesPanel
                enquiries={enquiries}
                loading={loadingData}
                onRefresh={loadEnquiries}
                onDownload={downloadAttachment}
              />
            )}
            {section === "products" && <ProductsPanel />}
            {section === "tenders" && <TendersPanel />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;

/* ---------- Panels ---------- */

const OverviewPanel = ({ enquiries, quotes }: { enquiries: Enquiry[]; quotes: QuoteRequest[] }) => {
  const last7 = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return enquiries.filter((e) => new Date(e.created_at).getTime() >= cutoff).length;
  }, [enquiries]);
  const openQuotes = useMemo(
    () => quotes.filter((q) => q.status === "new" || q.status === "in_review").length,
    [quotes],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Operations overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live snapshot of enquiries, catalogue, and active tenders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Quote requests" value={quotes.length} icon={ClipboardList} hint="All time" />
        <StatCard label="Open quotes" value={openQuotes} icon={FileText} hint="Awaiting response" />
        <StatCard label="Total enquiries" value={enquiries.length} icon={Inbox} hint="All time" />
        <StatCard label="Last 7 days" value={last7} icon={TrendingUp} hint="New enquiries" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-base font-bold text-primary">Recent enquiries</h3>
        <div className="mt-4 divide-y divide-border">
          {enquiries.slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.organization}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(e.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {enquiries.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">No enquiries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const EnquiriesPanel = ({
  enquiries,
  loading,
  onRefresh,
  onDownload,
}: {
  enquiries: Enquiry[];
  loading: boolean;
  onRefresh: () => void;
  onDownload: (p: string) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{enquiries.length} enquiries</p>
      <Button onClick={onRefresh} variant="outline" size="sm">Refresh</Button>
    </div>
    {loading ? (
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
                <Button onClick={() => onDownload(e.attachment_path!)} variant="goldOutline" size="sm">
                  Download attachment
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProductsPanel = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Catalogue snapshot — read-only. CRUD requires a dedicated <code>products</code> table with RLS.
    </p>
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs font-bold uppercase tracking-wider text-primary">
          <tr>
            <th className="px-5 py-3">Product</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Unit of measure</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {PRODUCTS.map((p) => (
            <tr key={p.name} className="hover:bg-surface/60">
              <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
              <td className="px-5 py-3">
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  {p.category}
                </span>
              </td>
              <td className="px-5 py-3 text-muted-foreground">{p.uom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TendersPanel = () => (
  <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
    <FileText className="mx-auto h-10 w-10 text-accent" />
    <h3 className="mt-4 text-lg font-bold text-primary">Tenders module</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      A tenders table with RLS will hook in here. Currently the public /active-tenders page renders static sample data.
    </p>
  </div>
);

const STATUS_STYLES: Record<QuoteStatus, string> = {
  new: "bg-accent text-accent-foreground",
  in_review: "bg-primary text-primary-foreground",
  quoted: "bg-success/20 text-success",
  closed: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: "New",
  in_review: "In review",
  quoted: "Quoted",
  closed: "Closed",
};

const QuotesPanel = ({
  quotes,
  onRefresh,
  onDownload,
  onStatusChange,
}: {
  quotes: QuoteRequest[];
  onRefresh: () => void;
  onDownload: (p: string) => void;
  onStatusChange: (id: string, s: QuoteStatus) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{quotes.length} quote requests</p>
      <Button onClick={onRefresh} variant="outline" size="sm">Refresh</Button>
    </div>
    {quotes.length === 0 ? (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
        No quote requests yet.
      </div>
    ) : (
      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-primary">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-accent" />
                    {q.company_name}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">{q.full_name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <a href={`mailto:${q.email}`} className="flex items-center gap-1.5 hover:text-accent">
                    <Mail className="h-3.5 w-3.5" />{q.email}
                  </a>
                  <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 hover:text-accent">
                    <Phone className="h-3.5 w-3.5" />{q.phone}
                  </a>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[q.status]}`}>
                  {STATUS_LABELS[q.status]}
                </span>
                <p className="mt-2">{new Date(q.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-[11px] font-bold uppercase tracking-wider text-primary">
                  <tr>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2 w-20">Qty</th>
                    <th className="px-3 py-2">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {q.quote_request_items.map((it) => (
                    <tr key={it.id}>
                      <td className="px-3 py-2 font-medium text-foreground">{it.product_name}</td>
                      <td className="px-3 py-2">{it.quantity}</td>
                      <td className="px-3 py-2 text-muted-foreground">{it.uom ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {q.notes && (
              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-surface p-3 text-sm text-foreground">
                <span className="font-semibold">Notes:</span> {q.notes}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {q.attachment_path && (
                <Button onClick={() => onDownload(q.attachment_path!)} variant="goldOutline" size="sm">
                  <DownloadIcon className="mr-1 h-3.5 w-3.5" /> Attachment
                </Button>
              )}
              <div className="ml-auto flex items-center gap-1">
                {(["new", "in_review", "quoted", "closed"] as QuoteStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(q.id, s)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      q.status === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);