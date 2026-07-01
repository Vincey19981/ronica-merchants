import { z } from "zod";
import { COMPLIANCE_STATUSES } from "../models/ComplianceDocument.js";

export const createComplianceSchema = z.object({
  doc_type: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  issued_at: z.string().optional(),
  expires_at: z.string().optional(),
});

export const reviewComplianceSchema = z.object({
  status: z.enum(COMPLIANCE_STATUSES),
  notes: z.string().trim().max(1000).optional(),
});
