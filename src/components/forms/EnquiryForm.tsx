import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ENQUIRY_TYPES = ["General Quotation", "Tender/BOQ", "LPO Supply", "Bulk Order", "Other"] as const;
const SOURCES = ["Google", "Referral", "Tender Notice Board", "Social Media", "Other"];

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  organization: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Too short").max(40),
  enquiry_type: z.enum(ENQUIRY_TYPES),
  products_needed: z.string().trim().min(1, "Required").max(5000),
  source: z.string().trim().max(80).optional(),
});

const RATE_LIMIT_KEY = "rm_enquiry_submissions";
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    const arr: number[] = raw ? JSON.parse(raw) : [];
    const recent = arr.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (recent.length >= RATE_LIMIT_MAX) return false;
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    return true;
  } catch {
    return true;
  }
}

export const EnquiryForm = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFile = (f: File | null) => {
    setFileError(null);
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_BYTES) {
      setFileError("File must be 5MB or smaller.");
      return;
    }
    if (!ALLOWED_TYPES.includes(f.type) && !/\.(pdf|xlsx|xls)$/i.test(f.name)) {
      setFileError("Only PDF or Excel files are allowed.");
      return;
    }
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      organization: String(fd.get("organization") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      enquiry_type: String(fd.get("enquiry_type") ?? ""),
      products_needed: String(fd.get("products_needed") ?? ""),
      source: String(fd.get("source") ?? "") || undefined,
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrs[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrs);
      return;
    }
    if (!checkRateLimit()) {
      toast({
        title: "Too many submissions",
        description: "Please wait before submitting again, or call us directly.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      let attachment_path: string | null = null;
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("boq-uploads").upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
        if (upErr) throw upErr;
        attachment_path = path;
      }
      const { error } = await supabase.from("enquiries").insert({
        ...parsed.data,
        attachment_path,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Enquiry sent", description: "We'll respond within 24 business hours." });
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission failed",
        description: "Please try again or call us directly.",
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
        <h3 className="mt-4 text-xl font-bold text-primary">Enquiry received.</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. Our procurement team will respond within 24 business hours.
          For urgent tenders, please call us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" required error={errors.name}>
          <Input name="name" autoComplete="name" required />
        </Field>
        <Field label="Organization / Company" name="organization" required error={errors.organization}>
          <Input name="organization" autoComplete="organization" required />
        </Field>
        <Field label="Email Address" name="email" required error={errors.email}>
          <Input type="email" name="email" autoComplete="email" required />
        </Field>
        <Field label="Phone Number" name="phone" required error={errors.phone}>
          <Input type="tel" name="phone" autoComplete="tel" required />
        </Field>
      </div>

      <Field label="Type of Enquiry" name="enquiry_type" required error={errors.enquiry_type}>
        <Select name="enquiry_type" defaultValue="General Quotation">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {ENQUIRY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Products Needed" name="products_needed" required error={errors.products_needed}>
        <Textarea
          name="products_needed"
          rows={5}
          placeholder="List the items and quantities. e.g. A4 Copy Paper 80gsm — 50 reams; HP 85A Toner — 10 units…"
          required
        />
      </Field>

      <div>
        <Label className="text-sm font-semibold text-primary">Attach BOQ or Tender Document</Label>
        <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface px-4 py-4 hover:border-accent hover:bg-accent/5">
          <Upload className="h-5 w-5 text-accent" />
          <span className="text-sm text-muted-foreground">
            {file ? file.name : "PDF or Excel · max 5MB"}
          </span>
          <input
            type="file"
            accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {fileError && <p className="mt-1 text-xs text-destructive">{fileError}</p>}
      </div>

      <Field label="How did you hear about us?" name="source" error={errors.source}>
        <Select name="source" defaultValue="Google">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send Enquiry"}
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
    <Label htmlFor={name} className="text-sm font-semibold text-primary">
      {label} {required && <span className="text-accent">*</span>}
    </Label>
    <div className="mt-1.5">{children}</div>
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);