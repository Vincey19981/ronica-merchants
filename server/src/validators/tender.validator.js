import { z } from "zod";
import { TENDER_STATUSES } from "../models/Tender.js";

const tenderItemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  qty: z.coerce.number().positive(),
  uom: z.string().trim().min(1).max(60).default("each"),
});

export const createTenderSchema = z.object({
  title: z.string().trim().min(3).max(200),
  buyer_name: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().max(5000).optional().nullable(),
  submission_deadline: z.string().datetime().optional().nullable(),
  value_cents: z.coerce.number().int().nonnegative().optional().nullable(),
  status: z.enum(["draft", "submitted"]).default("draft"),
  items: z.array(tenderItemSchema).default([]),
});

export const updateTenderSchema = createTenderSchema.partial().extend({
  status: z.enum(TENDER_STATUSES).optional(),
});

export const tenderStatusSchema = z.object({
  status: z.enum(TENDER_STATUSES),
  note: z.string().trim().max(1000).optional(),
});
