import { useState, useMemo } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Trash2, UserCog, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const Technicians = () => {
  const { records, getCustomerById, technicians, addTechnician, removeTechnician } = useWorkshop();
  const { t } = useLanguage();
  const [newName, setNewName] = useState("");
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportTechFilter, setReportTechFilter] = useState("all");
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");

  const techStats = useMemo(() => {
    return technicians.map((tech) => {
      const assigned = records.filter((r) => r.technicianName === tech.name);
      const completed = assigned.filter((r) => r.isCompleted).length;
      const total = assigned.length;
      const rating = total > 0 ? Math.min(5, Math.round((completed / total) * 5 * 10) / 10) : 0;
      return { ...tech, assigned, completed, total, rating };
    });
  }, [technicians, records]);

  const reportData = useMemo(() => {
    const techs = reportTechFilter === "all" ? technicians : technicians.filter((t) => t.id === reportTechFilter);
    return techs.map((tech) => {
      let assigned = records.filter((r) => r.technicianName === tech.name);
      if (reportFromDate) assigned = assigned.filter((r) => r.receivedDate >= reportFromDate);
      if (reportToDate) assigned = assigned.filter((r) => r.receivedDate <= reportToDate);
      const completed = assigned.filter((r) => r.isCompleted).length;
      const pending = assigned.length - completed;
      const rate = assigned.length > 0 ? Math.round((completed / assigned.length) * 100) : 0;
      return { name: tech.name, total: assigned.length, completed, pending, rate };
    });
  }, [technicians, records, reportTechFilter, reportFromDate, reportToDate]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTechnician(newName.trim());
    setNewName("");
    toast.success(t("techAdded"));
  };

  const selectedTech = techStats.find((t) => t.id === selectedTechId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">{t("technicians")}</h2>
        <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setShowReport(!showReport)}>
          <BarChart3 className="w-4 h-4 ml-1" />
          {t("performanceReport")}
        </Button>
      </div>

      {/* Performance Report */}
      {showReport && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-5 space-y-4">
          <h3 className="font-bold text-foreground">{t("performanceReport")}</h3>
          <div className="flex flex-wrap gap-3">
            <select
              value={reportTechFilter}
              onChange={(e) => setReportTechFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">{t("allTechnicians")}</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
            <Input type="date" value={reportFromDate} onChange={(e) => setReportFromDate(e.target.value)} className="w-40 rounded-lg" placeholder={t("fromDate")} />
            <Input type="date" value={reportToDate} onChange={(e) => setReportToDate(e.target.value)} className="w-40 rounded-lg" placeholder={t("toDate")} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-right p-3">{t("technicianName")}</th>
                  <th className="text-right p-3">{t("totalTasks")}</th>
                  <th className="text-right p-3">{t("completedTasks")}</th>
                  <th className="text-right p-3">{t("pendingTasks")}</th>
                  <th className="text-right p-3">{t("completionRate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reportData.map((row) => (
                  <tr key={row.name} className="hover:bg-muted/30">
                    <td className="p-3 text-sm font-semibold">{row.name}</td>
                    <td className="p-3 text-sm font-mono">{row.total}</td>
                    <td className="p-3 text-sm font-mono text-[hsl(var(--success))]">{row.completed}</td>
                    <td className="p-3 text-sm font-mono text-[hsl(var(--destructive))]">{row.pending}</td>
                    <td className="p-3 text-sm font-bold">{row.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add technician */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder={t("newTechName")}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 rounded-lg"
          />
          <Button onClick={handleAdd} size="sm" className="rounded-lg">
            <Plus className="w-4 h-4 ml-1" />
            {t("addTechnician")}
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
                  <p className="text-xs text-muted-foreground">{tech.total} {t("tasks")}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTechnician(tech.id);
                  if (selectedTechId === tech.id) setSelectedTechId(null);
                  toast.success(t("techDeleted"));
                }}
                className="text-destructive hover:text-destructive/70"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-primary">{tech.completed}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{t("completedTasks")}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-foreground">{tech.total - tech.completed}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{t("inProgress")}</p>
              </div>
            </div>

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
            <h3 className="font-bold">{t("tasksOf")} {selectedTech.name}</h3>
          </div>
          {selectedTech.assigned.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">{t("noTasks")}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-right p-3">{t("maintenanceId")}</th>
                  <th className="text-right p-3">{t("device")}</th>
                  <th className="text-right p-3">{t("customer")}</th>
                  <th className="text-right p-3">{t("receivedDate")}</th>
                  <th className="text-right p-3">{t("orderStatus")}</th>
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
                          {r.isCompleted ? t("completed") : t("inProgress")}
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
