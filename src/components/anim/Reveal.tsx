import { ReactNode, CSSProperties } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

export const Reveal = ({ children, delay = 0, className, as: Tag = "div" }: Props) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
  };
  return (
    <Tag
      ref={ref as never}
      style={style}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
};