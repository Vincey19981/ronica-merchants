import fs from "fs";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { ComplianceDocument, COMPLIANCE_STATUSES } from "../models/ComplianceDocument.js";
import { StoredFile } from "../models/StoredFile.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();

const reviewSchema = z.object({
  status: z.enum(COMPLIANCE_STATUSES),
  notes: z.string().trim().max(1000).optional(),
});

const mapCompliance = (doc) => ({
  id: doc.id,
  org_id: doc.orgId,
  doc_type: doc.docType,
  title: doc.title,
  storage_path: doc.storagePath,
  issued_at: doc.issuedAt?.toISOString() || null,
  expires_at: doc.expiresAt?.toISOString() || null,
  status: doc.status,
  notes: doc.notes || null,
  download_url: `/api/compliance/${doc.id}/download`,
  created_at: doc.createdAt.toISOString(),
  updated_at: doc.updatedAt.toISOString(),
});

const canAccessCompliance = (user, doc) =>
  user.roles.includes("admin") || user.roles.includes("compliance") || doc.orgId === user.organization?.id;

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query =
      req.user.roles.includes("admin") || req.user.roles.includes("compliance")
        ? {}
        : { orgId: req.user.organization?.id || "__none__" };
    const docs = await ComplianceDocument.find(query).sort({ expiresAt: 1, createdAt: -1 });
    sendSuccess(res, docs.map(mapCompliance));
  }),
);

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "File is required");
    if (!req.user.organization?.id) throw new ApiError(400, "Your account is not linked to an organization");

    const parsed = z
      .object({
        doc_type: z.string().trim().min(1).max(120),
        title: z.string().trim().min(1).max(200),
        issued_at: z.string().optional(),
        expires_at: z.string().optional(),
      })
      .safeParse(req.body);

    if (!parsed.success) throw new ApiError(400, "Validation failed", parsed.error.flatten());
    const body = parsed.data;

    const stored = await StoredFile.create({
      owner: req.user.id,
      scope: "compliance",
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      storagePath: req.file.path,
    });

    const expiresAt = body.expires_at ? new Date(body.expires_at) : null;
    const doc = await ComplianceDocument.create({
      orgId: req.user.organization.id,
      docType: body.doc_type,
      title: body.title,
      file: stored.id,
      storagePath: req.file.path,
      issuedAt: body.issued_at ? new Date(body.issued_at) : null,
      expiresAt,
      status: expiresAt && expiresAt < new Date() ? "expired" : "pending_review",
      uploadedBy: req.user.id,
    });

    stored.entityId = doc.id;
    await stored.save();
    sendSuccess(res, { document: mapCompliance(doc) }, 201);
  }),
);

router.patch(
  "/:id",
  requireRole("admin", "compliance"),
  validate(reviewSchema),
  asyncHandler(async (req, res) => {
    const doc = await ComplianceDocument.findById(req.params.id);
    if (!doc) throw new ApiError(404, "Compliance document not found");
    doc.status = req.body.status;
    doc.notes = req.body.notes || "";
    doc.reviewedBy = req.user.id;
    doc.reviewedAt = new Date();
    await doc.save();
    sendSuccess(res, { document: mapCompliance(doc) });
  }),
);

router.get(
  "/:id/download",
  asyncHandler(async (req, res) => {
    const doc = await ComplianceDocument.findById(req.params.id);
    if (!doc) throw new ApiError(404, "Compliance document not found");
    if (!canAccessCompliance(req.user, doc)) throw new ApiError(403, "Compliance document access denied");
    if (!fs.existsSync(doc.storagePath)) throw new ApiError(404, "Document file not found");
    res.download(doc.storagePath);
  }),
);

export default router;
