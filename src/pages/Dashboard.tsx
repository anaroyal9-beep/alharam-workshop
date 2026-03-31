import { useWorkshop } from "@/context/WorkshopContext";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertCircle, CheckCircle, BanknoteIcon, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getAlertStatus = (record: { isCompleted: boolean; deliveryDate?: string }) => {
  if (!record.isCompleted || !record.deliveryDate) return null;
  const delivery = new Date(record.deliveryDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays >= 30) return "blue";
  if (diffDays >= 7) return "yellow";
  return null;
};

const alertStyles: Record<string, string> = {
  yellow: "bg-yellow-50 border-yellow-400",
  blue: "bg-blue-50 border-blue-400",
};

const Dashboard = () => {
  const { records, customers, getCustomerById } = useWorkshop();
  const navigate = useNavigate();

  const pending = records.filter((r) => !r.isCompleted);
  const completed = records.filter((r) => r.isCompleted);
  const unpaid = records.filter((r) => !r.isPaid);
  const underWarranty = records.filter((r) => r.isUnderWarranty);

  // Records with alerts (completed but not collected after 7+ days)
  const alertRecords = records
    .map((r) => ({ ...r, alert: getAlertStatus(r) }))
    .filter((r) => r.alert !== null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">لوحة التحكم</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="إجمالي الطلبات" value={records.length} icon={Wrench} variant="primary" />
        <StatCard title="قيد الصيانة" value={pending.length} icon={AlertCircle} variant="secondary" />
        <StatCard title="مكتملة" value={completed.length} icon={CheckCircle} variant="accent" />
        <StatCard title="غير مدفوعة" value={unpaid.length} icon={BanknoteIcon} variant="destructive" />
        <StatCard title="تحت الضمان" value={underWarranty.length} icon={ShieldCheck} variant="primary" />
      </div>

      {/* Alert Section */}
      {alertRecords.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              تنبيهات الاستلام
            </h3>
          </div>
          <div className="divide-y divide-border">
            {alertRecords.map((r) => {
              const customer = getCustomerById(r.customerId);
              const delivery = new Date(r.deliveryDate!);
              const diffDays = Math.floor((new Date().getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div
                  key={r.id}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:opacity-80 transition-colors border-r-4 ${alertStyles[r.alert!]}`}
                  onClick={() => navigate(`/maintenance/${r.id}`)}
                >
                  <div>
                    <p className="font-medium">{r.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer?.name} • {r.maintenanceId} • تسليم: {r.deliveryDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{diffDays} يوم منذ التسليم</span>
                    {r.alert === "blue" && (
                      <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 text-xs">
                        تم انتهاء مهلة الانتظار
                      </Badge>
                    )}
                    {r.alert === "yellow" && (
                      <Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-500/30 text-xs">
                        تنبيه تأخر الاستلام
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">طلبات قيد الصيانة</h3>
          </div>
          <div className="divide-y divide-border">
            {pending.length === 0 ? (
              <p className="p-4 text-muted-foreground text-sm">لا توجد طلبات قيد الصيانة</p>
            ) : (
              pending.map((r) => {
                const customer = getCustomerById(r.customerId);
                return (
                  <div
                    key={r.id}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/maintenance/${r.id}`)}
                  >
                    <div>
                      <p className="font-medium">{r.itemName}</p>
                      <p className="text-sm text-muted-foreground">{customer?.name} • {r.maintenanceId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-red-500/15 text-red-600 border-red-500/30">قيد الانتظار</Badge>
                      <Badge className={r.isPaid
                        ? "bg-green-500/15 text-green-600 border-green-500/30"
                        : "bg-red-500/15 text-red-600 border-red-500/30"
                      }>
                        {r.isPaid ? "مدفوع" : "غير مدفوع"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Unpaid */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">فواتير غير مدفوعة</h3>
          </div>
          <div className="divide-y divide-border">
            {unpaid.length === 0 ? (
              <p className="p-4 text-muted-foreground text-sm">لا توجد فواتير غير مدفوعة</p>
            ) : (
              unpaid.map((r) => {
                const customer = getCustomerById(r.customerId);
                const total = r.spareParts.reduce((s, p) => s + p.price, 0) + r.laborFee;
                return (
                  <div
                    key={r.id}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/maintenance/${r.id}`)}
                  >
                    <div>
                      <p className="font-medium">{r.itemName}</p>
                      <p className="text-sm text-muted-foreground">{customer?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-destructive">{total} ر.س</span>
                      <Badge className={r.isCompleted
                        ? "bg-green-500/15 text-green-600 border-green-500/30"
                        : "bg-red-500/15 text-red-600 border-red-500/30"
                      }>
                        {r.isCompleted ? "مكتملة" : "قيد الانتظار"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
