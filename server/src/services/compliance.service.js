import fs from "fs";
import { ComplianceDocument } from "../models/ComplianceDocument.js";
import { ApiError } from "../utils/apiError.js";
import { canAccessOrganizationRecord, canReviewOrganizationRecords } from "./access.service.js";
import { persistUploadedFile } from "./file.service.js";

export const listComplianceDocuments = (user) => {
  const query = canReviewOrganizationRecords(user) ? {} : { orgId: user.organization?.id || "__none__" };
  return ComplianceDocument.find(query).sort({ expiresAt: 1, createdAt: -1 });
};

export const createComplianceDocument = async (user, file, body) => {
  if (!file) throw new ApiError(400, "File is required");
  if (!user.organization?.id) throw new ApiError(400, "Your account is not linked to an organization");

  const stored = await persistUploadedFile(file, {
    owner: user.id,
    scope: "compliance",
  });
  const expiresAt = body.expires_at ? new Date(body.expires_at) : null;
  const doc = await ComplianceDocument.create({
    orgId: user.organization.id,
    docType: body.doc_type,
    title: body.title,
    file: stored.id,
    storagePath: file.path,
    issuedAt: body.issued_at ? new Date(body.issued_at) : null,
    expiresAt,
    status: expiresAt && expiresAt < new Date() ? "expired" : "pending_review",
    uploadedBy: user.id,
  });

  stored.entityId = doc.id;
  await stored.save();
  return doc;
};

export const reviewComplianceDocument = async (user, documentId, body) => {
  const doc = await ComplianceDocument.findById(documentId);
  if (!doc) throw new ApiError(404, "Compliance document not found");
  doc.status = body.status;
  doc.notes = body.notes || "";
  doc.reviewedBy = user.id;
  doc.reviewedAt = new Date();
  await doc.save();
  return doc;
};

export const getComplianceDocumentForDownload = async (user, documentId) => {
  const doc = await ComplianceDocument.findById(documentId);
  if (!doc) throw new ApiError(404, "Compliance document not found");
  if (!canAccessOrganizationRecord(user, doc.orgId)) throw new ApiError(403, "Compliance document access denied");
  if (!fs.existsSync(doc.storagePath)) throw new ApiError(404, "Document file not found");
  return doc;
};
