import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, Search, Plus, ImageIcon } from "lucide-react";
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
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <div className="w-11 h-11 rounded-lg bg-sidebar-accent flex items-center justify-center border border-sidebar-border shrink-0">
            <ImageIcon className="w-5 h-5 text-sidebar-foreground/50" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-sidebar-primary leading-tight">
              ورشة الهرم المثالي
            </h1>
            <p className="text-[11px] text-sidebar-foreground/60 mt-0.5 leading-tight">
              للآلات والمعدات
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/40 text-center">
        © 2026 ورشة الهرم المثالي للآلات والمعدات
      </div>
    </aside>
  );
};

export default AppSidebar;
