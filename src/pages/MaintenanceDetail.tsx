import { useParams, useNavigate } from "react-router-dom";
import { useWorkshop, SparePart } from "@/context/WorkshopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Printer,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

const StatusBadge = ({
  active,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeIcon: React.ElementType;
  inactiveIcon: React.ElementType;
  activeLabel: string;
  inactiveLabel: string;
}) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold print:border ${
      active
        ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] print:border-[hsl(var(--success))]"
        : "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))] print:border-[hsl(var(--destructive))]"
    }`}
  >
    {active ? <ActiveIcon className="w-4 h-4" /> : <InactiveIcon className="w-4 h-4" />}
    {active ? activeLabel : inactiveLabel}
  </div>
);

const MaintenanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { records, updateRecord, getCustomerById } = useWorkshop();
  const navigate = useNavigate();
  const record = records.find((r) => r.id === id);

  const [newPartName, setNewPartName] = useState("");
  const [newPartPrice, setNewPartPrice] = useState("");
  const [laborFee, setLaborFee] = useState(record?.laborFee?.toString() || "0");
  const beforePhotoRef = useRef<HTMLInputElement>(null);
  const afterPhotoRef = useRef<HTMLInputElement>(null);

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
      toast.success(
        type === "beforePhoto" ? "تم رفع صورة قبل الصيانة" : "تم رفع صورة بعد الصيانة"
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">تفاصيل الصيانة</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg shadow-sm print:hidden"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 ml-2" />
          طباعة
        </Button>
      </div>

      {/* Customer & Device Info */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">رقم الصيانة</p>
            <p className="font-bold text-lg font-mono text-foreground">{record.maintenanceId}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">العميل</p>
            <p
              className="font-semibold text-primary cursor-pointer hover:underline"
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
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">تاريخ الاستلام</p>
            <p className="font-semibold text-foreground">{record.receivedDate}</p>
            {record.deliveryDate && (
              <>
                <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">تاريخ التسليم</p>
                <p className="font-semibold text-foreground">{record.deliveryDate}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Status Overview */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-5">
        <h3 className="font-bold text-foreground">حالة الطلب</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Maintenance Status */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">الصيانة</span>
              <Switch
                className="print:hidden"
                checked={record.isCompleted}
                onCheckedChange={(v) =>
                  updateRecord(record.id, {
                    isCompleted: v,
                    deliveryDate: v ? new Date().toISOString().split("T")[0] : undefined,
                  })
                }
              />
            </div>
            <StatusBadge
              active={record.isCompleted}
              activeIcon={Wrench}
              inactiveIcon={Clock}
              activeLabel="مكتملة"
              inactiveLabel="قيد الانتظار"
            />
          </div>

          {/* Payment Status */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <span className="text-sm font-semibold text-foreground block">الدفع</span>
            <StatusBadge
              active={record.isPaid}
              activeIcon={CheckCircle2}
              inactiveIcon={AlertCircle}
              activeLabel="مدفوع"
              inactiveLabel="غير مدفوع"
            />
            <div className="print:hidden">
              {!record.isPaid ? (
                <Button
                  size="sm"
                  className="w-full rounded-lg shadow-sm"
                  onClick={() => {
                    updateRecord(record.id, { isPaid: true });
                    toast.success("تم تسجيل الدفع");
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                  ادفع الآن
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-lg"
                  onClick={() => updateRecord(record.id, { isPaid: false })}
                >
                  إلغاء الدفع
                </Button>
              )}
            </div>
          </div>

          {/* Warranty Status */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">الضمان</span>
              <Switch
                className="print:hidden"
                checked={record.isUnderWarranty}
                onCheckedChange={(v) => updateRecord(record.id, { isUnderWarranty: v })}
              />
            </div>
            <StatusBadge
              active={record.isUnderWarranty}
              activeIcon={ShieldCheck}
              inactiveIcon={ShieldX}
              activeLabel="تحت الضمان"
              inactiveLabel="بدون ضمان"
            />
          </div>
        </div>
      </section>

      {/* Photo Documentation */}
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
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
                <img
                  src={record.beforePhoto}
                  alt="قبل الصيانة"
                  className="w-full h-52 object-cover"
                />
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
                <img
                  src={record.afterPhoto}
                  alt="بعد الصيانة"
                  className="w-full h-52 object-cover"
                />
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
      </section>

      {/* Spare Parts */}
      <section className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
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
      <section className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
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
        <section className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="font-bold text-foreground mb-2">ملاحظات</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{record.notes}</p>
        </section>
      )}
    </div>
  );
};

export default MaintenanceDetail;
