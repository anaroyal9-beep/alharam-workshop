import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Printer, Plus } from "lucide-react";
import PrintHeader from "@/components/PrintHeader";

interface LedgerEntry {
  id: string;
  name: string;
  date: string;
  revenue: number;
  expenses: number;
}

const DailyLedger = () => {
  const today = new Date().toISOString().split("T")[0];
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState(today);
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");

  const addEntry = () => {
    if (!name.trim()) return;
    setEntries((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        date,
        revenue: Number(revenue) || 0,
        expenses: Number(expenses) || 0,
      },
    ]);
    setName("");
    setRevenue("");
    setExpenses("");
  };

  const removeEntry = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const filtered = entries.filter((e) => e.date === date);
  const totalRevenue = filtered.reduce((s, e) => s + e.revenue, 0);
  const totalExpenses = filtered.reduce((s, e) => s + e.expenses, 0);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 print:space-y-3">
      <PrintHeader />

      {/* Print title */}
      <div className="hidden print:block text-center mb-2">
        <h2 className="text-lg font-extrabold">التقرير اليومي — {date}</h2>
      </div>

      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-extrabold">اليومية</h2>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          طباعة التقرير اليومي
        </Button>
      </div>

      {/* Add entry form - screen only */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-5 space-y-4 print:hidden">
        <h3 className="font-bold text-foreground">إضافة قيد جديد</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">الاسم</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم القيد"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">التاريخ</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">الإيرادات (ر.س)</Label>
            <Input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">المصروفات (ر.س)</Label>
            <Input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <Button onClick={addEntry} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة
        </Button>
      </div>

      {/* Date filter - screen only */}
      <div className="flex items-center gap-3 print:hidden">
        <Label className="text-sm font-semibold">عرض بتاريخ:</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden print:shadow-none print:rounded-none print:border print:border-foreground/30">
        <Table>
          <TableHeader>
            <TableRow className="print:border-foreground/30">
              <TableHead className="text-right font-bold print:text-[10pt]">الاسم</TableHead>
              <TableHead className="text-right font-bold print:text-[10pt]">التاريخ</TableHead>
              <TableHead className="text-right font-bold print:text-[10pt]">الإيرادات</TableHead>
              <TableHead className="text-right font-bold print:text-[10pt]">المصروفات</TableHead>
              <TableHead className="text-right font-bold print:hidden">حذف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 print:py-4">
                  لا توجد قيود لهذا اليوم
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((entry) => (
                <TableRow key={entry.id} className="print:border-foreground/20">
                  <TableCell className="font-medium print:text-[10pt]">{entry.name}</TableCell>
                  <TableCell className="print:text-[10pt]">{entry.date}</TableCell>
                  <TableCell className="text-[hsl(var(--success))] font-bold print:text-[10pt]">
                    {entry.revenue > 0 ? `${entry.revenue} ر.س` : "—"}
                  </TableCell>
                  <TableCell className="text-destructive font-bold print:text-[10pt]">
                    {entry.expenses > 0 ? `${entry.expenses} ر.س` : "—"}
                  </TableCell>
                  <TableCell className="print:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEntry(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Totals */}
        {filtered.length > 0 && (
          <div className="border-t border-border p-4 flex justify-between items-center print:border-foreground/30 print:p-2">
            <span className="font-bold print:text-[10pt]">الإجمالي</span>
            <div className="flex gap-6">
              <span className="text-[hsl(var(--success))] font-bold print:text-[10pt]">
                الإيرادات: {totalRevenue} ر.س
              </span>
              <span className="text-destructive font-bold print:text-[10pt]">
                المصروفات: {totalExpenses} ر.س
              </span>
              <span className="font-extrabold print:text-[10pt]">
                الصافي: {totalRevenue - totalExpenses} ر.س
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyLedger;
