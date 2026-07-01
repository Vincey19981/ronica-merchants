import { Router } from "express";
import { z } from "zod";
import { upload } from "../middleware/upload.js";
import { PublicSubmission } from "../models/PublicSubmission.js";
import { StoredFile } from "../models/StoredFile.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().trim().min(5).max(40),
  organization: z.string().trim().min(1).max(200),
  enquiry_type: z.string().trim().max(80).optional(),
  products_needed: z.string().trim().min(1).max(5000),
  source: z.string().trim().max(80).optional(),
});

const quoteSchema = z.object({
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

const persistFile = async (file, scope) => {
  if (!file) return null;
  return StoredFile.create({
    scope,
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storagePath: file.path,
  });
};

router.post(
  "/enquiries",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation failed", parsed.error.flatten());
    const stored = await persistFile(req.file, "quote");
    const submission = await PublicSubmission.create({
      type: "enquiry",
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      organization: parsed.data.organization,
      payload: parsed.data,
      file: stored?.id,
    });
    if (stored) {
      stored.entityId = submission.id;
      await stored.save();
    }
    sendSuccess(res, { id: submission.id }, 201);
  }),
);

router.post(
  "/quote-requests",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const parsed = quoteSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation failed", parsed.error.flatten());
    const stored = await persistFile(req.file, "quote");
    const submission = await PublicSubmission.create({
      type: "quote_request",
      name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      organization: parsed.data.company_name,
      payload: parsed.data,
      file: stored?.id,
    });
    if (stored) {
      stored.entityId = submission.id;
      await stored.save();
    }
    sendSuccess(res, { id: submission.id }, 201);
  }),
);

export default router;
