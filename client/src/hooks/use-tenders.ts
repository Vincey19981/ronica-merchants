import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api/client";
import { tendersApi } from "@/lib/api/tenders";

export type TenderStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "clarification_requested"
  | "awarded"
  | "declined"
  | "closed";

export type Tender = {
  id: string;
  org_id: string;
  reference: string;
  title: string;
  buyer_name: string | null;
  description: string | null;
  submission_deadline: string | null;
  value_cents: number | null;
  status: TenderStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TenderItem = {
  id: string;
  description: string;
  qty: number;
  uom: string;
  created_at?: string | null;
};

export type TenderDocument = {
  id: string;
  tender_id: string;
  doc_type: string;
  file_name: string;
  storage_path: string;
  size_bytes: number | null;
  uploaded_by: string | null;
  download_url: string;
  created_at?: string | null;
};

export type TenderStatusEvent = {
  id: string;
  from_status: TenderStatus | null;
  to_status: TenderStatus;
  note: string | null;
  changed_by: string | null;
  created_at: string | null;
};

export const STATUS_LABELS: Record<TenderStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  clarification_requested: "Clarification Requested",
  awarded: "Awarded",
  declined: "Declined",
  closed: "Closed",
};

export const STATUS_TONE: Record<TenderStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-amber-100 text-amber-900",
  clarification_requested: "bg-orange-100 text-orange-900",
  awarded: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  closed: "bg-zinc-200 text-zinc-800",
};

export const useTenders = () =>
  useQuery({
    queryKey: ["tenders"],
    queryFn: tendersApi.list,
  });

export const useTender = (id: string | undefined) =>
  useQuery({
    enabled: !!id,
    queryKey: ["tender", id],
    queryFn: () => tendersApi.get(id!),
  });

export const useSubmitTender = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tender: Tender) => {
      await tendersApi.updateStatus(tender.id, "submitted", "Submitted by client");
    },
    onSuccess: (_d, t) => {
      qc.invalidateQueries({ queryKey: ["tender", t.id] });
      qc.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const docSignedUrl = async (downloadPath: string) => apiUrl(downloadPath);

export const generateTenderReference = () =>
  `TND-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
