import { apiRequest } from "./client";
import type { Tender, TenderDocument, TenderItem, TenderStatus, TenderStatusEvent } from "@/hooks/use-tenders";

type TenderPayload = {
  title: string;
  buyer_name?: string | null;
  description?: string | null;
  submission_deadline?: string | null;
  value_cents?: number | null;
  status?: "draft" | "submitted";
  items?: Array<{ description: string; qty: number; uom: string }>;
};

export const tendersApi = {
  list: () => apiRequest<Tender[]>("/api/tenders"),
  get: (id: string) =>
    apiRequest<{
      tender: Tender | null;
      items: TenderItem[];
      docs: TenderDocument[];
      history: TenderStatusEvent[];
    }>(`/api/tenders/${id}`),
  create: (payload: TenderPayload) =>
    apiRequest<{ tender: Tender }>("/api/tenders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id: string, status: TenderStatus, note?: string) =>
    apiRequest<{ tender: Tender }>(`/api/tenders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note }),
    }),
  uploadDocuments: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((file) => form.append("documents", file));
    return apiRequest<{ docs: TenderDocument[] }>(`/api/tenders/${id}/documents`, {
      method: "POST",
      body: form,
    });
  },
};
