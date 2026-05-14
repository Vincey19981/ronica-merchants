import { useState } from "react";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = /\.(pdf|xls|xlsx|doc|docx|csv|png|jpg|jpeg)$/i;

const lineSchema = z.object({
  product_name: z.string().trim().min(1, "Product is required").max(200),
  quantity: z.coerce.number().int().positive("Qty must be > 0"),
  uom: z.string().trim().max(60).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

const headerSchema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  company_name: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Too short").max(40),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

type Line = { product_name: string; quantity: string; uom: string; notes: string };

const emptyLine = (): Line => ({ product_name: "", quantity: "1", uom: "", notes: "" });

export const QuoteRequestForm = () => {
  const { toast } = useToast();
  const [params] = useSearchParams();
  const prefillCategory = params.get("category") ?? "";
  const prefillProduct = params.get("product") ?? "";

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lineErrors, setLineErrors] = useState<Record<number, Record<string, string>>>({});
  const [lines, setLines] = useState<Line[]>(() => {
    const initial = emptyLine();
    if (prefillProduct) initial.product_name = prefillProduct;
    else if (prefillCategory) initial.product_name = `${prefillCategory} — `;
    return [initial];
  });

  const updateLine = (i: number, patch: Partial<Line>) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };

  const handleFile = (f: File | null) => {
    setFileError(null);
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_BYTES) return setFileError("File must be 10MB or smaller.");
    if (!ALLOWED_EXT.test(f.name)) return setFileError("Allowed: PDF, Excel, Word, CSV, image.");
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLineErrors({});

    const fd = new FormData(e.currentTarget);
    const headerData = {
      full_name: String(fd.get("full_name") ?? ""),
      company_name: String(fd.get("company_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    const headerParsed = headerSchema.safeParse(headerData);
    const fieldErrs: Record<string, string> = {};
    if (!headerParsed.success) {
      headerParsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrs[String(i.path[0])] = i.message;
      });
    }

    const itemsParsed: { product_name: string; quantity: number; uom?: string; notes?: string }[] = [];
    const lineErrs: Record<number, Record<string, string>> = {};
    lines.forEach((l, idx) => {
      const r = lineSchema.safeParse(l);
      if (!r.success) {
        const e: Record<string, string> = {};
        r.error.issues.forEach((i) => {
          if (i.path[0]) e[String(i.path[0])] = i.message;
        });
        lineErrs[idx] = e;
      } else {
        itemsParsed.push({
          product_name: r.data.product_name,
          quantity: r.data.quantity,
          uom: r.data.uom || undefined,
          notes: r.data.notes || undefined,
        });
      }
    });

    if (Object.keys(fieldErrs).length || Object.keys(lineErrs).length) {
      setErrors(fieldErrs);
      setLineErrors(lineErrs);
      toast({
        title: "Please fix the highlighted fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      let attachment_path: string | null = null;
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `quotes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("boq-uploads")
          .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (upErr) throw upErr;
        attachment_path = path;
      }

      const { data: inserted, error: insErr } = await supabase
        .from("quote_requests")
        .insert({
          full_name: headerParsed.data!.full_name,
          company_name: headerParsed.data!.company_name,
          email: headerParsed.data!.email,
          phone: headerParsed.data!.phone,
          notes: headerParsed.data!.notes || null,
          attachment_path,
        })
        .select("id")
        .single();
      if (insErr) throw insErr;

      const { error: itemsErr } = await supabase.from("quote_request_items").insert(
        itemsParsed.map((it) => ({ ...it, quote_request_id: inserted!.id })),
      );
      if (itemsErr) throw itemsErr;

      setSubmitted(true);
      toast({
        title: "Quote request received",
        description: "Our procurement team will respond within 24 business hours.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-xl font-bold text-primary">Quote request received.</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. Our procurement team will respond with a formal quotation within 24 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <fieldset className="space-y-5 rounded-xl border border-border bg-card p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Your details
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="full_name" required error={errors.full_name}>
            <Input name="full_name" autoComplete="name" required />
          </Field>
          <Field label="Company name" name="company_name" required error={errors.company_name}>
            <Input name="company_name" autoComplete="organization" required />
          </Field>
          <Field label="Email" name="email" required error={errors.email}>
            <Input type="email" name="email" autoComplete="email" required />
          </Field>
          <Field label="Phone" name="phone" required error={errors.phone}>
            <Input type="tel" name="phone" autoComplete="tel" required />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5 rounded-xl border border-border bg-card p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Products needed
        </legend>
        <div className="space-y-4">
          {lines.map((line, idx) => {
            const e = lineErrors[idx] ?? {};
            return (
              <div
                key={idx}
                className="grid gap-3 rounded-lg border border-border bg-surface/40 p-4 sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <Field label={idx === 0 ? "Product / description" : ""} name={`p${idx}`} error={e.product_name}>
                  <Input
                    value={line.product_name}
                    onChange={(ev) => updateLine(idx, { product_name: ev.target.value })}
                    placeholder="e.g. A4 Copy Paper 80gsm"
                    required
                  />
                </Field>
                <Field label={idx === 0 ? "Quantity" : ""} name={`q${idx}`} error={e.quantity}>
                  <Input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(ev) => updateLine(idx, { quantity: ev.target.value })}
                    required
                  />
                </Field>
                <Field label={idx === 0 ? "Unit (optional)" : ""} name={`u${idx}`}>
                  <Input
                    value={line.uom}
                    onChange={(ev) => updateLine(idx, { uom: ev.target.value })}
                    placeholder="reams, boxes…"
                  />
                </Field>
                <div className={idx === 0 ? "flex items-end" : "flex items-center"}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove line"
                    disabled={lines.length === 1}
                    onClick={() => setLines((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLines((prev) => [...prev, emptyLine()])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add another product
        </Button>
      </fieldset>

      <fieldset className="space-y-5 rounded-xl border border-border bg-card p-6">
        <legend className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Additional info
        </legend>
        <Field label="Notes (optional)" name="notes" error={errors.notes}>
          <Textarea
            name="notes"
            rows={4}
            placeholder="Delivery location, deadline, tender reference, special requirements…"
          />
        </Field>

        <div>
          <Label className="text-sm font-semibold text-primary">
            Attach BOQ, tender doc or specs (optional)
          </Label>
          <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface px-4 py-4 hover:border-accent hover:bg-accent/5">
            <Upload className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">
              {file ? file.name : "PDF, Word, Excel, CSV or image · max 10MB"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {fileError && <p className="mt-1 text-xs text-destructive">{fileError}</p>}
        </div>
      </fieldset>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Submit quote request"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We respond to all quotation requests within 24 business hours.
      </p>
    </form>
  );
};

const Field = ({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    {label && (
      <Label htmlFor={name} className="text-xs font-semibold text-primary">
        {label} {required && <span className="text-accent">*</span>}
      </Label>
    )}
    <div className={label ? "mt-1.5" : ""}>{children}</div>
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);