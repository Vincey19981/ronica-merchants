import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "@/lib/cart";

export type OrderStatus =
  | "draft"
  | "submitted"
  | "confirmed"
  | "picking"
  | "packed"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "draft",
  "submitted",
  "confirmed",
  "picking",
  "packed",
  "shipped",
  "in_transit",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  confirmed: "Confirmed",
  picking: "Picking",
  packed: "Packed",
  shipped: "Shipped",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_VARIANT: Record<OrderStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-blue-500/10 text-blue-700",
  confirmed: "bg-indigo-500/10 text-indigo-700",
  picking: "bg-amber-500/10 text-amber-700",
  packed: "bg-amber-500/10 text-amber-700",
  shipped: "bg-purple-500/10 text-purple-700",
  in_transit: "bg-purple-500/10 text-purple-700",
  delivered: "bg-emerald-500/10 text-emerald-700",
  cancelled: "bg-destructive/10 text-destructive",
};

export const useOrders = (_opts?: { adminAll?: boolean }) =>
  useQuery({
    queryKey: ["orders", "mern-pending"],
    queryFn: async () => [],
  });

export const useOrder = (id: string | undefined) =>
  useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => ({ order: null, items: [], shipments: [] }),
  });

export const useCheckout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { items: CartItem[]; po_number?: string; notes?: string; shipping_address?: unknown }) => {
      throw new Error("Order checkout needs the next MERN backend module before production use.");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { id: string; status: OrderStatus }) => undefined,
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", v.id] });
    },
  });
};

export const useCreateInvoiceFromOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_order_id: string) => {
      throw new Error("Invoice generation needs the next MERN backend module before production use.");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
};

export const useCreateShipment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_args: { order_id: string; carrier?: string; tracking_number?: string }) => undefined,
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["order", v.order_id] }),
  });
};
