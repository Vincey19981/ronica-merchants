import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Marquee = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("group relative overflow-hidden", className)}>
    <div className="flex w-max animate-marquee gap-12 [animation-play-state:running] group-hover:[animation-play-state:paused]">
      <div className="flex shrink-0 items-center gap-12">{children}</div>
      <div className="flex shrink-0 items-center gap-12" aria-hidden>
        {children}
      </div>
    </div>
  </div>
);