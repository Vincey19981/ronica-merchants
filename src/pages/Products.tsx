import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS, type ProductCategory, type Product } from "@/data/products";

const FILTERS: ("All" | ProductCategory)[] = ["All", "Stationery", "Paper", "Toner & Ink", "Furniture", "Cleaning", "Technology", "Packaging"];
const CATEGORY_ORDER: ProductCategory[] = ["Stationery", "Paper", "Toner & Ink", "Furniture", "Cleaning", "Technology", "Packaging"];

const Products = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const grouped = useMemo(() => {
    const source = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
    const map = new Map<ProductCategory, Product[]>();
    for (const p of source) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return CATEGORY_ORDER
      .filter((c) => map.has(c))
      .map((c) => ({ category: c, items: map.get(c)! }));
  }, [filter]);

  return (
    <Layout>
      <PageHero eyebrow="Product Catalogue" title="Office products for every tender, every BOQ.">
        Browse our core supply range. Pricing is provided only on formal quotation —
        send us your BOQ and we'll respond within 24 hours.
      </PageHero>

      <section className="bg-surface border-b border-border">
        <div className="container-wide flex gap-2 overflow-x-auto py-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container-wide">
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-accent/30 bg-accent-soft/40 p-5">
            <FileText className="h-6 w-6 shrink-0 text-accent" />
            <div className="flex-1">
              <p className="font-bold text-primary">Need a full BOQ priced?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send us your tender requirements and we'll respond with a formal,
                line-by-line quotation within 24 business hours.
              </p>
            </div>
            <Button asChild variant="gold" size="sm">
              <Link to="/contact">Submit BOQ</Link>
            </Button>
          </div>

          <div className="space-y-14">
            {grouped.map(({ category, items }) => (
              <div key={category} id={category.toLowerCase().replace(/\s+/g, "-")}>
                <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-accent/40 pb-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                      Category
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
                      {category}
                      <span className="text-accent">.</span>
                    </h2>
                  </div>
                  <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((p, i) => (
                    <ProductCard key={p.name} product={p} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Prices are not displayed publicly. We provide formal quotations only — to protect
            tender margins and ensure you get the best applicable bulk rate.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Products;