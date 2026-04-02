import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "ar" | "en";

interface Translations {
  [key: string]: { ar: string; en: string };
}

const translations: Translations = {
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  newMaintenance: { ar: "طلب صيانة جديد", en: "New Maintenance" },
  maintenanceRecords: { ar: "سجلات الصيانة", en: "Maintenance Records" },
  customers: { ar: "العملاء", en: "Customers" },
  dailyLedger: { ar: "اليومية", en: "Daily Ledger" },
  search: { ar: "البحث المتقدم", en: "Advanced Search" },
  technicians: { ar: "كارت التشغيل", en: "Technicians" },
  maintenanceWarranty: { ar: "ضمان صيانة", en: "Maintenance Warranty" },
  noMaintenanceWarranty: { ar: "بدون ضمان صيانة", en: "No Maintenance Warranty" },
  withinWarranty: { ar: "داخل مدة ضمان الصيانة", en: "Within Maintenance Warranty Period" },
  outsideWarranty: { ar: "خارج مدة ضمان الصيانة", en: "Outside Maintenance Warranty Period" },
  technicianName: { ar: "اسم الفني", en: "Technician Name" },
  maintenance: { ar: "الصيانة", en: "Maintenance" },
  payment: { ar: "الدفع", en: "Payment" },
  warranty: { ar: "الضمان", en: "Warranty" },
  completed: { ar: "مكتملة", en: "Completed" },
  pending: { ar: "قيد الانتظار", en: "Pending" },
  paid: { ar: "مدفوع", en: "Paid" },
  unpaid: { ar: "غير مدفوع", en: "Unpaid" },
  totalOrders: { ar: "إجمالي الطلبات", en: "Total Orders" },
  underMaintenance: { ar: "قيد الصيانة", en: "Under Maintenance" },
  completedOrders: { ar: "مكتملة", en: "Completed" },
  unpaidBills: { ar: "غير مدفوعة", en: "Unpaid" },
  underWarranty: { ar: "تحت ضمان الصيانة", en: "Under Warranty" },
  orderStatus: { ar: "حالة الطلب", en: "Order Status" },
  failureAnalysis: { ar: "أسباب العطل", en: "Failure Analysis" },
  maintenancePhotos: { ar: "صور الصيانة", en: "Maintenance Photos" },
  spareParts: { ar: "قطع الغيار والتكلفة", en: "Spare Parts & Cost" },
  maintenanceDetails: { ar: "تفاصيل الصيانة", en: "Maintenance Details" },
  printQuotation: { ar: "طباعة عرض سعر", en: "Print Quotation" },
  printTechnical: { ar: "طباعة تقرير فني", en: "Print Technical Report" },
  maintenanceId: { ar: "رقم الصيانة", en: "Maintenance ID" },
  customer: { ar: "العميل", en: "Customer" },
  device: { ar: "الجهاز", en: "Device" },
  receivedDate: { ar: "تاريخ الاستلام", en: "Received Date" },
  deliveryDate: { ar: "تاريخ التسليم", en: "Delivery Date" },
  item: { ar: "البند", en: "Item" },
  price: { ar: "السعر", en: "Price" },
  laborFee: { ar: "أجرة الصيانة", en: "Labor Fee" },
  total: { ar: "الإجمالي", en: "Total" },
  notes: { ar: "ملاحظات", en: "Notes" },
  add: { ar: "إضافة", en: "Add" },
  addPhotos: { ar: "إضافة صور", en: "Add Photos" },
  editLaborFee: { ar: "تعديل أجرة الصيانة", en: "Edit Labor Fee" },
  quotation: { ar: "عرض سعر", en: "Quotation" },
  technicalReport: { ar: "تقرير فني", en: "Technical Report" },
  pendingMaintenance: { ar: "طلبات قيد الصيانة", en: "Pending Maintenance" },
  unpaidInvoices: { ar: "فواتير غير مدفوعة", en: "Unpaid Invoices" },
  collectionAlerts: { ar: "تنبيهات الاستلام", en: "Collection Alerts" },
  waitingExpired: { ar: "تم انتهاء مهلة الانتظار", en: "Waiting period expired" },
  lateCollection: { ar: "تنبيه تأخر الاستلام", en: "Late collection alert" },
  daysSinceDelivery: { ar: "يوم منذ التسليم", en: "days since delivery" },
  noPendingOrders: { ar: "لا توجد طلبات قيد الصيانة", en: "No pending orders" },
  noUnpaidInvoices: { ar: "لا توجد فواتير غير مدفوعة", en: "No unpaid invoices" },
  sar: { ar: "ر.س", en: "SAR" },
  selectTechnician: { ar: "اختر الفني", en: "Select Technician" },
  technicianUpdated: { ar: "تم تحديث اسم الفني", en: "Technician updated" },
  partAdded: { ar: "تمت إضافة القطعة", en: "Part added" },
  laborFeeUpdated: { ar: "تم تحديث أجرة الصيانة", en: "Labor fee updated" },
  photosUploaded: { ar: "تم رفع الصور", en: "Photos uploaded" },
  maintenanceIdUpdated: { ar: "تم تحديث رقم الصيانة", en: "Maintenance ID updated" },
  dateUpdated: { ar: "تم تحديث تاريخ الاستلام", en: "Date updated" },
  failureSaved: { ar: "تم حفظ أسباب العطل", en: "Failure analysis saved" },
  recordNotFound: { ar: "لم يتم العثور على السجل", en: "Record not found" },
  togglePayment: { ar: "تم تسجيل الدفع", en: "Payment recorded" },
  cancelPayment: { ar: "تم إلغاء الدفع", en: "Payment cancelled" },
  newPartName: { ar: "اسم القطعة", en: "Part name" },
  priceLabel: { ar: "السعر", en: "Price" },
  laborFeeLabel: { ar: "أجرة الصيانة:", en: "Labor Fee:" },
  failureDesc: { ar: "اكتب وصف العطل وأسبابه هنا...", en: "Write failure description here..." },
  tasks: { ar: "مهمة", en: "tasks" },
  completedTasks: { ar: "مكتملة", en: "Completed" },
  inProgress: { ar: "قيد التنفيذ", en: "In Progress" },
  noTasks: { ar: "لا توجد مهام مسندة", en: "No assigned tasks" },
  tasksOf: { ar: "مهام", en: "Tasks of" },
  addTechnician: { ar: "إضافة", en: "Add" },
  newTechName: { ar: "اسم الفني الجديد", en: "New technician name" },
  techAdded: { ar: "تم إضافة الفني", en: "Technician added" },
  techDeleted: { ar: "تم حذف الفني", en: "Technician deleted" },
  performanceReport: { ar: "تقرير الأداء", en: "Performance Report" },
  allTechnicians: { ar: "جميع الفنيين", en: "All Technicians" },
  filterByTechnician: { ar: "تصفية حسب الفني", en: "Filter by Technician" },
  fromDate: { ar: "من تاريخ", en: "From Date" },
  toDate: { ar: "إلى تاريخ", en: "To Date" },
  totalTasks: { ar: "إجمالي المهام", en: "Total Tasks" },
  pendingTasks: { ar: "مهام معلقة", en: "Pending Tasks" },
  completionRate: { ar: "نسبة الإنجاز", en: "Completion Rate" },
};

interface LanguageContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("ar");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLang, t }}>
      <div dir={dir} className={lang === "en" ? "font-sans" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
