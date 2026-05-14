import { Link } from "react-router-dom";
import { ArrowRight, PenLine, FileText, Printer, Armchair, SprayCan, Laptop, PackageOpen, type LucideIcon } from "lucide-react";
import { CATEGORY_THEME, type Product } from "@/data/products";

const ICON_MAP: Record<string, LucideIcon> = {
  PenLine, FileText, Printer, Armchair, SprayCan, Laptop, PackageOpen,
};

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const theme = CATEGORY_THEME[product.category];
  const Icon = ICON_MAP[theme.iconName] ?? FileText;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl bg-card transition-all duration-[250ms] ease-out animate-fade-up"
      style={{
        animationDelay: `${(index % 8) * 60}ms`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = "hsl(var(--accent))";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Colored tint band */}
      <div
        className="flex h-[140px] items-center justify-center"
        style={{ backgroundColor: theme.tint }}
      >
        <Icon
          className="h-12 w-12 text-primary transition-transform duration-200 group-hover:scale-110"
          strokeWidth={1.5}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-foreground">
          {product.category}
        </span>
        <h3 className="mt-3 text-[17px] font-semibold leading-snug text-primary">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{product.uom}</p>

        <div className="mt-auto pt-5">
          <Link
            to={`/request-quote?product=${encodeURIComponent(product.name)}`}
            className="group/btn relative flex h-10 w-full items-center justify-center overflow-hidden rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
          >
            <span className="flex items-center gap-1.5 transition-transform duration-200 group-hover/btn:translate-x-1">
              <ArrowRight className="h-4 w-4 -translate-x-3 opacity-0 transition-all duration-200 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
              Request Quote
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};