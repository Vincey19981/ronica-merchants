import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TenderStatus = Database["public"]["Enums"]["tender_status"];
export type Tender = Database["public"]["Tables"]["tenders"]["Row"];
export type TenderItem = Database["public"]["Tables"]["tender_items"]["Row"];
export type TenderDocument = Database["public"]["Tables"]["tender_documents"]["Row"];
export type TenderStatusEvent = Database["public"]["Tables"]["tender_status_history"]["Row"];

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
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const useTender = (id: string | undefined) =>
  useQuery({
    enabled: !!id,
    queryKey: ["tender", id],
    queryFn: async () => {
      const [tender, items, docs, history] = await Promise.all([
        supabase.from("tenders").select("*").eq("id", id!).maybeSingle(),
        supabase.from("tender_items").select("*").eq("tender_id", id!).order("created_at"),
        supabase.from("tender_documents").select("*").eq("tender_id", id!).order("created_at"),
        supabase
          .from("tender_status_history")
          .select("*")
          .eq("tender_id", id!)
          .order("created_at", { ascending: true }),
      ]);
      if (tender.error) throw tender.error;
      return {
        tender: tender.data,
        items: (items.data ?? []) as TenderItem[],
        docs: (docs.data ?? []) as TenderDocument[],
        history: (history.data ?? []) as TenderStatusEvent[],
      };
    },
  });

export const useSubmitTender = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tender: Tender) => {
      const { error } = await supabase
        .from("tenders")
        .update({ status: "submitted" })
        .eq("id", tender.id);
      if (error) throw error;
      // best-effort history entry (client only logs draft→submitted)
      await supabase.from("tender_status_history").insert({
        tender_id: tender.id,
        from_status: tender.status,
        to_status: "submitted",
        note: "Submitted by client",
      });
    },
    onSuccess: (_d, t) => {
      qc.invalidateQueries({ queryKey: ["tender", t.id] });
      qc.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const docSignedUrl = async (storage_path: string) => {
  const { data, error } = await supabase.storage
    .from("tender-docs")
    .createSignedUrl(storage_path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
};

export const generateTenderReference = () =>
  `TND-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;