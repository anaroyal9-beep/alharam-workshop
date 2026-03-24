import { useWorkshop } from "@/context/WorkshopContext";
import StatCard from "@/components/StatCard";
import { Wrench, AlertCircle, CheckCircle, BanknoteIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { records, customers, getCustomerById } = useWorkshop();
  const navigate = useNavigate();

  const pending = records.filter((r) => !r.isCompleted);
  const completed = records.filter((r) => r.isCompleted);
  const unpaid = records.filter((r) => !r.isPaid);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">لوحة التحكم</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الطلبات" value={records.length} icon={Wrench} variant="primary" />
        <StatCard title="قيد الصيانة" value={pending.length} icon={AlertCircle} variant="secondary" />
        <StatCard title="مكتملة" value={completed.length} icon={CheckCircle} variant="accent" />
        <StatCard title="غير مدفوعة" value={unpaid.length} icon={BanknoteIcon} variant="destructive" />
      </div>

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
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full font-medium">
                      قيد الصيانة
                    </span>
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
                    <span className="font-bold text-destructive">{total} ر.س</span>
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
