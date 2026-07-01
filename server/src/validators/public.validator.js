import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().trim().min(5).max(40),
  organization: z.string().trim().min(1).max(200),
  enquiry_type: z.string().trim().max(80).optional(),
  products_needed: z.string().trim().min(1).max(5000),
  source: z.string().trim().max(80).optional(),
});

export const quoteSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  company_name: z.string().trim().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().trim().min(5).max(40),
  notes: z.string().trim().max(2000).optional(),
  items: z.string().transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Items must be valid JSON" });
      return z.NEVER;
    }
  }),
});
