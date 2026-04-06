import { useState, useMemo, useRef } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText, Users, BarChart3, Filter } from "lucide-react";
import PrintHeader from "@/components/PrintHeader";
import PrintFooter from "@/components/PrintFooter";

type ReportType = "technician" | "master" | "analytics";

const Reports = () => {
  const { records, customers, getCustomerById, technicians } = useWorkshop();
  const { t, lang } = useLanguage();

  const [reportType, setReportType] = useState<ReportType>("technician");
  const [selectedTech, setSelectedTech] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [warrantyFilter, setWarrantyFilter] = useState("all");

  const filteredRecords = useMemo(() => {
    let result = [...records];
    if (fromDate) result = result.filter((r) => r.receivedDate >= fromDate);
    if (toDate) result = result.filter((r) => r.receivedDate <= toDate);
    if (statusFilter === "completed") result = result.filter((r) => r.isCompleted);
    if (statusFilter === "pending") result = result.filter((r) => !r.isCompleted);
    if (paymentFilter === "paid") result = result.filter((r) => r.isPaid);
    if (paymentFilter === "unpaid") result = result.filter((r) => !r.isPaid);
    if (warrantyFilter === "warranty") result = result.filter((r) => r.isUnderWarranty);
    if (warrantyFilter === "noWarranty") result = result.filter((r) => !r.isUnderWarranty);
    return result;
  }, [records, fromDate, toDate, statusFilter, paymentFilter, warrantyFilter]);

  const techReport = useMemo(() => {
    const techs = selectedTech === "all" ? technicians : technicians.filter((t) => t.id === selectedTech);
    return techs.map((tech) => {
      const assigned = filteredRecords.filter((r) => r.technicianName === tech.name);
      const completed = assigned.filter((r) => r.isCompleted).length;
      const pending = assigned.length - completed;
      const revenue = assigned.reduce((s, r) => s + r.spareParts.reduce((sp, p) => sp + p.price, 0) + r.laborFee, 0);
      const rate = assigned.length > 0 ? Math.round((completed / assigned.length) * 100) : 0;
      return { name: tech.name, total: assigned.length, completed, pending, revenue, rate, tasks: assigned };
    });
  }, [technicians, filteredRecords, selectedTech]);

  const masterSummary = useMemo(() => {
    const totalCompleted = filteredRecords.filter((r) => r.isCompleted).length;
    const totalPending = filteredRecords.length - totalCompleted;
    const totalRevenue = filteredRecords.reduce((s, r) => s + r.spareParts.reduce((sp, p) => sp + p.price, 0) + r.laborFee, 0);
    const totalPaid = filteredRecords.filter((r) => r.isPaid).reduce((s, r) => s + r.spareParts.reduce((sp, p) => sp + p.price, 0) + r.laborFee, 0);
    return { total: filteredRecords.length, totalCompleted, totalPending, totalRevenue, totalPaid, unpaid: totalRevenue - totalPaid };
  }, [filteredRecords]);

  const handlePrint = () => window.print();
  const currency = t("sar");

  const tabs = [
    { key: "technician" as ReportType, label: t("techPerformanceReport"), icon: Users },
    { key: "master" as ReportType, label: t("masterReport"), icon: FileText },
    { key: "analytics" as ReportType, label: t("analyticsReport"), icon: BarChart3 },
  ];

  return (
    <div className="space-y-5 print:space-y-2">
      <PrintHeader />

      <div className="hidden print:block text-center mb-2">
        <h2 className="text-[13pt] font-extrabold border-b border-foreground/20 pb-1 inline-block px-8">
          {reportType === "technician" ? t("techPerformanceReport") : reportType === "master" ? t("masterReport") : t("analyticsReport")}
        </h2>
        {fromDate && toDate && (
          <p className="text-[9pt] mt-1 text-muted-foreground font-semibold">{fromDate} → {toDate}</p>
        )}
      </div>

      {/* Screen Controls */}
      <div className="print:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">{t("reports")}</h2>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            {t("printReport")}
          </Button>
        </div>

        {/* Report Type Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={reportType === tab.key ? "default" : "outline"}
              size="sm"
              className="rounded-lg gap-1.5"
              onClick={() => setReportType(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">{t("fromDate")}</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40 rounded-lg" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">{t("toDate")}</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40 rounded-lg" />
          </div>
          {reportType === "technician" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">{t("filterByTechnician")}</label>
              <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="all">{t("allTechnicians")}</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
              </select>
            </div>
          )}
          {reportType === "analytics" && (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">{t("maintenanceStatus")}</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="all">{t("all")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="pending">{t("pending")}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">{t("paymentStatus")}</label>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="all">{t("all")}</option>
                  <option value="paid">{t("paid")}</option>
                  <option value="unpaid">{t("unpaid")}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">{t("warrantyStatus")}</label>
                <select value={warrantyFilter} onChange={(e) => setWarrantyFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="all">{t("all")}</option>
                  <option value="warranty">{t("underWarranty")}</option>
                  <option value="noWarranty">{t("noMaintenanceWarranty")}</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Technician Performance Report */}
      {reportType === "technician" && (
        <div className="space-y-4 print:space-y-2">
          {techReport.map((tech) => (
            <div key={tech.name} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden print:rounded-none print:shadow-none print:break-inside-avoid">
              <div className="p-4 border-b border-border print:p-2">
                <h3 className="font-bold text-foreground print:text-[11pt]">{tech.name}</h3>
                <div className="flex gap-4 mt-1 text-xs text-muted-foreground print:text-[8pt]">
                  <span>{t("totalTasks")}: {tech.total}</span>
                  <span className="text-[hsl(var(--success))]">{t("completedTasks")}: {tech.completed}</span>
                  <span className="text-[hsl(var(--destructive))]">{t("pendingTasks")}: {tech.pending}</span>
                  <span>{t("completionRate")}: {tech.rate}%</span>
                  <span>{t("totalRevenue")}: {tech.revenue} {currency}</span>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border print:text-[8pt]">
                    <th className="text-right p-2 print:p-1">{t("maintenanceId")}</th>
                    <th className="text-right p-2 print:p-1">{t("device")}</th>
                    <th className="text-right p-2 print:p-1">{t("customer")}</th>
                    <th className="text-right p-2 print:p-1">{t("receivedDate")}</th>
                     <th className="text-right p-2 print:p-1">{t("warrantyStatus")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tech.tasks.map((r) => {
                    const customer = getCustomerById(r.customerId);
                    return (
                      <tr key={r.id} className="text-sm print:text-[9pt]">
                        <td className="p-2 print:p-1 font-mono">{r.maintenanceId}</td>
                        <td className="p-2 print:p-1">{r.itemName}</td>
                        <td className="p-2 print:p-1">{customer?.name}</td>
                        <td className="p-2 print:p-1">{r.receivedDate}</td>
                         <td className="p-2 print:p-1">
                          <Badge className={r.isUnderWarranty ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" : "bg-muted text-muted-foreground"}>
                            {r.isUnderWarranty ? t("withinWarranty") : t("outsideWarranty")}
                          </Badge>
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Master Report */}
      {reportType === "master" && (
        <div className="space-y-4 print:space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:grid-cols-6 print:gap-1">
            {[
              { label: t("totalOrders"), val: masterSummary.total },
              { label: t("completedOrders"), val: masterSummary.totalCompleted },
              { label: t("pendingTasks"), val: masterSummary.totalPending },
              { label: t("totalRevenue"), val: `${masterSummary.totalRevenue} ${currency}` },
              { label: t("totalPaid"), val: `${masterSummary.totalPaid} ${currency}` },
              { label: t("remainingBalances"), val: `${masterSummary.unpaid} ${currency}` },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-3 text-center print:rounded-none print:p-1.5">
                <p className="text-xs text-muted-foreground font-semibold print:text-[7pt]">{s.label}</p>
                <p className="text-lg font-extrabold print:text-[10pt]">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden print:rounded-none print:shadow-none">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border print:text-[8pt]">
                  <th className="text-right p-2 print:p-1">{t("maintenanceId")}</th>
                  <th className="text-right p-2 print:p-1">{t("device")}</th>
                  <th className="text-right p-2 print:p-1">{t("customer")}</th>
                  <th className="text-right p-2 print:p-1">{t("technicianName")}</th>
                  <th className="text-right p-2 print:p-1">{t("receivedDate")}</th>
                  <th className="text-right p-2 print:p-1">{t("total")}</th>
                  <th className="text-right p-2 print:p-1">{t("warrantyStatus")}</th>
                  <th className="text-right p-2 print:p-1">{t("payment")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((r) => {
                  const customer = getCustomerById(r.customerId);
                  const total = r.spareParts.reduce((s, p) => s + p.price, 0) + r.laborFee;
                  return (
                    <tr key={r.id} className="text-sm print:text-[8pt]">
                      <td className="p-2 print:p-1 font-mono">{r.maintenanceId}</td>
                      <td className="p-2 print:p-1">{r.itemName}</td>
                      <td className="p-2 print:p-1">{customer?.name}</td>
                      <td className="p-2 print:p-1">{r.technicianName || "—"}</td>
                      <td className="p-2 print:p-1">{r.receivedDate}</td>
                      <td className="p-2 print:p-1 font-mono">{total} {currency}</td>
                      <td className="p-2 print:p-1">
                        <Badge className={r.isCompleted ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"}>
                          {r.isCompleted ? t("completed") : t("pending")}
                        </Badge>
                      </td>
                      <td className="p-2 print:p-1">
                        <Badge className={r.isPaid ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"}>
                          {r.isPaid ? t("paid") : t("unpaid")}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Report */}
      {reportType === "analytics" && (
        <div className="space-y-4 print:space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4 print:gap-1">
            {[
              { label: t("totalOrders"), val: filteredRecords.length },
              { label: t("completedOrders"), val: filteredRecords.filter((r) => r.isCompleted).length },
              { label: t("unpaidBills"), val: filteredRecords.filter((r) => !r.isPaid).length },
              { label: t("underWarranty"), val: filteredRecords.filter((r) => r.isUnderWarranty).length },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-3 text-center print:rounded-none print:p-1.5">
                <p className="text-xs text-muted-foreground font-semibold print:text-[7pt]">{s.label}</p>
                <p className="text-lg font-extrabold print:text-[10pt]">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden print:rounded-none print:shadow-none">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border print:text-[8pt]">
                  <th className="text-right p-2 print:p-1">{t("maintenanceId")}</th>
                  <th className="text-right p-2 print:p-1">{t("device")}</th>
                  <th className="text-right p-2 print:p-1">{t("customer")}</th>
                  <th className="text-right p-2 print:p-1">{t("receivedDate")}</th>
                  <th className="text-right p-2 print:p-1">{t("maintenanceStatus")}</th>
                  <th className="text-right p-2 print:p-1">{t("paymentStatus")}</th>
                  <th className="text-right p-2 print:p-1">{t("warrantyStatus")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((r) => {
                  const customer = getCustomerById(r.customerId);
                  return (
                    <tr key={r.id} className="text-sm print:text-[8pt]">
                      <td className="p-2 print:p-1 font-mono">{r.maintenanceId}</td>
                      <td className="p-2 print:p-1">{r.itemName}</td>
                      <td className="p-2 print:p-1">{customer?.name}</td>
                      <td className="p-2 print:p-1">{r.receivedDate}</td>
                      <td className="p-2 print:p-1">
                        <Badge className={r.isCompleted ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"}>
                          {r.isCompleted ? t("completed") : t("pending")}
                        </Badge>
                      </td>
                      <td className="p-2 print:p-1">
                        <Badge className={r.isPaid ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"}>
                          {r.isPaid ? t("paid") : t("unpaid")}
                        </Badge>
                      </td>
                      <td className="p-2 print:p-1">
                        <Badge className={r.isUnderWarranty ? "bg-blue-500/15 text-blue-600" : "bg-muted text-muted-foreground"}>
                          {r.isUnderWarranty ? t("maintenanceWarranty") : t("noMaintenanceWarranty")}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PrintFooter />
    </div>
  );
};

export default Reports;
