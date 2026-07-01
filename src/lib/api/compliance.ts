import { apiRequest } from "./client";

export interface ComplianceDocument {
  id: string;
  org_id: string;
  doc_type: string;
  title: string;
  storage_path: string;
  issued_at: string | null;
  expires_at: string | null;
  status: "valid" | "expired" | "pending_review" | "rejected";
  notes: string | null;
  download_url: string;
  created_at: string;
  updated_at: string;
}

export const complianceApi = {
  list: () => apiRequest<ComplianceDocument[]>("/api/compliance"),
  upload: (input: { file: File; doc_type: string; title: string; issued_at?: string; expires_at?: string }) => {
    const form = new FormData();
    form.append("file", input.file);
    form.append("doc_type", input.doc_type);
    form.append("title", input.title);
    if (input.issued_at) form.append("issued_at", input.issued_at);
    if (input.expires_at) form.append("expires_at", input.expires_at);
    return apiRequest<{ document: ComplianceDocument }>("/api/compliance", { method: "POST", body: form });
  },
  review: (id: string, status: ComplianceDocument["status"], notes?: string) =>
    apiRequest<{ document: ComplianceDocument }>(`/api/compliance/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    }),
};
