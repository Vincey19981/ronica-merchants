import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type InvoiceStatus = "draft" | "issued" | "partially_paid" | "paid" | "overdue" | "cancelled";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  issued: "Issued",
  partially_paid: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
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
    queryFn: async () => [],
  });

export const useInvoice = (id: string | undefined) =>
  useQuery({
    queryKey: ["invoice", id],
    enabled: !!id,
    queryFn: async () => ({ invoice: null, items: [], payments: [] }),
  });

export const useRecordPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { invoice_id: string; amount_cents: number; method: string; reference?: string }) => undefined,
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["invoice", v.invoice_id] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
