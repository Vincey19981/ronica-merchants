import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { publicApi } from "@/lib/api/public";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  organization: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email("Invalid email").max(255).or(z.literal("")),
  phone: z.string().trim().max(40),
  products_needed: z.string().trim().min(1, "Required").max(5000),
  deadline: z.string().trim().max(80).optional(),
}).refine((data) => data.email || data.phone.length >= 5, {
  message: "Add a phone number or email address.",
  path: ["phone"],
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
      products_needed: String(fd.get("products_needed") ?? ""),
      deadline: String(fd.get("deadline") ?? "") || undefined,
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
      const form = new FormData();
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });
      form.append("enquiry_type", "Quote Request");
      if (file) form.append("file", file);
      await publicApi.submitEnquiry(form);
      setSubmitted(true);
      toast({ title: "Quote request sent", description: "We reply within 24 hours." });
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
        <h3 className="mt-4 text-xl font-bold text-primary">Quote request received.</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. We reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required error={errors.name}>
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Organisation" name="organization" required error={errors.organization}>
          <Input id="organization" name="organization" autoComplete="organization" required />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <Input id="phone" type="tel" name="phone" autoComplete="tel" />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <Input id="email" type="email" name="email" autoComplete="email" />
        </Field>
      </div>

      <Field label="Items Needed" name="products_needed" required error={errors.products_needed}>
        <Textarea
          id="products_needed"
          name="products_needed"
          rows={5}
          placeholder="List the items and quantities. e.g. A4 Copy Paper 80gsm - 50 reams; HP 85A Toner - 10 units."
          required
        />
      </Field>

      <Field label="Deadline" name="deadline" error={errors.deadline}>
        <Input id="deadline" name="deadline" placeholder="e.g. Friday 18 October, or within 7 days" />
      </Field>

      <div>
        <Label className="text-sm font-semibold text-primary">Optional BOQ File Upload</Label>
        <label className="mt-2 flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface px-4 py-4 hover:border-accent hover:bg-accent/5">
          <Upload className="h-5 w-5 shrink-0 text-accent" />
          <span className="text-sm text-muted-foreground">
            {file ? file.name : "PDF or Excel, max 5MB"}
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

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Request a Quote"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We reply within 24 hours. Add either a phone number or an email address.
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