import { LayoutDashboard, Inbox, Package, FileText, LogOut, ClipboardList } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export type AdminSection = "overview" | "quotes" | "enquiries" | "products" | "tenders";

const items: { id: AdminSection; title: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", title: "Overview", icon: LayoutDashboard },
  { id: "quotes", title: "Quote Requests", icon: ClipboardList },
  { id: "enquiries", title: "Enquiries", icon: Inbox },
  { id: "products", title: "Products", icon: Package },
  { id: "tenders", title: "Tenders", icon: FileText },
];

interface Props {
  active: AdminSection;
  onSelect: (s: AdminSection) => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ active, onSelect, onLogout }: Props) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-bold text-accent-foreground">
            R
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-bold text-sidebar-foreground">Ronica Admin</p>
              <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                Operations
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={active === item.id}
                    onClick={() => onSelect(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sign out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};