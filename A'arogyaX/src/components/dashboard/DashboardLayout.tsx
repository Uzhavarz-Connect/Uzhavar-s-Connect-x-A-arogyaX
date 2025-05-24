import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RoleBadge } from "@/components/ui/role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  role: "doctor" | "patient" | "receptionist" | "warehouse" | "admin";
  navigation: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    current?: boolean;
  }[];
  notifications?: number;
}

export default function DashboardLayout({
  children,
  title,
  role,
  navigation,
  notifications = 0,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  // Get user name based on role
  const getUserName = () => {
    const nameByRole = {
      doctor: "Dr. Sarah Johnson",
      patient: "Michael Smith",
      receptionist: "Emily Parker",
      warehouse: "Robert Chen",
      admin: "Amanda Davis",
    };
    return nameByRole[role];
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const initialsMap = {
      doctor: "SJ",
      patient: "MS",
      receptionist: "EP",
      warehouse: "RC",
      admin: "AD",
    };
    return initialsMap[role];
  };

  // Map roles to colors
  const roleColors = {
    doctor: "bg-medical-blue",
    patient: "bg-medical-green",
    receptionist: "bg-medical-gold text-black",
    warehouse: "bg-gray-600",
    admin: "bg-medical-red",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/placeholder.svg"
                alt="HealthVerse Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-medical-blue">
                HealthVerse
              </span>
            </Link>
          </div>

          <div className="mt-4 px-4 flex items-center">
            <RoleBadge role={role} />
          </div>

          <div className="mt-5 flex-1 h-0 overflow-y-auto px-2">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isCurrent = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      isCurrent
                        ? `${roleColors[role]} text-white`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        isCurrent
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-4 flex-shrink-0 h-6 w-6"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/placeholder.svg"
                  alt="HealthVerse Logo"
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-medical-blue">
                  HealthVerse
                </span>
              </Link>
            </div>

            <div className="mt-4 px-4 flex items-center">
              <RoleBadge role={role} />
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isCurrent = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      isCurrent
                        ? `${roleColors[role]} text-white`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={cn(
                        isCurrent
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="border-b border-gray-200 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {title}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </div>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage alt={getUserName()} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getUserName()}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {(() => {
                            switch (role) {
                              case "doctor":
                                return "Medical Doctor";
                              case "patient":
                                return "Patient";
                              case "receptionist":
                                return "Reception Staff";
                              case "warehouse":
                                return "Warehouse Manager";
                              case "admin":
                                return "Administrator";
                              default:
                                return "";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings"
                        className="cursor-pointer w-full flex items-center"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button
                        className="cursor-pointer w-full flex items-center text-red-500"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Main content */}
            <div className="py-6">
              {/* Breadcrumbs */}
              <nav className="hidden md:flex mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <Link
                        to="/"
                        className="text-gray-400 hover:text-gray-500 text-sm font-medium"
                      >
                        Home
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {title}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Page content */}
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
