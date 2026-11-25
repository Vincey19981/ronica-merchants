import { useRef, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SERVICE_OPTIONS } from "@/lib/content";
import { submitContactEnquiry } from "@/lib/api/contact";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  organization: z.string().trim().min(2, "Please enter your organisation").max(200),
  email: z.string().trim().email("Enter a valid business email").max(255),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid telephone number"),
  service: z.enum(SERVICE_OPTIONS as [string, ...string[]], { errorMap: () => ({ message: "Choose a service" }) }),
  subject: z.string().trim().min(3, "Add a short subject").max(150),
  message: z.string().trim().min(20, "Please share a little more detail (20+ characters)").max(4000),
});

type Errors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
const empty = { name: "", organization: "", email: "", phone: "", service: "", subject: "", message: "" };

export const ContactForm = () => {
  const [values, setValues] = useState(() => {
    const svc = new URLSearchParams(window.location.search).get("service") ?? "";
    return { ...empty, service: SERVICE_OPTIONS.includes(svc) ? svc : "" };
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [honey, setHoney] = useState("");
  const startedAt = useRef(Date.now());

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as keyof Errors] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    // Spam protection: hidden honeypot field and a minimum fill time.
    if (honey || Date.now() - startedAt.current < 3000) { setStatus("sent"); return; }
    setStatus("sending");
    try {
      await submitContactEnquiry(parsed.data as never);
      setStatus("sent");
    } catch (err) {
      setServerError((err as Error).message);
      setStatus("error");
    }
  };

  if (status === "sent") return (
    <div className="flex flex-col items-start gap-4 py-10" role="status">
      <CheckCircle2 className="h-10 w-10 text-accent" />
      <h3 className="text-2xl font-bold text-primary">Thank you — your enquiry has been received.</h3>
      <p className="text-muted-foreground">Our team will review it and get back to you using the details you provided.</p>
      <Button variant="outline" onClick={() => { setValues(empty); startedAt.current = Date.now(); setStatus("idle"); }}>Send another enquiry</Button>
    </div>
  );

  const field = (k: keyof typeof empty, label: string, type = "text", auto?: string) => (
    <div className="space-y-2">
      <Label htmlFor={k}>{label} *</Label>
      <Input id={k} type={type} autoComplete={auto} value={values[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={`${k}-err`} />
      {errors[k] && <p id={`${k}-err`} className="text-sm text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {field("name", "Full name", "text", "name")}
      {field("organization", "Organisation", "text", "organization")}
      {field("email", "Business email", "email", "email")}
      {field("phone", "Telephone", "tel", "tel")}
      <div className="space-y-2">
        <Label htmlFor="service">Service of interest *</Label>
        <select id="service" value={values.service} onChange={set("service")} aria-invalid={!!errors.service}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
      </div>
      {field("subject", "Enquiry subject")}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="message">Detailed message *</Label>
        <Textarea id="message" rows={6} value={values.message} onChange={set("message")} aria-invalid={!!errors.message} />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} className="hidden" aria-hidden />
      {status === "error" && <p className="text-sm text-destructive sm:col-span-2" role="alert">{serverError}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" variant="navy" size="lg" disabled={status === "sending"}>
          {status === "sending" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
};
