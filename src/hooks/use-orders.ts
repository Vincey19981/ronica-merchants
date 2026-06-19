import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { Database } from "@/integrations/supabase/types";
import type { CartItem } from "@/lib/cart";

export type OrderStatus = Database["public"]["Enums"]["order_status"];

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "draft","submitted","confirmed","picking","packed","shipped","in_transit","delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Draft", submitted: "Submitted", confirmed: "Confirmed", picking: "Picking",
  packed: "Packed", shipped: "Shipped", in_transit: "In transit", delivered: "Delivered",
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

export const useOrders = (opts?: { adminAll?: boolean }) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ["orders", opts?.adminAll && isAdmin ? "all" : "mine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, organizations(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useOrder = (id: string | undefined) =>
  useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const [o, items, ship] = await Promise.all([
        supabase.from("orders").select("*, organizations(name)").eq("id", id!).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", id!),
        supabase.from("shipments").select("*").eq("order_id", id!).order("created_at"),
      ]);
      if (o.error) throw o.error;
      return { order: o.data, items: items.data ?? [], shipments: ship.data ?? [] };
    },
  });

export const useCheckout = () => {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { items: CartItem[]; po_number?: string; notes?: string; shipping_address?: any }) => {
      if (!profile?.org_id) throw new Error("Your account is not linked to an organization yet.");
      const subtotal = args.items.reduce((s, i) => s + (i.unit_price_cents ?? 0) * i.qty, 0);
      const { data: numData, error: numErr } = await supabase.rpc("next_order_number");
      if (numErr) throw numErr;
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          org_id: profile.org_id,
          order_number: numData as string,
          status: "submitted",
          subtotal_cents: subtotal,
          tax_cents: 0,
          total_cents: subtotal,
          po_number: args.po_number || null,
          notes: args.notes || null,
          shipping_address: args.shipping_address ?? null,
          placed_by: user?.id ?? null,
          placed_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      const { error: iErr } = await supabase.from("order_items").insert(
        args.items.map((i) => ({
          order_id: order.id,
          product_id: i.product_id,
          description: `${i.name} (${i.sku})`,
          qty: i.qty,
          uom: i.uom,
          unit_price_cents: i.unit_price_cents ?? 0,
          line_total_cents: (i.unit_price_cents ?? 0) * i.qty,
        })),
      );
      if (iErr) throw iErr;
      await supabase.rpc("log_audit", {
        _action: "order.placed", _resource_type: "order", _resource_id: order.id,
        _before: null, _after: { total_cents: subtotal, items: args.items.length },
      });
      qc.invalidateQueries({ queryKey: ["orders"] });
      return order;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
      await supabase.rpc("log_audit", {
        _action: "order.status_changed", _resource_type: "order", _resource_id: id,
        _before: null, _after: { status },
      });
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", v.id] });
    },
  });
};

export const useCreateInvoiceFromOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order_id: string) => {
      const { data, error } = await supabase.rpc("create_invoice_from_order", { _order_id: order_id });
      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useCreateShipment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { order_id: string; carrier?: string; tracking_number?: string }) => {
      const { error } = await supabase.from("shipments").insert({
        order_id: args.order_id, carrier: args.carrier || null,
        tracking_number: args.tracking_number || null, status: "shipped", shipped_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["order", v.order_id] }),
  });
};