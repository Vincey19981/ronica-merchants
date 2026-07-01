import { useQuery } from "@tanstack/react-query";
import { PRODUCTS, type ProductCategory } from "@/data/products";

export interface DbProduct {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  uom: string;
  list_price_cents: number | null;
  active: boolean;
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const catalog: DbProduct[] = PRODUCTS.map((product, index) => ({
  id: `${slug(product.category)}-${index + 1}`,
  sku: `${product.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, "0")}`,
  name: product.name,
  category: product.category,
  uom: product.uom,
  list_price_cents: null,
  active: true,
}));

export const useProducts = (category?: ProductCategory | null) =>
  useQuery({
    queryKey: ["products", category ?? "all"],
    queryFn: async () => catalog.filter((product) => !category || product.category === category),
    staleTime: 5 * 60 * 1000,
  });

export const useContractPrice = (productId: string | undefined, _qty = 1, enabled = true) =>
  useQuery({
    queryKey: ["contract-price", productId],
    enabled: enabled && !!productId,
    queryFn: async () => null as number | null,
    staleTime: 2 * 60 * 1000,
  });

export const formatPrice = (cents: number | null | undefined, currency = "KSh") =>
  cents == null ? null : `${currency} ${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
