export const mapComplianceDocument = (doc) => ({
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
