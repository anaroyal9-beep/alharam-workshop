import { useWorkshop } from "@/context/WorkshopContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, BanknoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Records = () => {
  const { records, getCustomerById, searchRecords } = useWorkshop();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const displayed = query ? searchRecords(query) : records;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">سجلات الصيانة</h2>
      <Input placeholder="ابحث برقم الصيانة، اسم الجهاز، أو اسم العميل..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-md" />

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-sm text-muted-foreground">
              <th className="text-right p-3">رقم الصيانة</th>
              <th className="text-right p-3">الجهاز</th>
              <th className="text-right p-3">العميل</th>
              <th className="text-right p-3">التاريخ</th>
              <th className="text-right p-3">الحالة</th>
              <th className="text-right p-3">الدفع</th>
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
                    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium",
                      r.isCompleted ? "bg-success/15 text-success" : "bg-secondary/15 text-secondary"
                    )}>
                      {r.isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {r.isCompleted ? "مكتملة" : "قيد الصيانة"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium",
                      r.isPaid ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                    )}>
                      <BanknoteIcon className="w-3 h-3" />
                      {r.isPaid ? "مدفوع" : `${total} ر.س`}
                    </span>
                  </td>
                </tr>
              );
            })}
            {displayed.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Records;
