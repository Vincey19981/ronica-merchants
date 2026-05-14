import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import {
  PRODUCTS,
  CATEGORY_THEME,
  type ProductCategory,
  type Product,
} from "@/data/products";
import {
  PenLine,
  FileText as FT,
  Printer,
  Armchair,
  SprayCan,
  Laptop,
  PackageOpen,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ORDER: ProductCategory[] = [
  "Stationery",
  "Paper",
  "Toner & Ink",
  "Furniture",
  "Cleaning",
  "Technology",
  "Packaging",
];

const CATEGORY_BLURB: Record<ProductCategory, string> = {
  Stationery: "Pens, files, staplers, envelopes — daily-use essentials for every desk.",
  Paper: "A4/A3 reams, NCR, notebooks, receipt and invoice books.",
  "Toner & Ink": "OEM-equivalent toners and inkjet cartridges for HP, Canon, Epson and more.",
  Furniture: "Executive chairs, desks, conference tables, filing cabinets.",
  Cleaning: "Sanitisers, mops, dispensers, washroom and breakroom care.",
  Technology: "Printers, USB drives, peripherals, cables and accessories.",
  Packaging: "Tapes, cartons, mailing bags, labels and dispatch supplies.",
};

const ICONS: Record<string, LucideIcon> = {
  PenLine, FileText: FT, Printer, Armchair, SprayCan, Laptop, PackageOpen,
};

const Products = () => {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category") as ProductCategory | null;
  const [query, setQuery] = useState("");

  // Counts per category (for landing cards)
  const counts = useMemo(() => {
    const m = new Map<ProductCategory, number>();
    for (const p of PRODUCTS) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return m;
  }, []);

  // ─── LANDING (no category selected) ────────────────────────
  if (!activeCategory) {
    return (
      <Layout>
        <PageHero eyebrow="Product Catalogue" title="Browse by category.">
          We supply seven categories under a single LPO. Pick a category to see
          available items, or send us your BOQ and we'll quote it line by line.
        </PageHero>

        <section className="bg-background py-14 sm:py-20">
          <div className="container-wide">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent-soft/40 p-5">
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 shrink-0 text-accent" />
                <div>
                  <p className="font-bold text-primary">Have a full BOQ ready?</p>
                  <p className="text-sm text-muted-foreground">
                    Skip browsing — submit a structured quote request with line items and your BOQ attached.
                  </p>
                </div>
              </div>
              <Button asChild variant="gold" size="sm">
                <Link to="/request-quote">Request a Quote</Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORY_ORDER.map((cat) => {
                const theme = CATEGORY_THEME[cat];
                const Icon = ICONS[theme.iconName] ?? FT;
                return (
                  <article
                    key={cat}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-elevated)]"
                  >
                    <div
                      className="flex h-36 items-center justify-center"
                      style={{ backgroundColor: theme.tint }}
                    >
                      <Icon className="h-14 w-14 text-primary" strokeWidth={1.4} />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-xl font-bold text-primary">{cat}</h2>
                        <span className="rounded-full bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {counts.get(cat) ?? 0} items
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{CATEGORY_BLURB[cat]}</p>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setParams({ category: cat })}
                        >
                          Browse items <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                        <Button asChild variant="gold" size="sm">
                          <Link to={`/request-quote?category=${encodeURIComponent(cat)}`}>
                            Request Quote
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="mt-10 text-center text-xs text-muted-foreground">
              Prices are not displayed publicly. We provide formal quotations only — to protect
              tender margins and ensure you get the best applicable bulk rate.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  // ─── CATEGORY DETAIL (drill-in) ────────────────────────────
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (p.category !== activeCategory) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.uom.toLowerCase().includes(q);
    });
  }, [activeCategory, query]);

  return (
    <Layout>
      <PageHero eyebrow={`Catalogue · ${activeCategory}`} title={`${activeCategory}.`}>
        {CATEGORY_BLURB[activeCategory]}
      </PageHero>

      <section className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
        <div className="container-wide flex flex-wrap items-center gap-3 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setParams({});
              setQuery("");
            }}
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> All categories
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search within ${activeCategory}…`}
              aria-label="Search products"
              className="h-10 w-full min-w-[260px] rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-80"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
          <Button asChild variant="gold" size="sm">
            <Link to={`/request-quote?category=${encodeURIComponent(activeCategory)}`}>
              Request Quote
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container-wide">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-semibold text-primary">No items match your search.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different keyword, or{" "}
                <Link to="/request-quote" className="font-semibold text-accent hover:underline">
                  send us your quote request
                </Link>{" "}
                — we likely stock it.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p, i) => (
                <ProductCard key={p.name} product={p} index={i} />
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Prices are not displayed publicly. We provide formal quotations only.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Products;