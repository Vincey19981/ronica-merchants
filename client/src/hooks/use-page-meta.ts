import { useEffect } from "react";

export const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = `${title} | Ronica Merchants Limited`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
};
