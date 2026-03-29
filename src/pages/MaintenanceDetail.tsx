import { useParams, useNavigate } from "react-router-dom";
import { useWorkshop, SparePart } from "@/context/WorkshopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Printer,
  Camera,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ShieldCheck,
  ShieldX,
  ImagePlus,
  X,
  DollarSign,
} from "lucide-react";

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
    className="print:pointer-events-none transition-all flex-shrink-0"
    aria-label="تبديل الحالة"
  >
    {active ? (
      <div className="w-8 h-8 rounded-full bg-[hsl(var(--success))] flex items-center justify-center shadow-md print:shadow-none print:border-2 print:border-[hsl(var(--success))]">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

  const beforePhotoRef = useRef<HTMLInputElement>(null);
  const afterPhotoRef = useRef<HTMLInputElement>(null);
  const additionalPhotoRef = useRef<HTMLInputElement>(null);

  if (!record) {
    return (
      <div className="text-center py-12 text-muted-foreground">لم يتم العثور على السجل</div>
    );
  }

  const customer = getCustomerById(record.customerId);
  const partsTotal = record.spareParts.reduce((s, p) => s + p.price, 0);
  const total = partsTotal + record.laborFee;

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

  const handlePhotoUpload = (
    type: "beforePhoto" | "afterPhoto",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateRecord(record.id, { [type]: reader.result as string });
      toast.success(type === "beforePhoto" ? "تم رفع صورة قبل الصيانة" : "تم رفع صورة بعد الصيانة");
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    toast.success("تم رفع الصور الإضافية");
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 print:max-w-none print:p-0">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold text-foreground">تفاصيل الصيانة</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg shadow-sm"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 ml-2" />
          طباعة
        </Button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center border-b-2 border-foreground pb-4 mb-6">
        <h1 className="text-2xl font-extrabold">ورشة الهرم المثالي</h1>
        <p className="text-sm text-muted-foreground">تقرير صيانة</p>
      </div>

      {/* Customer & Device Info — editable fields */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 print:shadow-none print:border print:rounded-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Maintenance ID — editable */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1 block">رقم الصيانة</Label>
            <Input
              value={editMaintenanceId}
              onChange={(e) => setEditMaintenanceId(e.target.value)}
              onBlur={saveMaintenanceId}
              className="font-bold text-lg font-mono rounded-lg print:border-0 print:p-0 print:shadow-none print:bg-transparent"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">العميل</p>
            <p
              className="font-semibold text-primary cursor-pointer hover:underline print:cursor-default print:no-underline"
              onClick={() => navigate(`/customers/${record.customerId}`)}
            >
              {customer?.name}
            </p>
            <p className="text-xs text-muted-foreground">{customer?.phone}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">الجهاز</p>
            <p className="font-semibold text-foreground">{record.itemName}</p>
            <p className="text-xs text-muted-foreground font-mono">{record.itemId}</p>
          </div>
          {/* Received Date — editable */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1 block">تاريخ الاستلام</Label>
            <Input
              type="date"
              value={editReceivedDate}
              onChange={(e) => setEditReceivedDate(e.target.value)}
              onBlur={saveReceivedDate}
              className="rounded-lg print:border-0 print:p-0 print:shadow-none print:bg-transparent"
            />
            {record.deliveryDate && (
              <>
                <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">تاريخ التسليم</p>
                <p className="font-semibold text-foreground">{record.deliveryDate}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Status Overview — clickable circles */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-5 print:shadow-none print:border print:rounded-none">
        <h3 className="font-bold text-foreground">حالة الطلب</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Maintenance */}
          <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between print:bg-transparent print:border print:border-border">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              <div>
                <span className="text-sm font-semibold text-foreground block">الصيانة</span>
                <span className={`text-xs font-semibold ${record.isCompleted ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
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
          <div className="bg-muted/40 rounded-lg p-4 space-y-3 print:bg-transparent print:border print:border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-semibold text-foreground block">الدفع</span>
                  <span className={`text-xs font-semibold ${record.isPaid ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
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
            {!record.isPaid && (
              <Button
                size="sm"
                className="w-full rounded-lg shadow-sm print:hidden"
                onClick={() => {
                  updateRecord(record.id, { isPaid: true });
                  toast.success("تم تسجيل الدفع");
                }}
              >
                ادفع الآن
              </Button>
            )}
          </div>

          {/* Warranty */}
          <div className="bg-muted/40 rounded-lg p-4 flex items-center justify-between print:bg-transparent print:border print:border-border">
            <div className="flex items-center gap-3">
              {record.isUnderWarranty ? (
                <ShieldCheck className="w-5 h-5 text-[hsl(var(--success))]" />
              ) : (
                <ShieldX className="w-5 h-5 text-[hsl(var(--destructive))]" />
              )}
              <div>
                <span className="text-sm font-semibold text-foreground block">الضمان</span>
                <span className={`text-xs font-semibold ${record.isUnderWarranty ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
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

      {/* Photo Documentation */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4 print:shadow-none print:border print:rounded-none">
        <h3 className="font-bold text-foreground">توثيق بالصور</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Before Photo */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">صورة قبل الصيانة</Label>
            <input
              ref={beforePhotoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoUpload("beforePhoto", e)}
            />
            {record.beforePhoto ? (
              <div className="relative group rounded-lg border border-border overflow-hidden">
                <img src={record.beforePhoto} alt="قبل الصيانة" className="w-full h-52 object-cover print:h-auto print:max-h-48" />
                <button
                  onClick={() => beforePhotoRef.current?.click()}
                  className="print:hidden absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-card text-sm font-medium"
                >
                  <Camera className="w-5 h-5 ml-2" />
                  تغيير الصورة
                </button>
              </div>
            ) : (
              <button
                onClick={() => beforePhotoRef.current?.click()}
                className="print:hidden w-full h-52 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">رفع صورة</span>
              </button>
            )}
          </div>

          {/* After Photo */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">صورة بعد الصيانة</Label>
            <input
              ref={afterPhotoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoUpload("afterPhoto", e)}
            />
            {record.afterPhoto ? (
              <div className="relative group rounded-lg border border-border overflow-hidden">
                <img src={record.afterPhoto} alt="بعد الصيانة" className="w-full h-52 object-cover print:h-auto print:max-h-48" />
                <button
                  onClick={() => afterPhotoRef.current?.click()}
                  className="print:hidden absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-card text-sm font-medium"
                >
                  <Camera className="w-5 h-5 ml-2" />
                  تغيير الصورة
                </button>
              </div>
            ) : (
              <button
                onClick={() => afterPhotoRef.current?.click()}
                className="print:hidden w-full h-52 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">رفع صورة</span>
              </button>
            )}
          </div>
        </div>

        {/* Additional Photos */}
        {(record.additionalPhotos?.length ?? 0) > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {record.additionalPhotos!.map((photo, i) => (
              <div key={i} className="relative group rounded-lg border border-border overflow-hidden">
                <img src={photo} alt={`صورة إضافية ${i + 1}`} className="w-full h-32 object-cover print:h-auto print:max-h-32" />
                <button
                  onClick={() => removeAdditionalPhoto(i)}
                  className="print:hidden absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
          onChange={handleAdditionalPhotos}
        />
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg print:hidden"
          onClick={() => additionalPhotoRef.current?.click()}
        >
          <ImagePlus className="w-4 h-4 ml-2" />
          إضافة صور أخرى
        </Button>
      </section>

      {/* Spare Parts */}
      <section className="bg-card rounded-xl shadow-sm border border-border overflow-hidden print:shadow-none print:rounded-none">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-foreground">قطع الغيار</h3>
        </div>
        <div className="p-5">
          {record.spareParts.length > 0 && (
            <table className="w-full mb-5">
              <thead>
                <tr className="text-xs font-semibold text-muted-foreground border-b border-border">
                  <th className="text-right pb-3">القطعة</th>
                  <th className="text-right pb-3">السعر</th>
                  <th className="pb-3 w-10 print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {record.spareParts.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{p.name}</td>
                    <td className="py-3 text-sm font-mono text-foreground">{p.price} ر.س</td>
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
              </tbody>
            </table>
          )}
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

      {/* Cost Summary */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4 print:shadow-none print:rounded-none">
        <h3 className="font-bold text-foreground">ملخص التكلفة</h3>
        <div className="flex items-center gap-3 print:hidden">
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
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">إجمالي القطع</span>
            <span className="font-mono text-foreground">{partsTotal} ر.س</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">أجرة الصيانة</span>
            <span className="font-mono text-foreground">{record.laborFee} ر.س</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
            <span className="text-foreground">الإجمالي</span>
            <span className="text-primary font-mono">{total} ر.س</span>
          </div>
        </div>
      </section>

      {/* Notes */}
      {record.notes && (
        <section className="bg-card rounded-xl shadow-sm border border-border p-6 print:shadow-none print:rounded-none">
          <h3 className="font-bold text-foreground mb-2">ملاحظات</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{record.notes}</p>
        </section>
      )}
    </div>
  );
};

export default MaintenanceDetail;
