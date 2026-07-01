import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";

const CATEGORIES = [
  "Office Stationery",
  "Ink & Toner",
  "Furniture",
  "Cleaning Supplies",
  "Technology",
  "Packaging",
  "Mixed / Multiple",
];

export const QuoteEnquiryForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const body = [
      `Organisation: ${get("organisation")}`,
      `Contact: ${get("contact_name")}`,
      `Phone: ${get("phone")}`,
      `Email: ${get("email")}`,
      `Tender / LPO Number: ${get("tender_no") || "—"}`,
      `Category: ${get("category")}`,
      `Items: ${get("description")}`,
      `Quantity / Budget: ${get("budget") || "—"}`,
      `Delivery Location: ${get("location")}`,
      `Preferred Response: ${get("response_method")}`,
    ].join("\n");
    const subject = `Quote enquiry — ${get("organisation") || "New enquiry"}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="border border-success/30 bg-success/5 p-8 text-center"
        style={{ borderRadius: "6px" }}
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-xl text-primary" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
          Enquiry prepared.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email client has opened with the enquiry details. Send it and we will
          respond within 24 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border bg-card p-6 sm:p-8" style={{ borderRadius: "6px" }} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Organisation / Company Name" required>
          <Input name="organisation" required />
        </Field>
        <Field label="Contact Person Name" required>
          <Input name="contact_name" required autoComplete="name" />
        </Field>
        <Field label="Phone Number" required>
          <Input name="phone" type="tel" required autoComplete="tel" />
        </Field>
        <Field label="Email Address" required>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Tender / LPO Number (if applicable)">
          <Input name="tender_no" />
        </Field>
        <Field label="Product Category" required>
          <select
            name="category"
            required
            defaultValue=""
            className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm"
            style={{ borderRadius: "6px" }}
          >
            <option value="" disabled>Select a category…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Brief Description of Items Required" required>
            <Textarea name="description" rows={4} required placeholder="e.g. 200 reams of A4 80gsm, 40 units HP 85A toner, 12 executive chairs…" />
          </Field>
        </div>
        <Field label="Estimated Quantity or Budget Range">
          <Input name="budget" placeholder="e.g. KES 250,000 or 500 units" />
        </Field>
        <Field label="Delivery Location / County" required>
          <Input name="location" required placeholder="e.g. Nairobi, Kisumu County" />
        </Field>
        <div className="md:col-span-2">
          <Label className="text-xs font-medium uppercase text-primary" style={{ letterSpacing: "0.08em" }}>
            Preferred Response Method <span className="text-accent">*</span>
          </Label>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            {["Phone Call", "WhatsApp", "Email"].map((opt, i) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="response_method" value={opt} required defaultChecked={i === 0} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" variant="gold" size="lg" className="mt-8 w-full md:w-auto">
        Send Enquiry
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        We respond to all enquiries within 24 business hours.
      </p>
    </form>
  );
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="text-xs font-medium uppercase text-primary" style={{ letterSpacing: "0.08em" }}>
      {label} {required && <span className="text-accent">*</span>}
    </Label>
    <div className="mt-1.5">{children}</div>
  </div>
);