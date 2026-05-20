import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, GitBranch, Users, Settings, LogOut, Zap, Menu, X, ChevronRight, Gauge, BookOpen } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Workflows", icon: GitBranch, to: "/admin/workflows" },
  { label: "Leads", icon: Users, to: "/admin/leads" },
  { label: "Speed", icon: Gauge, to: "/admin/speed" },
  { label: "Blog", icon: BookOpen, to: "/admin/blog" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/workflows": "Workflow Station",
  "/admin/leads": "Leads",
  "/admin/speed": "Speed Optimizer",
  "/admin/blog": "Blog",
  "/admin/settings": "Settings",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const pageTitle = pageTitles[location.pathname] ?? "Admin";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSignOut = async () => {
    const token = localStorage.getItem("admin_token");
    const baseURL = import.meta.env.VITE_BACKEND_URL || "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(`${baseURL}/api/auth/sign-out`, {
      method: "POST",
      credentials: "include",
      headers,
    });
    localStorage.removeItem("admin_token");
    toast.success("Signed out successfully");
    window.location.href = "/sign-in";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800">
        <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
          <div className="relative h-8 w-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600" />
            <div className="absolute inset-[2px] rounded-[6px] bg-gray-900 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 font-semibold tracking-tight">
            <span className="text-white">Momentum</span>
            <span className="text-gray-500 text-sm">.OS</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-purple-600/15 text-purple-300 border border-purple-500/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              )}
            >
              <item.icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-purple-400" : "text-gray-500 group-hover:text-gray-300")} />
              {item.label}
              {active ? <ChevronRight className="h-3 w-3 ml-auto text-purple-400/60" /> : null}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Kenny T</p>
            <p className="text-xs text-gray-500 truncate">kennyt@admin.com</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col bg-gray-900 border-r border-gray-800 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-gray-900 border-r border-gray-800 transition-transform duration-300 md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-60">
        {/* Top bar */}
        <header className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-white">{pageTitle}</h1>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">{today}</p>
          </div>
          {/* Mobile close button inside topbar when open */}
          {sidebarOpen ? (
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
