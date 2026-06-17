import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Package,
  Receipt,
  LifeBuoy,
  FolderArchive,
  Building2,
  Users,
  ShieldCheck,
  LogOut,
  UserCircle,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
import { useAuth, type AppRole } from "@/lib/auth";

type Item = { title: string; url: string; icon: typeof LayoutDashboard; roles?: AppRole[] };

const portalItems: Item[] = [
  { title: "Dashboard", url: "/portal", icon: LayoutDashboard },
  { title: "Catalog", url: "/portal/catalog", icon: Package },
  { title: "Cart", url: "/portal/cart", icon: ShoppingCart },
  { title: "Tenders", url: "/portal/tenders", icon: FileText, roles: ["procurement_officer"] },
  { title: "Orders", url: "/portal/orders", icon: ShoppingCart, roles: ["procurement_officer"] },
  { title: "Invoices", url: "/portal/invoices", icon: Receipt, roles: ["finance"] },
  { title: "IT Tickets", url: "/portal/tickets", icon: LifeBuoy, roles: ["it_manager"] },
  { title: "Documents", url: "/portal/documents", icon: FolderArchive },
];

const adminItems: Item[] = [
  { title: "Operations", url: "/admin", icon: ShieldCheck },
  { title: "Organizations", url: "/admin/organizations", icon: Building2 },
  { title: "Users & Roles", url: "/admin/users", icon: Users },
];

export const PortalSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { profile, roles, isAdmin, signOut } = useAuth();

  const visible = portalItems.filter((i) => !i.roles || isAdmin || i.roles.some((r) => roles.includes(r)));
  const isActive = (url: string) => (url === "/portal" ? pathname === "/portal" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-bold text-accent-foreground">
            R
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-bold text-sidebar-foreground">Ronica Portal</p>
              <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                {isAdmin ? "Administrator" : "Client workspace"}
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
              {visible.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === "/portal"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Administration</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink to={item.url} end={item.url === "/admin"}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Account</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/portal/profile")} tooltip="Profile & Security">
                  <NavLink to="/portal/profile">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile & Security</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-2 px-2 text-xs text-sidebar-foreground/70">
            <p className="truncate font-medium text-sidebar-foreground">{profile?.full_name || profile?.email}</p>
            <p className="truncate">{profile?.email}</p>
          </div>
        )}
        <Button
          onClick={() => void signOut()}
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