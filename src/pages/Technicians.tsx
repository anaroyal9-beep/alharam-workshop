import { useState, useMemo } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

const Technicians = () => {
  const { records, getCustomerById, technicians, addTechnician, removeTechnician, updateRecord } = useWorkshop();
  const { t } = useLanguage();
  const [newName, setNewName] = useState("");
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);

  const techStats = useMemo(() => {
    return technicians.map((tech) => {
      const assigned = records.filter((r) => r.technicianName === tech.name);
      const completed = assigned.filter((r) => r.isCompleted).length;
      const total = assigned.length;
      const rating = total > 0 ? Math.min(5, Math.round((completed / total) * 5 * 10) / 10) : 0;
      return { ...tech, assigned, completed, total, rating };
    });
  }, [technicians, records]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTechnician(newName.trim());
    setNewName("");
    toast.success("تم إضافة الفني");
  };

  const selectedTech = techStats.find((t) => t.id === selectedTechId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">{t("technicians")}</h2>

      {/* Add technician */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder="اسم الفني الجديد"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 rounded-lg"
          />
          <Button onClick={handleAdd} size="sm" className="rounded-lg">
            <Plus className="w-4 h-4 ml-1" />
            إضافة
          </Button>
        </div>
      </div>

      {/* Technicians grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techStats.map((tech) => (
          <div
            key={tech.id}
            onClick={() => setSelectedTechId(tech.id === selectedTechId ? null : tech.id)}
            className={`bg-card rounded-xl shadow-sm border border-border p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedTechId === tech.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{tech.name}</h3>
                  <p className="text-xs text-muted-foreground">{tech.total} مهمة</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTechnician(tech.id);
                  if (selectedTechId === tech.id) setSelectedTechId(null);
                  toast.success("تم حذف الفني");
                }}
                className="text-destructive hover:text-destructive/70"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-primary">{tech.completed}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">مكتملة</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-foreground">{tech.total - tech.completed}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">قيد التنفيذ</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(tech.rating)
                      ? "text-[hsl(var(--warning))] fill-[hsl(var(--warning))]"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground mr-1">({tech.rating.toFixed(1)})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected technician tasks */}
      {selectedTech && (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold">مهام {selectedTech.name}</h3>
          </div>
          {selectedTech.assigned.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">لا توجد مهام مسندة</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-right p-3">رقم الصيانة</th>
                  <th className="text-right p-3">الجهاز</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">التاريخ</th>
                  <th className="text-right p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedTech.assigned.map((r) => {
                  const customer = getCustomerById(r.customerId);
                  return (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="p-3 text-sm font-mono">{r.maintenanceId}</td>
                      <td className="p-3 text-sm">{r.itemName}</td>
                      <td className="p-3 text-sm">{customer?.name}</td>
                      <td className="p-3 text-sm">{r.receivedDate}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            r.isCompleted
                              ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30"
                              : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/30"
                          }
                        >
                          {r.isCompleted ? "مكتملة" : "قيد التنفيذ"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Technicians;
