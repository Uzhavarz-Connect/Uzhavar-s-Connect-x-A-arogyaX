
import { NavLink, useLocation } from "react-router-dom";
import { QrCode, Ticket, UserCheck, Settings } from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Settings },
  { title: "QR Scanner", url: "/scanner", icon: QrCode },
  { title: "Priority Tickets", url: "/admin", icon: Ticket },
  { title: "Generate QR", url: "/generate", icon: UserCheck },
];

export const Sidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupExpanded = navItems.some((i) => isActive(i.url));

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-medical-primary text-white font-medium rounded-md"
      : "text-gray-600 hover:bg-medical-light hover:text-medical-primary rounded-md";

  return (
    <SidebarComponent
      className={`bg-white border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-medical-primary">MediQueue</h1>
        )}
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center py-2 px-3 ${getNavClass({ isActive })}`
                      }
                    >
                      <item.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};
