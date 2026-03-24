import { useParams, useNavigate } from "react-router-dom";
import { useWorkshop } from "@/context/WorkshopContext";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCustomerById, getRecordsByCustomer } = useWorkshop();
  const navigate = useNavigate();

  const customer = getCustomerById(id!);
  if (!customer) return <div className="text-center py-12 text-muted-foreground">لم يتم العثور على العميل</div>;

  const records = getRecordsByCustomer(customer.id);
  const totalSpent = records.reduce((s, r) => s + r.spareParts.reduce((t, p) => t + p.price, 0) + r.laborFee, 0);

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold">ملف العميل</h2>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h3 className="text-xl font-bold">{customer.name}</h3>
        <p className="text-muted-foreground mt-1">{customer.phone}</p>
        {customer.company && <p className="text-muted-foreground">{customer.company}</p>}
        <div className="flex gap-6 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">عدد الطلبات</p>
            <p className="text-xl font-bold">{records.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">إجمالي المبالغ</p>
            <p className="text-xl font-bold">{totalSpent} ر.س</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">سجل الصيانة</h3>
        </div>
        <div className="divide-y divide-border">
          {records.length === 0 ? (
            <p className="p-4 text-muted-foreground text-sm">لا توجد سجلات</p>
          ) : (
            records.map((r) => {
              const total = r.spareParts.reduce((s, p) => s + p.price, 0) + r.laborFee;
              return (
                <div
                  key={r.id}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => navigate(`/maintenance/${r.id}`)}
                >
                  <div>
                    <p className="font-medium">{r.itemName}</p>
                    <p className="text-sm text-muted-foreground">{r.maintenanceId} • {r.receivedDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{total} ر.س</span>
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1",
                      r.isCompleted ? "bg-success/15 text-success" : "bg-secondary/15 text-secondary"
                    )}>
                      {r.isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {r.isCompleted ? "مكتملة" : "قيد الصيانة"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
