export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) => (
  <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && (
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
    )}
    <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl gold-underline">
      {title}
    </h2>
    {description && (
      <p className="mt-6 text-base text-muted-foreground sm:text-lg">{description}</p>
    )}
  </div>
);