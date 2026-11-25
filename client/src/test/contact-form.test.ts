import { describe, expect, it } from "vitest";
import { contactSchema } from "@/components/forms/ContactForm";

const valid = { name: "Jane Wanjiku", organization: "Acme Ltd", email: "jane@acme.co.ke", phone: "+254 700 000 000", service: "Technology & Digital Solutions", subject: "Network upgrade", message: "We need a network assessment for our Nairobi office." };

describe("contact form rules", () => {
  it("accepts a complete enquiry", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it("rejects an invalid business email", () => expect(contactSchema.safeParse({ ...valid, email: "jane" }).success).toBe(false));
  it("rejects an unknown service", () => expect(contactSchema.safeParse({ ...valid, service: "Stationery" }).success).toBe(false));
  it("requires a detailed message of at least 20 characters", () => expect(contactSchema.safeParse({ ...valid, message: "short" }).success).toBe(false));
});
