import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, Search, Plus, BookOpen, UserCog } from "lucide-react";
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
    { to: "/search", label: t("search"), icon: Search },
  ];

  return (
    <aside className="w-72 min-h-screen bg-sidebar flex flex-col shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-[16px]">
          <img
            alt="شعار ورشة الهرم المثالي"
            className="w-14 h-14 p-1 shrink-0 bg-transparent object-cover py-px px-[4px] rounded-none text-3xl" src="/lovable-uploads/f431f402-3732-47af-a54a-4e8e1e420f90.png" />
          
          <div className="min-w-0">
            <h1 className="text-white leading-snug font-sans text-sm font-bold text-left">
              ​AL HARAM WORKSHOP   
            </h1>
            <p className="text-white/70 mt-0.5 leading-tight font-serif text-sm font-normal">
              ​ورشة الهرم المثالى للصيانة   
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