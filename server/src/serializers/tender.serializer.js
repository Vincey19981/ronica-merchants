export const mapTender = (tender) => ({
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

export const mapTenderItem = (item) => ({
  id: item.id,
  description: item.description,
  qty: item.qty,
  uom: item.uom,
  created_at: item.createdAt?.toISOString() || null,
});

export const mapTenderDocument = (doc, tenderId) => ({
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

export const mapTenderHistory = (event) => ({
  id: event.id,
  from_status: event.fromStatus || null,
  to_status: event.toStatus,
  note: event.note || null,
  changed_by: event.changedBy?.toString() || null,
  created_at: event.createdAt?.toISOString() || null,
});
