import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewMaintenance = () => {
  const { customers, addCustomer, addRecord, generateMaintenanceId, searchCustomers } = useWorkshop();
  const navigate = useNavigate();

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = customerSearch ? searchCustomers(customerSearch) : [];

  const handleSubmit = () => {
    let custId = selectedCustomerId;
    if (showNewCustomer) {
      if (!newName || !newPhone) {
        toast.error("يرجى إدخال اسم ورقم هاتف العميل");
        return;
      }
      const c = addCustomer({ name: newName, phone: newPhone, company: newCompany || undefined });
      custId = c.id;
    }
    if (!custId) { toast.error("يرجى اختيار عميل"); return; }
    if (!itemName) { toast.error("يرجى إدخال اسم الجهاز"); return; }

    const maintenanceId = generateMaintenanceId();
    const record = addRecord({
      maintenanceId,
      customerId: custId,
      itemName,
      itemId: itemId || `ITM-${Date.now()}`,
      receivedDate: new Date().toISOString().split("T")[0],
      isCompleted: false,
      isPaid: false,
      isUnderWarranty: false,
      spareParts: [],
      laborFee: 0,
      notes: notes || undefined,
    });
    toast.success(`تم إنشاء طلب الصيانة ${maintenanceId}`);
    navigate(`/maintenance/${record.id}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">طلب صيانة جديد</h2>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-5">
        {/* Customer Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">العميل</Label>
          {!showNewCustomer ? (
            <>
              <Input
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setSelectedCustomerId(""); }}
              />
              {customerSearch && filtered.length > 0 && (
                <div className="border border-border rounded-lg divide-y divide-border">
                  {filtered.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedCustomerId === c.id ? "bg-primary/10" : ""}`}
                      onClick={() => { setSelectedCustomerId(c.id); setCustomerSearch(c.name); }}
                    >
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.phone} {c.company && `• ${c.company}`}</p>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowNewCustomer(true)}>
                + إضافة عميل جديد
              </Button>
            </>
          ) : (
            <div className="space-y-3 border border-border rounded-lg p-4">
              <Input placeholder="اسم العميل" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input placeholder="رقم الهاتف" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              <Input placeholder="الشركة (اختياري)" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
              <Button variant="ghost" size="sm" onClick={() => setShowNewCustomer(false)}>
                اختيار عميل موجود
              </Button>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">تفاصيل الجهاز</Label>
          <Input placeholder="اسم الجهاز" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <Input placeholder="رقم الجهاز (اختياري)" value={itemId} onChange={(e) => setItemId(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>ملاحظات</Label>
          <Textarea placeholder="ملاحظات إضافية..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} className="w-full">إنشاء طلب الصيانة</Button>
      </div>
    </div>
  );
};

export default NewMaintenance;
