import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, FileText, Search, Library, FolderOpen, Settings, HelpCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "@/assets/lizbee-logo.png";

const tools = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summariser", url: "/meetings", icon: FileText },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "Templates", url: "/templates", icon: Library },
  { title: "Documents", url: "/documents", icon: FolderOpen },
];

const misc = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => (p === "/" ? currentPath === "/" : currentPath.startsWith(p));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <img src={logo} alt="LizBee logo" width={36} height={36} className="rounded-xl bg-cream" />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="font-display text-lg font-semibold leading-none">LizBee 🐝</div>
            <div className="mt-0.5 truncate text-[11px] text-muted-foreground">Where cute meets clever</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {misc.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-3 group-data-[collapsible=icon]:hidden">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          🐝 Always buzzing. Always right. Review AI output before important decisions.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
