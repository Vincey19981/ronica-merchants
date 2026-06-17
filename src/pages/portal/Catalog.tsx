import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, formatPrice, useContractPrice } from "@/hooks/use-products";
import { useCart } from "@/lib/cart";
import { CATEGORY_THEME, type ProductCategory } from "@/data/products";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const CATEGORIES: ProductCategory[] = [
  "Stationery", "Paper", "Toner & Ink", "Furniture", "Cleaning", "Technology", "Packaging",
];

const PortalCatalog = () => {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const { data: products = [], isLoading } = useProducts(category === "all" ? null : category);
  const cart = useCart();
  const { profile } = useAuth();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Catalog</h1>
          <p className="text-sm text-muted-foreground">
            {profile?.org_id
              ? "Showing your contract prices where available."
              : "Sign your organisation into a contract to see negotiated pricing."}
          </p>
        </div>
        <Button asChild variant="gold">
          <Link to="/portal/cart">
            <ShoppingCart className="mr-2 h-4 w-4" /> Cart ({cart.count})
          </Link>
        </Button>
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or SKU…"
            className="pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory | "all")}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Your price</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <CatalogRow key={p.id} product={p} addToCart={cart.add} hasOrg={!!profile?.org_id} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No products match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CatalogRow = ({
  product,
  addToCart,
  hasOrg,
}: {
  product: { id: string; sku: string; name: string; category: ProductCategory; uom: string; list_price_cents: number | null };
  addToCart: ReturnType<typeof useCart>["add"];
  hasOrg: boolean;
}) => {
  const theme = CATEGORY_THEME[product.category];
  const { data: contractPrice } = useContractPrice(product.id, 1, hasOrg);
  const [qty, setQty] = useState(1);
  const price = contractPrice ?? product.list_price_cents;

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
      <td className="px-4 py-3">
        <div className="font-medium text-foreground">{product.name}</div>
        <div className="text-xs text-muted-foreground">{product.uom}</div>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: theme.tint }}>
          {product.category}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {price != null ? (
          <div>
            <div className="font-bold text-primary">{formatPrice(price)}</div>
            {contractPrice != null && (
              <div className="text-[10px] uppercase tracking-wider text-accent">Contract</div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Request quote</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center rounded-md border border-input">
            <button type="button" className="p-1.5 hover:bg-muted" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button type="button" className="p-1.5 hover:bg-muted" onClick={() => setQty(qty + 1)} aria-label="Increase">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <Button
            size="sm"
            variant="gold"
            onClick={() => {
              addToCart({
                product_id: product.id,
                sku: product.sku,
                name: product.name,
                uom: product.uom,
                unit_price_cents: price,
                qty,
              });
              toast({ title: "Added to cart", description: `${qty} × ${product.name}`, duration: 2000 });
            }}
          >
            <Check className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default PortalCatalog;