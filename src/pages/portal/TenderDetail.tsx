import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Download, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  STATUS_LABELS,
  STATUS_TONE,
  docSignedUrl,
  useTender,
  useSubmitTender,
} from "@/hooks/use-tenders";

const formatDateTime = (s: string | null) =>
  s ? new Date(s).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }) : "—";

const TenderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useTender(id);
  const { profile, hasRole, isAdmin, user } = useAuth();
  const submitMut = useSubmitTender();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const canEdit =
    !!data?.tender &&
    data.tender.status === "draft" &&
    (isAdmin || hasRole("procurement_officer")) &&
    data.tender.org_id === profile?.org_id;

  const handleUpload = async (files: FileList | null) => {
    if (!files || !data?.tender) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        if (f.size > 20 * 1024 * 1024) {
          toast({ title: "Too large", description: `${f.name} exceeds 20MB`, variant: "destructive" });
          continue;
        }
        const safeName = f.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const path = `${data.tender.org_id}/${data.tender.id}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("tender-docs")
          .upload(path, f, { contentType: f.type || undefined });
        if (upErr) throw upErr;
        await supabase.from("tender_documents").insert({
          tender_id: data.tender.id,
          doc_type: "specification",
          file_name: f.name,
          storage_path: path,
          size_bytes: f.size,
          uploaded_by: user?.id ?? null,
        });
      }
      qc.invalidateQueries({ queryKey: ["tender", id] });
      toast({ title: "Documents uploaded" });
    } catch (e) {
      toast({ title: "Upload failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const openDoc = async (path: string) => {
    try {
      const url = await docSignedUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast({ title: "Cannot open file", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="space-y-3 p-6"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-40 w-full" /></div>;
  }
  if (!data?.tender) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Tender not found.</p>
        <Button asChild variant="link"><Link to="/portal/tenders">Back to tenders</Link></Button>
      </div>
    );
  }
  const t = data.tender;

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link to="/portal/tenders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> All tenders
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{t.reference}</p>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.buyer_name || "Buyer not set"} • Deadline {formatDateTime(t.submission_deadline)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_TONE[t.status]}`}>
            {STATUS_LABELS[t.status]}
          </span>
          {canEdit && (
            <Button variant="gold" onClick={() => submitMut.mutate(t)} disabled={submitMut.isPending}>
              <Send className="mr-2 h-4 w-4" /> {submitMut.isPending ? "Submitting…" : "Submit tender"}
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Scope</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {t.description || <span className="text-muted-foreground">No description provided.</span>}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Line items</CardTitle></CardHeader>
            <CardContent className="p-0">
              {data.items.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No line items.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-left">UOM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((it) => (
                      <tr key={it.id} className="border-t border-border">
                        <td className="px-4 py-2">{it.description}</td>
                        <td className="px-4 py-2 text-right">{it.qty}</td>
                        <td className="px-4 py-2 text-muted-foreground">{it.uom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Documents</CardTitle>
              {canEdit && (
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground">
                  <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Add files"}
                  <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
                </label>
              )}
            </CardHeader>
            <CardContent>
              {data.docs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents uploaded.</p>
              ) : (
                <ul className="space-y-2">
                  {data.docs.map((d) => (
                    <li key={d.id} className="flex items-center justify-between rounded border border-border bg-card px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{d.file_name}</span>
                        <span className="text-xs text-muted-foreground">({((d.size_bytes ?? 0) / 1024).toFixed(1)} KB)</span>
                      </span>
                      <button onClick={() => openDoc(d.storage_path)} className="inline-flex items-center gap-1 text-primary hover:underline">
                        <Download className="h-3.5 w-3.5" /> Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">Status timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l border-border pl-4">
              <li className="relative">
                <span className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-primary" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Created</p>
                <p className="text-sm font-medium text-foreground">{formatDateTime(t.created_at)}</p>
              </li>
              {data.history.map((h) => (
                <li key={h.id} className="relative">
                  <span className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-accent">
                    <CheckCircle2 className="h-3 w-3 text-accent-foreground" />
                  </span>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {h.from_status ? `${STATUS_LABELS[h.from_status]} → ` : ""}{STATUS_LABELS[h.to_status]}
                  </p>
                  <p className="text-sm font-medium text-foreground">{formatDateTime(h.created_at)}</p>
                  {h.note && <p className="mt-0.5 text-xs text-muted-foreground">{h.note}</p>}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenderDetail;