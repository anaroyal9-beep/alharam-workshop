import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewMaintenance = () => {
  const { customers, addCustomer, addRecord, generateMaintenanceId, searchCustomers } = useWorkshop();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [maintenanceId, setMaintenanceId] = useState("");
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split("T")[0]);
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [notes, setNotes] = useState("");

  const filtered = customerSearch ? searchCustomers(customerSearch) : [];

  const handleSubmit = () => {
    let custId = selectedCustomerId;
    if (showNewCustomer) {
      if (!newName || !newPhone) {
        toast.error(t("enterCustomerNamePhone"));
        return;
      }
      const c = addCustomer({ name: newName, phone: newPhone, company: newCompany || undefined });
      custId = c.id;
    }
    if (!custId) { toast.error(t("selectCustomer")); return; }
    if (!itemName) { toast.error(t("enterDeviceName")); return; }
    if (!maintenanceId.trim()) { toast.error(t("enterMaintenanceNumber")); return; }

    const record = addRecord({
      maintenanceId: maintenanceId.trim(),
      customerId: custId,
      itemName,
      itemId: itemId || `ITM-${Date.now()}`,
      receivedDate,
      isCompleted: false,
      isPaid: false,
      isUnderWarranty: false,
      spareParts: [],
      laborFee: 0,
      notes: notes || undefined,
    });
    toast.success(`${t("maintenanceCreated")} ${maintenanceId}`);
    navigate(`/maintenance/${record.id}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">{t("newMaintenance")}</h2>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-5">
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t("maintenanceData")}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">{t("maintenanceNumber")}</Label>
              <Input placeholder={t("enterMaintenanceId")} value={maintenanceId} onChange={(e) => setMaintenanceId(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">{t("date")}</Label>
              <Input type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">{t("customer")}</Label>
          {!showNewCustomer ? (
            <>
              <Input
                placeholder={t("searchByNameOrPhone")}
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
                + {t("addNewCustomer")}
              </Button>
            </>
          ) : (
            <div className="space-y-3 border border-border rounded-lg p-4">
              <Input placeholder={t("customerName")} value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input placeholder={t("phoneNumber")} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              <Input placeholder={t("companyOptional")} value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
              <Button variant="ghost" size="sm" onClick={() => setShowNewCustomer(false)}>
                {t("selectExistingCustomer")}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">{t("deviceDetails")}</Label>
          <Input placeholder={t("deviceName")} value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <Input placeholder={t("deviceIdOptional")} value={itemId} onChange={(e) => setItemId(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>{t("notes")}</Label>
          <Textarea placeholder={t("additionalNotes")} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} className="w-full">{t("createMaintenanceOrder")}</Button>
      </div>
    </div>
  );
};

export default NewMaintenance;
