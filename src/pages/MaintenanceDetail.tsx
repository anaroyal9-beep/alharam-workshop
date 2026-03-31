import { useParams, useNavigate } from "react-router-dom";
import { useWorkshop, SparePart } from "@/context/WorkshopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Wrench,
  ShieldCheck,
  ShieldX,
  ImagePlus,
  X,
  DollarSign,
  FileText,
  FileBarChart,
} from "lucide-react";
import PrintHeader, { PrintPolicyFooter } from "@/components/PrintHeader";

/* ── Clickable status circle ─────────────────────────────── */
const StatusCircle = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="status-circle print:pointer-events-none transition-all flex-shrink-0"
    aria-label="تبديل الحالة"
  >
    {active ? (
      <div className="w-8 h-8 rounded-full bg-[hsl(var(--success))] flex items-center justify-center shadow-md print:shadow-none print:border-2 print:border-[hsl(var(--success))]">
        <svg className="w-4 h-4 text-white print:text-[hsl(var(--success))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full border-[3px] border-[hsl(var(--destructive))] flex items-center justify-center print:border-2">
        <svg className="w-3.5 h-3.5 text-[hsl(var(--destructive))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    )}
  </button>
);

type PrintMode = "none" | "quotation" | "technical";

const MaintenanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { records, updateRecord, getCustomerById } = useWorkshop();
  const navigate = useNavigate();
  const record = records.find((r) => r.id === id);

  const [newPartName, setNewPartName] = useState("");
  const [newPartPrice, setNewPartPrice] = useState("");
  const [laborFee, setLaborFee] = useState(record?.laborFee?.toString() || "0");
  const [editMaintenanceId, setEditMaintenanceId] = useState(record?.maintenanceId || "");
  const [editReceivedDate, setEditReceivedDate] = useState(record?.receivedDate || "");
  const [failureAnalysis, setFailureAnalysis] = useState(record?.failureAnalysis || "");
  const [printMode, setPrintMode] = useState<PrintMode>("none");

  const additionalPhotoRef = useRef<HTMLInputElement>(null);

  if (!record) {
    return (
      <div className="text-center py-12 text-muted-foreground">لم يتم العثور على السجل</div>
    );
  }

  const customer = getCustomerById(record.customerId);
  const partsTotal = record.spareParts.reduce((s, p) => s + p.price, 0);
  const total = partsTotal + record.laborFee;

  const hasPhotos = !!(record.beforePhoto || record.afterPhoto || (record.additionalPhotos?.length ?? 0) > 0);

  const allPhotos: { src: string; removeAction: () => void }[] = [];
  if (record.beforePhoto) allPhotos.push({ src: record.beforePhoto, removeAction: () => updateRecord(record.id, { beforePhoto: undefined }) });
  if (record.afterPhoto) allPhotos.push({ src: record.afterPhoto, removeAction: () => updateRecord(record.id, { afterPhoto: undefined }) });
  (record.additionalPhotos || []).forEach((p, i) => allPhotos.push({ src: p, removeAction: () => removeAdditionalPhoto(i) }));

  const addPart = () => {
    if (!newPartName || !newPartPrice) return;
    const part: SparePart = {
      id: Math.random().toString(36).substring(2),
      name: newPartName,
      price: Number(newPartPrice),
    };
    updateRecord(record.id, { spareParts: [...record.spareParts, part] });
    setNewPartName("");
    setNewPartPrice("");
    toast.success("تمت إضافة القطعة");
  };

  const removePart = (partId: string) => {
    updateRecord(record.id, {
      spareParts: record.spareParts.filter((p) => p.id !== partId),
    });
  };

  const updateLaborFee = () => {
    updateRecord(record.id, { laborFee: Number(laborFee) });
    toast.success("تم تحديث أجرة الصيانة");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const existing = record.additionalPhotos || [];
        updateRecord(record.id, { additionalPhotos: [...existing, reader.result as string] });
      };
      reader.readAsDataURL(file);
    });
    toast.success("تم رفع الصور");
  };


  const removeAdditionalPhoto = (index: number) => {
    const updated = [...(record.additionalPhotos || [])];
    updated.splice(index, 1);
    updateRecord(record.id, { additionalPhotos: updated });
  };

  const saveMaintenanceId = () => {
    if (editMaintenanceId && editMaintenanceId !== record.maintenanceId) {
      updateRecord(record.id, { maintenanceId: editMaintenanceId });
      toast.success("تم تحديث رقم الصيانة");
    }
  };

  const saveReceivedDate = () => {
    if (editReceivedDate && editReceivedDate !== record.receivedDate) {
      updateRecord(record.id, { receivedDate: editReceivedDate });
      toast.success("تم تحديث تاريخ الاستلام");
    }
  };

  const saveFailureAnalysis = () => {
    updateRecord(record.id, { failureAnalysis });
    toast.success("تم حفظ أسباب العطل");
  };

  const handlePrint = (mode: PrintMode) => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      // Reset after print dialog closes
      setTimeout(() => setPrintMode("none"), 500);
    }, 100);
  };

  return (
    <div
      className={`max-w-4xl mx-auto space-y-6 pb-8 print:max-w-none print:p-0 print:space-y-3 ${
        printMode === "quotation" ? "print-quotation" : printMode === "technical" ? "print-technical" : ""
      }`}
    >
      {/* Professional Print Header */}
      <PrintHeader />

      {/* Print Report Title */}
      <div className="hidden print:block text-center mb-2">
        <h2 className="text-lg font-extrabold text-foreground">
          {printMode === "quotation" ? "عرض سعر" : "تقرير فني"}
        </h2>
      </div>

      {/* Screen Header */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold text-foreground">تفاصيل الصيانة</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg shadow-sm"
            onClick={() => handlePrint("quotation")}
          >
            <FileBarChart className="w-4 h-4 ml-2" />
            طباعة عرض سعر
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg shadow-sm"
            onClick={() => handlePrint("technical")}
          >
            <FileText className="w-4 h-4 ml-2" />
            طباعة تقرير فني
          </Button>
        </div>
      </div>

      {/* Customer & Device Info */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 print:shadow-none print:border print:rounded-none print:p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 print:gap-2 print:grid-cols-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1 block print:text-[9pt]">رقم الصيانة</Label>
            <Input
              value={editMaintenanceId}
              onChange={(e) => setEditMaintenanceId(e.target.value)}
              onBlur={saveMaintenanceId}
              className="font-bold text-lg font-mono rounded-lg print:border-0 print:p-0 print:shadow-none print:bg-transparent print:text-[10pt]"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 print:text-[9pt]">العميل</p>
            <p
              className="font-semibold text-primary cursor-pointer hover:underline print:cursor-default print:no-underline print:text-[10pt] print:text-foreground"
              onClick={() => navigate(`/customers/${record.customerId}`)}
            >
              {customer?.name}
            </p>
            <p className="text-xs text-muted-foreground print:text-[9pt]">{customer?.phone}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 print:text-[9pt]">الجهاز</p>
            <p className="font-semibold text-foreground print:text-[10pt]">{record.itemName}</p>
            <p className="text-xs text-muted-foreground font-mono print:text-[9pt]">{record.itemId}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1 block print:text-[9pt]">تاريخ الاستلام</Label>
            <Input
              type="date"
              value={editReceivedDate}
              onChange={(e) => setEditReceivedDate(e.target.value)}
              onBlur={saveReceivedDate}
              className="rounded-lg print:border-0 print:p-0 print:shadow-none print:bg-transparent print:text-[10pt]"
            />
            {record.deliveryDate && (
              <>
                <p className="text-xs font-medium text-muted-foreground mt-2 mb-1 print:text-[9pt]">تاريخ التسليم</p>
                <p className="font-semibold text-foreground print:text-[10pt]">{record.deliveryDate}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Status Overview */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-5 print:shadow-none print:border print:rounded-none print:p-3 print:space-y-2">
        <h3 className="font-bold text-foreground print:text-[11pt]">حالة الطلب</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 print:grid-cols-3 print:gap-2">
          {/* Maintenance */}
          <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between print:bg-transparent print:border print:border-border print:p-2">
            <div className="flex items-center gap-3 print:gap-1">
              <Wrench className="w-5 h-5 text-muted-foreground print:w-4 print:h-4" />
              <div>
                <span className="text-sm font-semibold text-foreground block print:text-[10pt]">الصيانة</span>
                <span className={`text-xs font-semibold print:text-[9pt] ${record.isCompleted ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
                  {record.isCompleted ? "مكتملة" : "قيد الانتظار"}
                </span>
              </div>
            </div>
            <StatusCircle
              active={record.isCompleted}
              onClick={() =>
                updateRecord(record.id, {
                  isCompleted: !record.isCompleted,
                  deliveryDate: !record.isCompleted ? new Date().toISOString().split("T")[0] : undefined,
                })
              }
            />
          </div>

          {/* Payment */}
          <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between print:bg-transparent print:border print:border-border print:p-2">
            <div className="flex items-center gap-3 print:gap-1">
              <DollarSign className="w-5 h-5 text-muted-foreground print:w-4 print:h-4" />
              <div>
                <span className="text-sm font-semibold text-foreground block print:text-[10pt]">الدفع</span>
                <span className={`text-xs font-semibold print:text-[9pt] ${record.isPaid ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
                  {record.isPaid ? "مدفوع" : "غير مدفوع"}
                </span>
              </div>
            </div>
            <StatusCircle
              active={record.isPaid}
              onClick={() => {
                updateRecord(record.id, { isPaid: !record.isPaid });
                toast.success(record.isPaid ? "تم إلغاء الدفع" : "تم تسجيل الدفع");
              }}
            />
          </div>

          {/* Warranty */}
          <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between print:bg-transparent print:border print:border-border print:p-2">
            <div className="flex items-center gap-3 print:gap-1">
              {record.isUnderWarranty ? (
                <ShieldCheck className="w-5 h-5 text-[hsl(var(--success))] print:w-4 print:h-4" />
              ) : (
                <ShieldX className="w-5 h-5 text-[hsl(var(--destructive))] print:w-4 print:h-4" />
              )}
              <div>
                <span className="text-sm font-semibold text-foreground block print:text-[10pt]">الضمان</span>
                <span className={`text-xs font-semibold print:text-[9pt] ${record.isUnderWarranty ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
                  {record.isUnderWarranty ? "تحت الضمان" : "بدون ضمان"}
                </span>
              </div>
            </div>
            <StatusCircle
              active={record.isUnderWarranty}
              onClick={() => updateRecord(record.id, { isUnderWarranty: !record.isUnderWarranty })}
            />
          </div>
        </div>
      </section>

      {/* Failure Analysis - Technical Report section */}
      <section className={`bg-card rounded-xl shadow-sm border border-border p-6 space-y-3 print:shadow-none print:border print:rounded-none print:p-3 print-quotation-hide ${!failureAnalysis.trim() ? 'print-no-photos-hide' : ''}`}>
        <h3 className="font-bold text-foreground print:text-[11pt]">أسباب العطل</h3>
        <Textarea
          value={failureAnalysis}
          onChange={(e) => setFailureAnalysis(e.target.value)}
          onBlur={saveFailureAnalysis}
          placeholder="اكتب وصف العطل وأسبابه هنا..."
          className="min-h-[100px] rounded-lg print:border-0 print:p-0 print:shadow-none print:bg-transparent print:text-[10pt] print:min-h-0"
        />
      </section>

      {/* Photo Documentation - Single unified section */}
      <section className={`bg-card rounded-xl shadow-sm border border-border p-6 space-y-4 print:shadow-none print:border print:rounded-none print:p-3 print-quotation-hide ${!hasPhotos ? 'print-no-photos-hide' : ''}`}>
        <h3 className="font-bold text-foreground print:text-[11pt]">صور الصيانة</h3>

        {/* All photos grid */}
        {hasPhotos && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2">
            {record.beforePhoto && (
              <div className="relative group rounded-lg border border-border overflow-hidden">
                <img src={record.beforePhoto} alt="صورة صيانة" className="w-full h-32 object-cover print:h-auto print:max-h-28" />
                <button
                  onClick={() => updateRecord(record.id, { beforePhoto: undefined })}
                  className="print:hidden absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {record.afterPhoto && (
              <div className="relative group rounded-lg border border-border overflow-hidden">
                <img src={record.afterPhoto} alt="صورة صيانة" className="w-full h-32 object-cover print:h-auto print:max-h-28" />
                <button
                  onClick={() => updateRecord(record.id, { afterPhoto: undefined })}
                  className="print:hidden absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {record.additionalPhotos?.map((photo, i) => (
              <div key={i} className="relative group rounded-lg border border-border overflow-hidden">
                <img src={photo} alt={`صورة ${i + 1}`} className="w-full h-32 object-cover print:h-auto print:max-h-28" />
                <button
                  onClick={() => removeAdditionalPhoto(i)}
                  className="print:hidden absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={additionalPhotoRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoUpload}
        />
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg print:hidden"
          onClick={() => additionalPhotoRef.current?.click()}
        >
          <ImagePlus className="w-4 h-4 ml-2" />
          إضافة صور
        </Button>
      </section>

      {/* Spare Parts & Cost Table */}
      <section className="bg-card rounded-xl shadow-sm border border-border overflow-hidden print:shadow-none print:rounded-none">
        <div className="p-5 border-b border-border print:p-3">
          <h3 className="font-bold text-foreground print:text-[11pt]">قطع الغيار والتكلفة</h3>
        </div>
        <div className="p-5 print:p-3">
          <table className="w-full mb-5 print:mb-2">
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground border-b border-border print:text-[9pt]">
                <th className="text-right pb-3 print:pb-1">البند</th>
                <th className="text-right pb-3 print:pb-1">السعر</th>
                <th className="pb-3 w-10 print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {record.spareParts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-sm text-foreground print:py-1 print:text-[10pt]">{p.name}</td>
                  <td className="py-3 text-sm font-mono text-foreground print:py-1 print:text-[10pt]">{p.price} ر.س</td>
                  <td className="py-3 print:hidden">
                    <button
                      onClick={() => removePart(p.id)}
                      className="text-destructive hover:text-destructive/70 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Labor fee row */}
              <tr className="border-b border-border">
                <td className="py-3 text-sm text-foreground print:py-1 print:text-[10pt]">أجرة الصيانة</td>
                <td className="py-3 text-sm font-mono text-foreground print:py-1 print:text-[10pt]">{record.laborFee} ر.س</td>
                <td className="print:hidden"></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-foreground">
                <td className="py-3 text-base font-bold text-foreground print:py-2 print:text-[11pt]">الإجمالي</td>
                <td className="py-3 text-base font-bold font-mono text-primary print:py-2 print:text-[11pt]">{total} ر.س</td>
                <td className="print:hidden"></td>
              </tr>
            </tfoot>
          </table>

          {/* Add parts form - screen only */}
          <div className="flex gap-2 print:hidden">
            <Input
              placeholder="اسم القطعة"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="flex-1 rounded-lg"
            />
            <Input
              placeholder="السعر"
              type="number"
              value={newPartPrice}
              onChange={(e) => setNewPartPrice(e.target.value)}
              className="w-28 rounded-lg"
            />
            <Button onClick={addPart} size="sm" className="rounded-lg shadow-sm">
              إضافة
            </Button>
          </div>
        </div>
      </section>

      {/* Labor Fee Edit - screen only */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4 print:hidden">
        <h3 className="font-bold text-foreground">تعديل أجرة الصيانة</h3>
        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold">أجرة الصيانة:</Label>
          <Input
            type="number"
            value={laborFee}
            onChange={(e) => setLaborFee(e.target.value)}
            onBlur={updateLaborFee}
            className="w-32 rounded-lg"
          />
          <span className="text-sm text-muted-foreground">ر.س</span>
        </div>
      </section>

      {/* Notes */}
      {record.notes && (
        <section className="bg-card rounded-xl shadow-sm border border-border p-6 print:shadow-none print:rounded-none print:p-3">
          <h3 className="font-bold text-foreground mb-2 print:text-[11pt]">ملاحظات</h3>
          <p className="text-sm text-muted-foreground leading-relaxed print:text-[10pt]">{record.notes}</p>
        </section>
      )}
    </div>
  );
};

export default MaintenanceDetail;
