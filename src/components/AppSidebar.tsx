import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, Search, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/maintenance/new", label: "طلب صيانة جديد", icon: Plus },
  { to: "/records", label: "سجلات الصيانة", icon: Wrench },
  { to: "/customers", label: "العملاء", icon: Users },
  { to: "/search", label: "البحث المتقدم", icon: Search },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-primary">ورشة الهرم</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">نظام إدارة الصيانة</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50 text-center">
        © 2026 ورشة الهرم
      </div>
    </aside>
  );
};

export default AppSidebar;
