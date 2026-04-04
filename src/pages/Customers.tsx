import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const { customers, searchCustomers, getRecordsByCustomer } = useWorkshop();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const displayed = query ? searchCustomers(query) : customers;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("customers")}</h2>
      <Input placeholder={t("searchCustomersPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-md" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((c) => {
          const recs = getRecordsByCustomer(c.id);
          return (
            <div
              key={c.id}
              className="bg-card rounded-lg shadow-sm border border-border p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/customers/${c.id}`)}
            >
              <p className="font-bold text-lg">{c.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{c.phone}</p>
              {c.company && <p className="text-sm text-muted-foreground">{c.company}</p>}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">{recs.length} {t("maintenanceOrders")}</p>
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">{t("noResults")}</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
