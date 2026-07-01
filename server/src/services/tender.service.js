import fs from "fs";
import { Tender } from "../models/Tender.js";
import { ApiError } from "../utils/apiError.js";
import { canAccessTender } from "./access.service.js";
import { persistUploadedFile } from "./file.service.js";

const generateReference = () =>
  `TND-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const applyTenderFields = (tender, body) => {
  if (body.title !== undefined) tender.title = body.title;
  if (body.buyer_name !== undefined) tender.buyerName = body.buyer_name || "";
  if (body.description !== undefined) tender.description = body.description || "";
  if (body.submission_deadline !== undefined) {
    tender.submissionDeadline = body.submission_deadline ? new Date(body.submission_deadline) : null;
  }
  if (body.value_cents !== undefined) tender.valueCents = body.value_cents ?? null;
  if (body.items) tender.items = body.items;
};

export const listTenders = (user) => {
  const query = user.roles.includes("admin") ? {} : { orgId: user.organization?.id || "__none__" };
  return Tender.find(query).sort({ createdAt: -1 });
};

export const createTender = (user, body) => {
  if (!user.organization?.id) throw new ApiError(400, "Your account is not linked to an organization");

  return Tender.create({
    orgId: user.organization.id,
    reference: generateReference(),
    title: body.title,
    buyerName: body.buyer_name || "",
    description: body.description || "",
    submissionDeadline: body.submission_deadline ? new Date(body.submission_deadline) : null,
    valueCents: body.value_cents ?? null,
    status: body.status,
    createdBy: user.id,
    items: body.items,
    history:
      body.status === "submitted"
        ? [{ fromStatus: "draft", toStatus: "submitted", note: "Submitted on creation", changedBy: user.id }]
        : [],
  });
};

export const getAccessibleTender = async (user, tenderId) => {
  const tender = await Tender.findById(tenderId);
  if (!tender) throw new ApiError(404, "Tender not found");
  if (!canAccessTender(user, tender)) throw new ApiError(403, "Tender access denied");
  return tender;
};

export const updateTender = async (user, tenderId, body) => {
  const tender = await getAccessibleTender(user, tenderId);
  applyTenderFields(tender, body);

  if (body.status && body.status !== tender.status) {
    tender.history.push({ fromStatus: tender.status, toStatus: body.status, changedBy: user.id });
    tender.status = body.status;
  }

  await tender.save();
  return tender;
};

export const updateTenderStatus = async (user, tenderId, body) => {
  const tender = await getAccessibleTender(user, tenderId);
  tender.history.push({
    fromStatus: tender.status,
    toStatus: body.status,
    note: body.note,
    changedBy: user.id,
  });
  tender.status = body.status;
  await tender.save();
  return tender;
};

export const deleteTender = async (tenderId) => {
  const tender = await Tender.findById(tenderId);
  if (!tender) throw new ApiError(404, "Tender not found");
  await tender.deleteOne();
};

export const attachTenderDocuments = async (user, tenderId, files, docType = "specification") => {
  const tender = await getAccessibleTender(user, tenderId);

  for (const file of files || []) {
    const stored = await persistUploadedFile(file, {
      owner: user.id,
      scope: "tender",
      entityId: tender.id,
    });
    tender.documents.push({
      file: stored.id,
      docType,
      fileName: file.originalname,
      storagePath: file.path,
      sizeBytes: file.size,
      uploadedBy: user.id,
    });
  }

  await tender.save();
  return tender;
};

export const getTenderDocumentForDownload = async (user, tenderId, documentId) => {
  const tender = await getAccessibleTender(user, tenderId);
  const doc = tender.documents.id(documentId);
  if (!doc || !fs.existsSync(doc.storagePath)) throw new ApiError(404, "Document not found");
  return doc;
};
