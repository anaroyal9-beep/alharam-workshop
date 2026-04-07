import { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Plus, Trash2 } from "lucide-react";
import PrintHeader from "@/components/PrintHeader";
import PrintFooter from "@/components/PrintFooter";

interface RevenueRow {
  id: string;
  description: string;
  code: string;
  cash: number;
  pos: number;
  transfer: number;
}

interface ExpenseRow {
  id: string;
  description: string;
  amount: number;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const DailyLedger = () => {
  const { t } = useLanguage();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const dayName = (dateStr: string) => {
    const days = t("dayNames").split(",");
    return days[new Date(dateStr).getDay()] || "";
  };

  const [openingBalance, setOpeningBalance] = useState("");
  const [cashSales, setCashSales] = useState("");

  const [revenues, setRevenues] = useState<RevenueRow[]>([]);
  const [revDesc, setRevDesc] = useState("");
  const [revCode, setRevCode] = useState("");
  const [revCash, setRevCash] = useState("");
  const [revPos, setRevPos] = useState("");
  const [revTransfer, setRevTransfer] = useState("");

  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [expDesc, setExpDesc] = useState("");
  const [expAmt, setExpAmt] = useState("");

  const totals = useMemo(() => {
    const totalCash = revenues.reduce((s, r) => s + r.cash, 0);
    const totalPos = revenues.reduce((s, r) => s + r.pos, 0);
    const totalTransfer = revenues.reduce((s, r) => s + r.transfer, 0);
    const totalRevenue = totalCash + totalPos + totalTransfer;
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const ob = Number(openingBalance) || 0;
    const cs = Number(cashSales) || 0;
    const currentTotal = ob + totalRevenue + cs - totalExpenses;
    return { totalCash, totalPos, totalTransfer, totalRevenue, totalExpenses, net: totalRevenue - totalExpenses, currentTotal, closingBalance: currentTotal };
  }, [revenues, expenses, openingBalance, cashSales]);

  const addRevenue = () => {
    if (!revDesc.trim() && !revCash && !revPos && !revTransfer) return;
    setRevenues((p) => [
      ...p,
      { id: uid(), description: revDesc.trim(), code: revCode.trim(), cash: Number(revCash) || 0, pos: Number(revPos) || 0, transfer: Number(revTransfer) || 0 },
    ]);
    setRevDesc(""); setRevCode(""); setRevCash(""); setRevPos(""); setRevTransfer("");
  };

  const addExpense = () => {
    if (!expDesc.trim() && !expAmt) return;
    setExpenses((p) => [...p, { id: uid(), description: expDesc.trim(), amount: Number(expAmt) || 0 }]);
    setExpDesc(""); setExpAmt("");
  };

  const removeRevenue = (id: string) => setRevenues((p) => p.filter((r) => r.id !== id));
  const removeExpense = (id: string) => setExpenses((p) => p.filter((e) => e.id !== id));

  const handlePrint = () => window.print();

  const cellClass = "border border-border px-2 py-1.5 text-xs font-semibold print:text-[9pt] print:border-foreground/40 print:px-1 print:py-0.5";
  const headClass = `${cellClass} bg-muted/60 text-foreground font-extrabold print:bg-transparent`;
  const inputCell = "h-7 text-xs border-0 bg-transparent p-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 print:text-[9pt]";
  const currency = t("sar");

  return (
    <div className="space-y-4 print:space-y-2" dir="rtl">
      <PrintHeader />
      <div className="hidden print:block text-center pb-2 mb-2">
        <h1 className="text-lg font-extrabold">{t("dailyLedgerPrintTitle")}</h1>
        <div className="flex justify-between mt-1 text-[9pt] font-bold px-4">
          <span>{t("dateLabel")}: {date}</span>
          <span>{t("dayLabel")}: {dayName(date)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-extrabold">{t("dailyLedgerTitle")}</h2>
        <div className="flex items-center gap-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44 h-9 text-sm" />
          <span className="text-sm font-bold text-muted-foreground">{dayName(date)}</span>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            {t("printLedger")}
          </Button>
        </div>
      </div>

      {/* Opening Balance & Cash Sales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
        <div className="bg-card rounded-xl border border-border p-4 print:rounded-none print:border-foreground/40 print:p-2">
          <label className="text-xs font-extrabold text-foreground block mb-1 print:text-[9pt]">{t("openingBalance")}</label>
          <Input
            type="number"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="0"
            className="text-lg font-bold text-center print:border-0 print:bg-transparent print:text-[10pt]"
          />
        </div>
        <div className="bg-card rounded-xl border border-border p-4 print:rounded-none print:border-foreground/40 print:p-2">
          <label className="text-xs font-extrabold text-foreground block mb-1 print:text-[9pt]">{t("cashSales")}</label>
          <Input
            type="number"
            value={cashSales}
            onChange={(e) => setCashSales(e.target.value)}
            placeholder="0"
            className="text-lg font-bold text-center print:border-0 print:bg-transparent print:text-[10pt]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 print:grid-cols-[1fr_auto] print:gap-2">
        {/* Revenue Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden print:rounded-none print:shadow-none print:border-foreground/40">
          <div className="bg-muted/40 px-3 py-2 font-extrabold text-sm text-center border-b border-border print:bg-transparent print:text-[10pt] print:border-foreground/40">
            {t("revenue")}
          </div>
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className={headClass}>{t("transfer")}</th>
                <th className={headClass}>{t("network")}</th>
                <th className={headClass}>{t("cash")}</th>
                <th className={`${headClass} text-right min-w-[140px]`}>{t("statement")}</th>
                <th className={headClass}>{t("code")}</th>
                <th className="print:hidden w-8" />
              </tr>
            </thead>
            <tbody>
              {revenues.map((r) => (
                <tr key={r.id}>
                  <td className={cellClass}>{r.transfer || ""}</td>
                  <td className={cellClass}>{r.pos || ""}</td>
                  <td className={cellClass}>{r.cash || ""}</td>
                  <td className={`${cellClass} text-right`}>{r.description}</td>
                  <td className={cellClass}>{r.code}</td>
                  <td className="print:hidden px-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeRevenue(r.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="print:hidden">
                <td className={cellClass}><Input value={revTransfer} onChange={(e) => setRevTransfer(e.target.value)} className={inputCell} placeholder="0" type="number" /></td>
                <td className={cellClass}><Input value={revPos} onChange={(e) => setRevPos(e.target.value)} className={inputCell} placeholder="0" type="number" /></td>
                <td className={cellClass}><Input value={revCash} onChange={(e) => setRevCash(e.target.value)} className={inputCell} placeholder="0" type="number" /></td>
                <td className={cellClass}><Input value={revDesc} onChange={(e) => setRevDesc(e.target.value)} className={`${inputCell} text-right`} placeholder={t("revenueDescPlaceholder")} /></td>
                <td className={cellClass}><Input value={revCode} onChange={(e) => setRevCode(e.target.value)} className={inputCell} placeholder={t("codePlaceholder")} /></td>
                <td className="px-1">
                  <Button size="icon" className="h-6 w-6" onClick={addRevenue}><Plus className="w-3.5 h-3.5" /></Button>
                </td>
              </tr>
              {revenues.length < 12 &&
                Array.from({ length: 12 - revenues.length }).map((_, i) => (
                  <tr key={`empty-rev-${i}`} className="hidden print:table-row">
                    <td className={cellClass}>&nbsp;</td>
                    <td className={cellClass}>&nbsp;</td>
                    <td className={cellClass}>&nbsp;</td>
                    <td className={cellClass}>&nbsp;</td>
                    <td className={cellClass}>&nbsp;</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="border-t border-border print:border-foreground/40">
            <div className="flex justify-between px-3 py-1.5 text-xs font-extrabold print:text-[9pt]">
              <span>{t("totalDailyRevenue")}</span>
              <span className="text-[hsl(var(--success))]">{totals.totalRevenue > 0 ? `${totals.totalRevenue} ${currency}` : "—"}</span>
            </div>
            <div className="flex justify-between px-3 py-1 text-[10px] font-bold text-muted-foreground print:text-[8pt]">
              <span>{t("cashLabel")}: {totals.totalCash}</span>
              <span>{t("networkLabel")}: {totals.totalPos}</span>
              <span>{t("transferLabel")}: {totals.totalTransfer}</span>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden w-full lg:w-72 print:rounded-none print:shadow-none print:border-foreground/40 print:w-[180px]">
          <div className="bg-muted/40 px-3 py-2 font-extrabold text-sm text-center border-b border-border print:bg-transparent print:text-[10pt] print:border-foreground/40">
            {t("expenses")}
          </div>
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className={`${headClass} text-right min-w-[100px]`}>{t("expenseStatement")}</th>
                <th className={headClass}>{t("amount")}</th>
                <th className="print:hidden w-8" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td className={`${cellClass} text-right`}>{e.description}</td>
                  <td className={cellClass}>{e.amount || ""}</td>
                  <td className="print:hidden px-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeExpense(e.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="print:hidden">
                <td className={cellClass}><Input value={expDesc} onChange={(e) => setExpDesc(e.target.value)} className={`${inputCell} text-right`} placeholder={t("expenseDescPlaceholder")} /></td>
                <td className={cellClass}><Input value={expAmt} onChange={(e) => setExpAmt(e.target.value)} className={inputCell} placeholder="0" type="number" /></td>
                <td className="px-1">
                  <Button size="icon" className="h-6 w-6" onClick={addExpense}><Plus className="w-3.5 h-3.5" /></Button>
                </td>
              </tr>
              {expenses.length < 12 &&
                Array.from({ length: 12 - expenses.length }).map((_, i) => (
                  <tr key={`empty-exp-${i}`} className="hidden print:table-row">
                    <td className={cellClass}>&nbsp;</td>
                    <td className={cellClass}>&nbsp;</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="border-t border-border print:border-foreground/40 text-xs font-extrabold print:text-[9pt]">
            <div className="flex justify-between px-3 py-1.5 border-b border-border print:border-foreground/40">
              <span>{t("todayExpenses")}</span>
              <span className="text-destructive">{totals.totalExpenses > 0 ? `${totals.totalExpenses} ${currency}` : "—"}</span>
            </div>
            <div className="flex justify-between px-3 py-1.5 border-b border-border print:border-foreground/40">
              <span>{t("remainingCustody")}</span>
              <span className="font-extrabold">{totals.net} {currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary with Opening Balance formula */}
      <div className="bg-card rounded-xl border border-border p-4 print:rounded-none print:border-foreground/40 print:p-2">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">{t("openingBalance")}</p>
            <p className="text-lg font-extrabold">{Number(openingBalance) || 0} {currency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">{t("totalRevenue")} + {t("cashSales")}</p>
            <p className="text-lg font-extrabold text-[hsl(var(--success))]">{totals.totalRevenue + (Number(cashSales) || 0)} {currency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">{t("totalExpenses")}</p>
            <p className="text-lg font-extrabold text-destructive">{totals.totalExpenses} {currency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">{t("currentTotalBalance")}</p>
            <p className="text-xl font-extrabold text-primary">{totals.currentTotal} {currency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">{t("closingBalance")}</p>
            <p className="text-xl font-extrabold">{totals.closingBalance} {currency}</p>
          </div>
        </div>
      </div>
      <PrintFooter />
    </div>
  );
};

export default DailyLedger;