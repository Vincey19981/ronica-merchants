import {
  attachTenderDocuments,
  createTender,
  deleteTender,
  getAccessibleTender,
  getTenderDocumentForDownload,
  listTenders,
  updateTender,
  updateTenderStatus,
} from "../services/tender.service.js";
import {
  mapTender,
  mapTenderDocument,
  mapTenderHistory,
  mapTenderItem,
} from "../serializers/tender.serializer.js";
import { sendMessage, sendSuccess } from "../utils/apiResponse.js";

export const getTenders = async (req, res) => {
  const tenders = await listTenders(req.user);
  sendSuccess(res, tenders.map(mapTender));
};

export const postTender = async (req, res) => {
  const tender = await createTender(req.user, req.body);
  sendSuccess(res, { tender: mapTender(tender) }, 201);
};

export const getTenderById = async (req, res) => {
  const tender = await getAccessibleTender(req.user, req.params.id);
  sendSuccess(res, {
    tender: mapTender(tender),
    items: tender.items.map(mapTenderItem),
    docs: tender.documents.map((doc) => mapTenderDocument(doc, tender.id)),
    history: tender.history.map(mapTenderHistory),
  });
};

export const patchTender = async (req, res) => {
  const tender = await updateTender(req.user, req.params.id, req.body);
  sendSuccess(res, { tender: mapTender(tender) });
};

export const patchTenderStatus = async (req, res) => {
  const tender = await updateTenderStatus(req.user, req.params.id, req.body);
  sendSuccess(res, { tender: mapTender(tender) });
};

export const removeTender = async (req, res) => {
  await deleteTender(req.params.id);
  sendMessage(res, "Tender deleted");
};

export const postTenderDocuments = async (req, res) => {
  const tender = await attachTenderDocuments(req.user, req.params.id, req.files || [], req.body.doc_type);
  sendSuccess(res, { docs: tender.documents.map((doc) => mapTenderDocument(doc, tender.id)) }, 201);
};

export const downloadTenderDocument = async (req, res) => {
  const doc = await getTenderDocumentForDownload(req.user, req.params.id, req.params.docId);
  res.download(doc.storagePath, doc.fileName);
};
