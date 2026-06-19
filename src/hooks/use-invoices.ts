import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft", issued: "Issued", partially_paid: "Partially paid",
  paid: "Paid", overdue: "Overdue", cancelled: "Cancelled",
};
export const INVOICE_STATUS_VARIANT: Record<InvoiceStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  issued: "bg-blue-500/10 text-blue-700",
  partially_paid: "bg-amber-500/10 text-amber-700",
  paid: "bg-emerald-500/10 text-emerald-700",
  overdue: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

export const useInvoices = () =>
  useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices").select("*, organizations(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const useInvoice = (id: string | undefined) =>
  useQuery({
    queryKey: ["invoice", id],
    enabled: !!id,
    queryFn: async () => {
      const [inv, items, pays] = await Promise.all([
        supabase.from("invoices").select("*, organizations(name)").eq("id", id!).maybeSingle(),
        supabase.from("invoice_items").select("*").eq("invoice_id", id!),
        supabase.from("payments").select("*").eq("invoice_id", id!).order("paid_at", { ascending: false }),
      ]);
      if (inv.error) throw inv.error;
      return { invoice: inv.data, items: items.data ?? [], payments: pays.data ?? [] };
    },
  });

export const useRecordPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { invoice_id: string; amount_cents: number; method: string; reference?: string }) => {
      const { error } = await supabase.rpc("record_payment", {
        _invoice_id: args.invoice_id, _amount_cents: args.amount_cents,
        _method: args.method, _reference: args.reference ?? null,
      });
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["invoice", v.invoice_id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};