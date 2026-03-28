import { useParams, useNavigate } from "react-router-dom";
import { useWorkshop, SparePart } from "@/context/WorkshopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Trash2, Printer, Camera, ShieldCheck, ShieldX } from "lucide-react";

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
    return <div className="text-center py-12 text-muted-foreground">لم يتم العثور على السجل</div>;
  }

  const customer = getCustomerById(record.customerId);
  const partsTotal = record.spareParts.reduce((s, p) => s + p.price, 0);
  const total = partsTotal + record.laborFee;

  const addPart = () => {
    if (!newPartName || !newPartPrice) return;
    const part: SparePart = { id: Math.random().toString(36).substring(2), name: newPartName, price: Number(newPartPrice) };
    updateRecord(record.id, { spareParts: [...record.spareParts, part] });
    setNewPartName("");
    setNewPartPrice("");
    toast.success("تمت إضافة القطعة");
  };

  const removePart = (partId: string) => {
    updateRecord(record.id, { spareParts: record.spareParts.filter((p) => p.id !== partId) });
  };

  const updateLaborFee = () => {
    updateRecord(record.id, { laborFee: Number(laborFee) });
    toast.success("تم تحديث أجرة الصيانة");
  };

  const handlePhotoUpload = (type: "beforePhoto" | "afterPhoto", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateRecord(record.id, { [type]: reader.result as string });
      toast.success(type === "beforePhoto" ? "تم رفع صورة قبل الصيانة" : "تم رفع صورة بعد الصيانة");
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">تفاصيل الصيانة</h2>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 ml-2" />
          طباعة
        </Button>
      </div>

      {/* Header Info */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">رقم الصيانة</p>
          <p className="font-bold text-lg">{record.maintenanceId}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">العميل</p>
          <p
            className="font-medium text-primary cursor-pointer hover:underline"
            onClick={() => navigate(`/customers/${record.customerId}`)}
          >
            {customer?.name}
          </p>
          <p className="text-sm text-muted-foreground">{customer?.phone}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">الجهاز</p>
          <p className="font-medium">{record.itemName}</p>
          <p className="text-xs text-muted-foreground">{record.itemId}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">تاريخ الاستلام</p>
          <p className="font-medium">{record.receivedDate}</p>
          {record.deliveryDate && (
            <>
              <p className="text-sm text-muted-foreground mt-1">تاريخ التسليم</p>
              <p className="font-medium">{record.deliveryDate}</p>
            </>
          )}
        </div>
      </div>

      {/* Status Labels & Actions */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-4">
        <h3 className="font-semibold">حالة الطلب</h3>
        <div className="flex flex-wrap gap-6 items-center">
          {/* Maintenance Status */}
          <div className="flex items-center gap-3">
            <Switch
              checked={record.isCompleted}
              onCheckedChange={(v) => {
                updateRecord(record.id, {
                  isCompleted: v,
                  deliveryDate: v ? new Date().toISOString().split("T")[0] : undefined,
                });
              }}
            />
            <Label>الصيانة</Label>
            <Badge className={record.isCompleted
              ? "bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20"
              : "bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/20"
            }>
              {record.isCompleted ? "مكتملة" : "قيد الانتظار"}
            </Badge>
          </div>

          {/* Payment Status */}
          <div className="flex items-center gap-3">
            {!record.isPaid ? (
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  updateRecord(record.id, { isPaid: true });
                  toast.success("تم تسجيل الدفع");
                }}
              >
                ادفع الآن
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateRecord(record.id, { isPaid: false })}
              >
                إلغاء الدفع
              </Button>
            )}
            <Badge className={record.isPaid
              ? "bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20"
              : "bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/20"
            }>
              {record.isPaid ? "مدفوع" : "غير مدفوع"}
            </Badge>
          </div>

          {/* Warranty Status */}
          <div className="flex items-center gap-3">
            <Switch
              checked={record.isUnderWarranty}
              onCheckedChange={(v) => updateRecord(record.id, { isUnderWarranty: v })}
            />
            <Label>الضمان</Label>
            {record.isUnderWarranty ? (
              <Badge className="bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20">
                <ShieldCheck className="w-3 h-3 ml-1" /> تحت الضمان
              </Badge>
            ) : (
              <Badge className="bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/20">
                <ShieldX className="w-3 h-3 ml-1" /> بدون ضمان
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Photo Documentation */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-4">
        <h3 className="font-semibold">توثيق بالصور</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before Photo */}
          <div className="space-y-2">
            <Label>صورة قبل الصيانة</Label>
            <input ref={beforePhotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload("beforePhoto", e)} />
            {record.beforePhoto ? (
              <div className="relative group">
                <img src={record.beforePhoto} alt="قبل الصيانة" className="w-full h-48 object-cover rounded-lg border border-border" />
                <button
                  onClick={() => beforePhotoRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-sm"
                >
                  تغيير الصورة
                </button>
              </div>
            ) : (
              <button
                onClick={() => beforePhotoRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm">رفع صورة</span>
              </button>
            )}
          </div>

          {/* After Photo */}
          <div className="space-y-2">
            <Label>صورة بعد الصيانة</Label>
            <input ref={afterPhotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload("afterPhoto", e)} />
            {record.afterPhoto ? (
              <div className="relative group">
                <img src={record.afterPhoto} alt="بعد الصيانة" className="w-full h-48 object-cover rounded-lg border border-border" />
                <button
                  onClick={() => afterPhotoRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-sm"
                >
                  تغيير الصورة
                </button>
              </div>
            ) : (
              <button
                onClick={() => afterPhotoRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm">رفع صورة</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spare Parts */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">قطع الغيار</h3>
        </div>
        <div className="p-4">
          {record.spareParts.length > 0 && (
            <table className="w-full mb-4">
              <thead>
                <tr className="text-sm text-muted-foreground border-b border-border">
                  <th className="text-right pb-2">القطعة</th>
                  <th className="text-right pb-2">السعر</th>
                  <th className="pb-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {record.spareParts.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.price} ر.س</td>
                    <td className="py-2">
                      <button onClick={() => removePart(p.id)} className="text-destructive hover:text-destructive/70">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex gap-2">
            <Input placeholder="اسم القطعة" value={newPartName} onChange={(e) => setNewPartName(e.target.value)} className="flex-1" />
            <Input placeholder="السعر" type="number" value={newPartPrice} onChange={(e) => setNewPartPrice(e.target.value)} className="w-28" />
            <Button onClick={addPart} size="sm">إضافة</Button>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-4">
        <h3 className="font-semibold">ملخص التكلفة</h3>
        <div className="flex items-center gap-3">
          <Label>أجرة الصيانة:</Label>
          <Input
            type="number"
            value={laborFee}
            onChange={(e) => setLaborFee(e.target.value)}
            onBlur={updateLaborFee}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">ر.س</span>
        </div>
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">إجمالي القطع</span>
            <span>{partsTotal} ر.س</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">أجرة الصيانة</span>
            <span>{record.laborFee} ر.س</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
            <span>الإجمالي</span>
            <span className="text-primary">{total} ر.س</span>
          </div>
        </div>
      </div>

      {record.notes && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h3 className="font-semibold mb-2">ملاحظات</h3>
          <p className="text-muted-foreground">{record.notes}</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceDetail;
