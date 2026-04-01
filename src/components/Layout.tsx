import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const Layout = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top header with language toggle */}
        <header className="h-12 flex items-center justify-end px-4 border-b border-border bg-card print:hidden">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
