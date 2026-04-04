import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldX } from "lucide-react";

const Records = () => {
  const { records, getCustomerById, searchRecords } = useWorkshop();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const displayed = query ? searchRecords(query) : records;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("maintenanceRecords")}</h2>
      <Input placeholder={t("searchRecordsPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-md" />

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-sm text-muted-foreground">
              <th className="text-right p-3">{t("maintenanceId")}</th>
              <th className="text-right p-3">{t("device")}</th>
              <th className="text-right p-3">{t("customer")}</th>
              <th className="text-right p-3">{t("date")}</th>
              <th className="text-right p-3">{t("maintenanceStatus")}</th>
              <th className="text-right p-3">{t("paymentStatus")}</th>
              <th className="text-right p-3">{t("warrantyStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((r) => {
              const customer = getCustomerById(r.customerId);
              const total = r.spareParts.reduce((s, p) => s + p.price, 0) + r.laborFee;
              return (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/maintenance/${r.id}`)}
                >
                  <td className="p-3 font-mono text-sm">{r.maintenanceId}</td>
                  <td className="p-3">{r.itemName}</td>
                  <td className="p-3">{customer?.name}</td>
                  <td className="p-3 text-sm text-muted-foreground">{r.receivedDate}</td>
                  <td className="p-3">
                    <Badge className={r.isCompleted
                      ? "bg-green-500/15 text-green-600 border-green-500/30"
                      : "bg-red-500/15 text-red-600 border-red-500/30"
                    }>
                      {r.isCompleted ? t("completed") : t("pending")}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={r.isPaid
                      ? "bg-green-500/15 text-green-600 border-green-500/30"
                      : "bg-red-500/15 text-red-600 border-red-500/30"
                    }>
                      {r.isPaid ? t("paid") : `${t("unpaid")} - ${total} ${t("sar")}`}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={r.isUnderWarranty
                      ? "bg-green-500/15 text-green-600 border-green-500/30"
                      : "bg-red-500/15 text-red-600 border-red-500/30"
                    }>
                      {r.isUnderWarranty ? <><ShieldCheck className="w-3 h-3 ml-1" /> {t("yes")}</> : <><ShieldX className="w-3 h-3 ml-1" /> {t("no")}</>}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {displayed.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">{t("noResults")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Records;
