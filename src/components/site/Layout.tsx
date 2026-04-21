import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomCTA } from "./BottomCTA";

export const Layout = ({ children, hideBottomCta = false }: { children: ReactNode; hideBottomCta?: boolean }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <Header />
    <main className="flex-1">{children}</main>
    {!hideBottomCta && <BottomCTA />}
    <Footer />
  </div>
);