import fs from "fs";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { StoredFile } from "../models/StoredFile.js";
import { Tender, TENDER_STATUSES } from "../models/Tender.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMessage, sendSuccess } from "../utils/apiResponse.js";

const router = Router();

const itemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  qty: z.coerce.number().positive(),
  uom: z.string().trim().min(1).max(60).default("each"),
});

const createTenderSchema = z.object({
  title: z.string().trim().min(3).max(200),
  buyer_name: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().max(5000).optional().nullable(),
  submission_deadline: z.string().datetime().optional().nullable(),
  value_cents: z.coerce.number().int().nonnegative().optional().nullable(),
  status: z.enum(["draft", "submitted"]).default("draft"),
  items: z.array(itemSchema).default([]),
});

const updateTenderSchema = createTenderSchema.partial().extend({
  status: z.enum(TENDER_STATUSES).optional(),
});

const statusSchema = z.object({
  status: z.enum(TENDER_STATUSES),
  note: z.string().trim().max(1000).optional(),
});

const mapTender = (tender) => ({
  id: tender.id,
  org_id: tender.orgId,
  reference: tender.reference,
  title: tender.title,
  buyer_name: tender.buyerName || null,
  description: tender.description || null,
  submission_deadline: tender.submissionDeadline?.toISOString() || null,
  value_cents: tender.valueCents ?? null,
  status: tender.status,
  created_by: tender.createdBy?.toString() || null,
  created_at: tender.createdAt.toISOString(),
  updated_at: tender.updatedAt.toISOString(),
});

const mapItem = (item) => ({
  id: item.id,
  description: item.description,
  qty: item.qty,
  uom: item.uom,
  created_at: item.createdAt?.toISOString() || null,
});

const mapDocument = (doc, tenderId) => ({
  id: doc.id,
  tender_id: tenderId,
  doc_type: doc.docType,
  file_name: doc.fileName,
  storage_path: doc.storagePath,
  size_bytes: doc.sizeBytes,
  uploaded_by: doc.uploadedBy?.toString() || null,
  download_url: `/api/tenders/${tenderId}/documents/${doc.id}/download`,
  created_at: doc.createdAt?.toISOString() || null,
});

const mapHistory = (event) => ({
  id: event.id,
  from_status: event.fromStatus || null,
  to_status: event.toStatus,
  note: event.note || null,
  changed_by: event.changedBy?.toString() || null,
  created_at: event.createdAt?.toISOString() || null,
});

const canAccessTender = (user, tender) =>
  user.roles.includes("admin") || !tender.orgId || tender.orgId === user.organization?.id;

const generateReference = () =>
  `TND-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = req.user.roles.includes("admin") ? {} : { orgId: req.user.organization?.id || "__none__" };
    const tenders = await Tender.find(query).sort({ createdAt: -1 });
    sendSuccess(res, tenders.map(mapTender));
  }),
);

router.post(
  "/",
  requireRole("procurement_officer"),
  validate(createTenderSchema),
  asyncHandler(async (req, res) => {
    if (!req.user.organization?.id) throw new ApiError(400, "Your account is not linked to an organization");

    const tender = await Tender.create({
      orgId: req.user.organization.id,
      reference: generateReference(),
      title: req.body.title,
      buyerName: req.body.buyer_name || "",
      description: req.body.description || "",
      submissionDeadline: req.body.submission_deadline ? new Date(req.body.submission_deadline) : null,
      valueCents: req.body.value_cents ?? null,
      status: req.body.status,
      createdBy: req.user.id,
      items: req.body.items,
      history:
        req.body.status === "submitted"
          ? [{ fromStatus: "draft", toStatus: "submitted", note: "Submitted on creation", changedBy: req.user.id }]
          : [],
    });

    sendSuccess(res, { tender: mapTender(tender) }, 201);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const tender = await Tender.findById(req.params.id);
    if (!tender) throw new ApiError(404, "Tender not found");
    if (!canAccessTender(req.user, tender)) throw new ApiError(403, "Tender access denied");

    sendSuccess(res, {
      tender: mapTender(tender),
      items: tender.items.map(mapItem),
      docs: tender.documents.map((doc) => mapDocument(doc, tender.id)),
      history: tender.history.map(mapHistory),
    });
  }),
);

router.patch(
  "/:id",
  requireRole("procurement_officer"),
  validate(updateTenderSchema),
  asyncHandler(async (req, res) => {
    const tender = await Tender.findById(req.params.id);
    if (!tender) throw new ApiError(404, "Tender not found");
    if (!canAccessTender(req.user, tender)) throw new ApiError(403, "Tender access denied");

    if (req.body.title !== undefined) tender.title = req.body.title;
    if (req.body.buyer_name !== undefined) tender.buyerName = req.body.buyer_name || "";
    if (req.body.description !== undefined) tender.description = req.body.description || "";
    if (req.body.submission_deadline !== undefined) {
      tender.submissionDeadline = req.body.submission_deadline ? new Date(req.body.submission_deadline) : null;
    }
    if (req.body.value_cents !== undefined) tender.valueCents = req.body.value_cents ?? null;
    if (req.body.items) tender.items = req.body.items;
    if (req.body.status && req.body.status !== tender.status) {
      tender.history.push({ fromStatus: tender.status, toStatus: req.body.status, changedBy: req.user.id });
      tender.status = req.body.status;
    }

    await tender.save();
    sendSuccess(res, { tender: mapTender(tender) });
  }),
);

router.patch(
  "/:id/status",
  requireRole("procurement_officer", "compliance"),
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const tender = await Tender.findById(req.params.id);
    if (!tender) throw new ApiError(404, "Tender not found");
    if (!canAccessTender(req.user, tender)) throw new ApiError(403, "Tender access denied");

    tender.history.push({
      fromStatus: tender.status,
      toStatus: req.body.status,
      note: req.body.note,
      changedBy: req.user.id,
    });
    tender.status = req.body.status;
    await tender.save();
    sendSuccess(res, { tender: mapTender(tender) });
  }),
);

router.delete(
  "/:id",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const tender = await Tender.findById(req.params.id);
    if (!tender) throw new ApiError(404, "Tender not found");
    await tender.deleteOne();
    sendMessage(res, "Tender deleted");
  }),
);

router.post(
  "/:id/documents",
  requireRole("procurement_officer"),
  upload.array("documents", 10),
  asyncHandler(async (req, res) => {
    const tender = await Tender.findById(req.params.id);
    if (!tender) throw new ApiError(404, "Tender not found");
    if (!canAccessTender(req.user, tender)) throw new ApiError(403, "Tender access denied");

    const files = req.files || [];
    const documents = [];
    for (const file of files) {
      const stored = await StoredFile.create({
        owner: req.user.id,
        scope: "tender",
        entityId: tender.id,
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storagePath: file.path,
      });
      tender.documents.push({
        file: stored.id,
        docType: req.body.doc_type || "specification",
        fileName: file.originalname,
        storagePath: file.path,
        sizeBytes: file.size,
        uploadedBy: req.user.id,
      });
      documents.push(stored);
    }

    await tender.save();
    sendSuccess(res, { docs: tender.documents.map((doc) => mapDocument(doc, tender.id)) }, 201);
  }),
);

router.get(
  "/:id/documents/:docId/download",
  asyncHandler(async (req, res) => {
    const tender = await Tender.findById(req.params.id);
    if (!tender) throw new ApiError(404, "Tender not found");
    if (!canAccessTender(req.user, tender)) throw new ApiError(403, "Tender access denied");

    const doc = tender.documents.id(req.params.docId);
    if (!doc || !fs.existsSync(doc.storagePath)) throw new ApiError(404, "Document not found");
    res.download(doc.storagePath, doc.fileName);
  }),
);

export default router;
