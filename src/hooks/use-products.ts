import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProductCategory } from "@/data/products";

export interface DbProduct {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  uom: string;
  list_price_cents: number | null;
  active: boolean;
}

export const useProducts = (category?: ProductCategory | null) =>
  useQuery({
    queryKey: ["products", category ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("id, sku, name, category, uom, list_price_cents, active")
        .eq("active", true)
        .order("category", { ascending: true })
        .order("sku", { ascending: true });
      if (category) q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as DbProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useContractPrice = (productId: string | undefined, qty = 1, enabled = true) =>
  useQuery({
    queryKey: ["contract-price", productId, qty],
    enabled: enabled && !!productId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("resolve_contract_price", {
        _product_id: productId!,
        _qty: qty,
      });
      if (error) throw error;
      return (data as number | null) ?? null;
    },
    staleTime: 2 * 60 * 1000,
  });

export const formatPrice = (cents: number | null | undefined, currency = "KSh") =>
  cents == null ? null : `${currency} ${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;