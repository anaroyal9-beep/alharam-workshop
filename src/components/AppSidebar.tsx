import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpg";

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
    <aside className="w-72 min-h-screen bg-sidebar flex flex-col shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="شعار ورشة الهرم المثالي"
            className="w-14 h-14 rounded-xl object-contain bg-white p-1 shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-white leading-snug">
              ورشة الهرم المثالي
            </h1>
            <p className="text-xs font-bold text-white/70 mt-0.5 leading-tight">
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
                  ? "bg-sidebar-primary text-white shadow-md"
                  : "text-white/80 hover:bg-sidebar-accent hover:text-white"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-white/40 text-center font-bold">
        © 2026 ورشة الهرم المثالي للآلات والمعدات
      </div>
    </aside>
  );
};

export default AppSidebar;
