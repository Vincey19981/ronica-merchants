import { ReactNode } from "react";

export const PageIntro = ({ eyebrow, title, children, image }: { eyebrow: string; title: string; children?: ReactNode; image?: string }) => (
  <section className="relative overflow-hidden bg-primary text-primary-foreground">
    {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
    <div className="hero-lines absolute inset-0" aria-hidden />
    <div className="container-wide relative py-20 md:py-28">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] md:text-6xl">{title}</h1>
      {children && <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/75">{children}</p>}
    </div>
  </section>
);
