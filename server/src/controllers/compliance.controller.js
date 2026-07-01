import {
  createComplianceDocument,
  getComplianceDocumentForDownload,
  listComplianceDocuments,
  reviewComplianceDocument,
} from "../services/compliance.service.js";
import { mapComplianceDocument } from "../serializers/compliance.serializer.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getComplianceDocuments = async (req, res) => {
  const docs = await listComplianceDocuments(req.user);
  sendSuccess(res, docs.map(mapComplianceDocument));
};

export const postComplianceDocument = async (req, res) => {
  const doc = await createComplianceDocument(req.user, req.file, req.body);
  sendSuccess(res, { document: mapComplianceDocument(doc) }, 201);
};

export const patchComplianceDocument = async (req, res) => {
  const doc = await reviewComplianceDocument(req.user, req.params.id, req.body);
  sendSuccess(res, { document: mapComplianceDocument(doc) });
};

export const downloadComplianceDocument = async (req, res) => {
  const doc = await getComplianceDocumentForDownload(req.user, req.params.id);
  res.download(doc.storagePath);
};
