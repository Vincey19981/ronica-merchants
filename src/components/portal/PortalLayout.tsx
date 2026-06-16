import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortalSidebar } from "./PortalSidebar";

export const PortalLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full bg-muted/30">
      <PortalSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger />
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            ← Back to website
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  </SidebarProvider>
);