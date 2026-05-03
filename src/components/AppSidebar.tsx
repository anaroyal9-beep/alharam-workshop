import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, Search, Plus, BookOpen, UserCog, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const AppSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const links = [
    { to: "/", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/maintenance/new", label: t("newMaintenance"), icon: Plus },
    { to: "/records", label: t("maintenanceRecords"), icon: Wrench },
    { to: "/customers", label: t("customers"), icon: Users },
    { to: "/daily-ledger", label: t("dailyLedger"), icon: BookOpen },
    { to: "/technicians", label: t("technicians"), icon: UserCog },
    { to: "/statistics", label: t("statistics"), icon: BarChart3 },
    { to: "/reports", label: t("reports"), icon: FileText },
    { to: "/search", label: t("search"), icon: Search },
  ];

  return (
    <aside className="w-72 min-h-screen bg-sidebar flex flex-col shrink-0">
      <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 mb-4 shadow-lg backdrop-blur-sm">
          <img
            alt="شعار ورشة الهرم المثالي"
            src="/lovable-uploads/f431f402-2a1d-4b58-8f0e-258c4285db2d.png"
            className="w-24 h-24 object-contain"
          />
        </div>
        <h1 className="text-white text-[15px] font-extrabold tracking-[0.08em] leading-tight">
          AL HARAM PERFECT WORKSHOP
        </h1>
        <p className="text-white/50 mt-1.5 text-[11px] italic font-medium tracking-wide">
          For Machinery & Equipment
        </p>
        <p className="text-white/40 mt-1 text-[11px] font-bold">
          ورشة الهرم المثالي للآلات والمعدات
        </p>
      </div>
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <nav className="flex-1 p-3 pt-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                isActive ?
                "bg-sidebar-primary text-white shadow-md" :
                "text-white/80 hover:bg-sidebar-accent hover:text-white"
              )}>
              
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>);

        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border text-xs text-white/40 text-center font-bold">
        © 2026 ورشة الهرم المثالي للآلات والمعدات
      </div>
    </aside>);

};

export default AppSidebar;