import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { CATEGORY_ICONS, PRODUCTS, type ProductCategory } from "@/data/products";

const FILTERS: ("All" | ProductCategory)[] = ["All", "Stationery", "Paper", "Toner & Ink", "Furniture", "Cleaning", "Technology", "Packaging"];

const Products = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items = useMemo(
    () => (filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter]
  );

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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <div
                key={p.name}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 text-5xl">
                  <span aria-hidden>{CATEGORY_ICONS[p.category]}</span>
                </div>
                <div className="flex flex-1 flex-col border-t border-border p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{p.category}</p>
                  <h3 className="mt-1.5 text-base font-bold text-primary">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.uom}</p>
                  <div className="mt-auto pt-4">
                    <Button asChild variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link to="/contact">Request Quote <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
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