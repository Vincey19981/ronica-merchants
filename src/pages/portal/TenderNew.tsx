import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { generateTenderReference } from "@/hooks/use-tenders";

const tenderSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  buyer_name: z.string().trim().max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  submission_deadline: z.string().optional(),
  value_cents: z.number().int().nonnegative().optional(),
});

type Item = { description: string; qty: number; uom: string };

const MAX_FILE_BYTES = 20 * 1024 * 1024;

const TenderNew = () => {
  const nav = useNavigate();
  const { profile, user } = useAuth();
  const [title, setTitle] = useState("");
  const [buyer, setBuyer] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [valueKes, setValueKes] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", qty: 1, uom: "each" }]);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => setItems((s) => [...s, { description: "", qty: 1, uom: "each" }]);
  const removeItem = (i: number) => setItems((s) => s.filter((_, idx) => idx !== i));
  const updateItem = (i: number, patch: Partial<Item>) =>
    setItems((s) => s.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const valid: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_BYTES) {
        toast({ title: "File too large", description: `${f.name} exceeds 20MB`, variant: "destructive" });
        continue;
      }
      valid.push(f);
    }
    setFiles((s) => [...s, ...valid]);
  };

  const handleSubmit = async (mode: "draft" | "submit") => {
    if (!profile?.org_id) {
      toast({ title: "No organisation", description: "Your profile must belong to an organisation.", variant: "destructive" });
      return;
    }
    const parsed = tenderSchema.safeParse({
      title,
      buyer_name: buyer || undefined,
      description: description || undefined,
      submission_deadline: deadline || undefined,
      value_cents: valueKes ? Math.round(parseFloat(valueKes) * 100) : undefined,
    });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0]?.message ?? "Check your inputs", variant: "destructive" });
      return;
    }
    const cleanItems = items.filter((i) => i.description.trim().length > 0);

    setSubmitting(true);
    try {
      const reference = generateTenderReference();
      const { data: tender, error } = await supabase
        .from("tenders")
        .insert({
          org_id: profile.org_id,
          reference,
          title: parsed.data.title,
          buyer_name: parsed.data.buyer_name ?? null,
          description: parsed.data.description ?? null,
          submission_deadline: parsed.data.submission_deadline
            ? new Date(parsed.data.submission_deadline).toISOString()
            : null,
          value_cents: parsed.data.value_cents ?? null,
          status: mode === "submit" ? "submitted" : "draft",
          created_by: user?.id ?? null,
        })
        .select("*")
        .single();
      if (error) throw error;

      if (cleanItems.length) {
        const { error: itemsErr } = await supabase.from("tender_items").insert(
          cleanItems.map((i) => ({
            tender_id: tender.id,
            description: i.description.trim(),
            qty: i.qty,
            uom: i.uom,
          })),
        );
        if (itemsErr) throw itemsErr;
      }

      for (const f of files) {
        const safeName = f.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const path = `${profile.org_id}/${tender.id}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("tender-docs").upload(path, f, {
          upsert: false,
          contentType: f.type || undefined,
        });
        if (upErr) throw upErr;
        await supabase.from("tender_documents").insert({
          tender_id: tender.id,
          doc_type: "specification",
          file_name: f.name,
          storage_path: path,
          size_bytes: f.size,
          uploaded_by: user?.id ?? null,
        });
      }

      if (mode === "submit") {
        await supabase.from("tender_status_history").insert({
          tender_id: tender.id,
          from_status: "draft",
          to_status: "submitted",
          note: "Submitted on creation",
        });
      }

      toast({ title: mode === "submit" ? "Tender submitted" : "Draft saved", description: reference });
      nav(`/portal/tenders/${tender.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create tender";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">New tender</h1>
        <p className="text-sm text-muted-foreground">
          Capture the buyer brief, BOQ line items and upload supporting documents.
        </p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-lg">Tender details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Supply of office furniture to Ministry of X" />
          </div>
          <div>
            <Label htmlFor="buyer">Buyer / Procuring entity</Label>
            <Input id="buyer" value={buyer} onChange={(e) => setBuyer(e.target.value)} placeholder="e.g. Ministry of Health" />
          </div>
          <div>
            <Label htmlFor="deadline">Submission deadline</Label>
            <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="value">Estimated value (KES)</Label>
            <Input id="value" type="number" min={0} step="0.01" value={valueKes} onChange={(e) => setValueKes(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desc">Description / scope</Label>
            <Textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Line items (BOQ)</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 h-4 w-4" /> Add item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-7"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                />
                <Input
                  className="col-span-2"
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => updateItem(idx, { qty: Number(e.target.value) || 1 })}
                />
                <Input
                  className="col-span-2"
                  placeholder="UOM"
                  value={it.uom}
                  onChange={(e) => updateItem(idx, { uom: e.target.value })}
                />
                <Button type="button" variant="ghost" size="icon" className="col-span-1" onClick={() => removeItem(idx)} disabled={items.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Documents</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/30 p-8 text-center hover:border-accent">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Click to upload tender documents</span>
            <span className="text-xs text-muted-foreground">Specs, BOQ, drawings — up to 20MB each</span>
            <input type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
          </label>
          {files.length > 0 && (
            <ul className="space-y-1 text-sm">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded border border-border bg-card px-3 py-1.5">
                  <span className="truncate">{f.name} <span className="text-xs text-muted-foreground">({(f.size / 1024).toFixed(1)} KB)</span></span>
                  <button type="button" onClick={() => setFiles((s) => s.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => nav("/portal/tenders")} disabled={submitting}>Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={submitting}>Save draft</Button>
        <Button variant="gold" onClick={() => handleSubmit("submit")} disabled={submitting}>
          {submitting ? "Working…" : "Submit tender"}
        </Button>
      </div>
    </div>
  );
};

export default TenderNew;