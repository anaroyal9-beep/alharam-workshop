import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "ar" | "en";

interface Translations {
  [key: string]: { ar: string; en: string };
}

const translations: Translations = {
  // Sidebar / Navigation
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  newMaintenance: { ar: "طلب صيانة جديد", en: "New Maintenance" },
  maintenanceRecords: { ar: "سجلات الصيانة", en: "Maintenance Records" },
  customers: { ar: "العملاء", en: "Customers" },
  dailyLedger: { ar: "اليومية", en: "Daily Ledger" },
  search: { ar: "البحث المتقدم", en: "Advanced Search" },
  technicians: { ar: "كارت التشغيل", en: "Technicians" },

  // Dashboard
  totalOrders: { ar: "إجمالي الطلبات", en: "Total Orders" },
  underMaintenance: { ar: "قيد الصيانة", en: "Under Maintenance" },
  completedOrders: { ar: "مكتملة", en: "Completed" },
  unpaidBills: { ar: "غير مدفوعة", en: "Unpaid" },
  underWarranty: { ar: "تحت ضمان الصيانة", en: "Under Warranty" },
  collectionAlerts: { ar: "تنبيهات الاستلام", en: "Collection Alerts" },
  waitingExpired: { ar: "تم انتهاء مهلة الانتظار", en: "Waiting period expired" },
  lateCollection: { ar: "تنبيه تأخر الاستلام", en: "Late collection alert" },
  daysSinceDelivery: { ar: "يوم منذ التسليم", en: "days since delivery" },
  pendingMaintenance: { ar: "طلبات قيد الصيانة", en: "Pending Maintenance" },
  noPendingOrders: { ar: "لا توجد طلبات قيد الصيانة", en: "No pending orders" },
  unpaidInvoices: { ar: "فواتير غير مدفوعة", en: "Unpaid Invoices" },
  noUnpaidInvoices: { ar: "لا توجد فواتير غير مدفوعة", en: "No unpaid invoices" },
  delivery: { ar: "تسليم", en: "Delivery" },

  // Statuses
  completed: { ar: "مكتملة", en: "Completed" },
  pending: { ar: "قيد الانتظار", en: "Pending" },
  paid: { ar: "مدفوع", en: "Paid" },
  unpaid: { ar: "غير مدفوع", en: "Unpaid" },
  inProgress: { ar: "قيد التنفيذ", en: "In Progress" },

  // Maintenance Detail
  maintenanceDetails: { ar: "تفاصيل الصيانة", en: "Maintenance Details" },
  maintenanceId: { ar: "رقم الصيانة", en: "Maintenance ID" },
  customer: { ar: "العميل", en: "Customer" },
  device: { ar: "الجهاز", en: "Device" },
  receivedDate: { ar: "تاريخ الاستلام", en: "Received Date" },
  deliveryDate: { ar: "تاريخ التسليم", en: "Delivery Date" },
  orderStatus: { ar: "حالة الطلب", en: "Order Status" },
  maintenance: { ar: "الصيانة", en: "Maintenance" },
  payment: { ar: "الدفع", en: "Payment" },
  warranty: { ar: "الضمان", en: "Warranty" },
  maintenanceWarranty: { ar: "ضمان صيانة", en: "Maintenance Warranty" },
  noMaintenanceWarranty: { ar: "بدون ضمان صيانة", en: "No Maintenance Warranty" },
  withinWarranty: { ar: "داخل فترة ضمان الصيانة", en: "Under Maintenance Warranty" },
  outsideWarranty: { ar: "خارج فترة ضمان الصيانة", en: "Out of Maintenance Warranty" },
  failureAnalysis: { ar: "أسباب العطل", en: "Failure Analysis" },
  failureDesc: { ar: "اكتب وصف العطل وأسبابه هنا...", en: "Write failure description here..." },
  maintenancePhotos: { ar: "صور الصيانة", en: "Maintenance Photos" },
  addPhotos: { ar: "إضافة صور", en: "Add Photos" },
  spareParts: { ar: "قطع الغيار والتكلفة", en: "Spare Parts & Cost" },
  item: { ar: "البند", en: "Item" },
  price: { ar: "السعر", en: "Price" },
  laborFee: { ar: "شغل اليد", en: "Labor Cost" },
  total: { ar: "الإجمالي", en: "Total" },
  excludingVat: { ar: "(غير شامل الضريبة)", en: "(Excluding VAT)" },
  notes: { ar: "ملاحظات", en: "Notes" },
  add: { ar: "إضافة", en: "Add" },
  editLaborFee: { ar: "تعديل شغل اليد", en: "Edit Labor Cost" },
  laborFeeLabel: { ar: "شغل اليد:", en: "Labor Cost:" },
  newPartName: { ar: "اسم القطعة", en: "Part name" },
  priceLabel: { ar: "السعر", en: "Price" },
  technicianName: { ar: "اسم الفني", en: "Technician Name" },
  selectTechnician: { ar: "اختر الفني", en: "Select Technician" },
  assignedTechnicians: { ar: "الفنيين المعينين", en: "Assigned Technicians" },
  contributionPercent: { ar: "نسبة المساهمة %", en: "Contribution %" },
  addTechToTask: { ar: "إضافة فني للمهمة", en: "Add Technician" },
  removeTechFromTask: { ar: "إزالة", en: "Remove" },
  printQuotation: { ar: "طباعة عرض سعر", en: "Print Quotation" },
  printTechnical: { ar: "طباعة تقرير فني", en: "Print Technical Report" },
  quotation: { ar: "عرض سعر", en: "Quotation" },
  technicalReport: { ar: "تقرير فني", en: "Technical Report" },
  sar: { ar: "ر.س", en: "SAR" },
  recordNotFound: { ar: "لم يتم العثور على السجل", en: "Record not found" },
  toggleStatus: { ar: "تبديل الحالة", en: "Toggle status" },
  maxCollectionDays: { ar: "حد أقصى 30 يوم للاستلام", en: "Maximum 30 days for collection" },

  // Toast messages
  technicianUpdated: { ar: "تم تحديث اسم الفني", en: "Technician updated" },
  partAdded: { ar: "تمت إضافة القطعة", en: "Part added" },
  laborFeeUpdated: { ar: "تم تحديث شغل اليد", en: "Labor cost updated" },
  photosUploaded: { ar: "تم رفع الصور", en: "Photos uploaded" },
  maintenanceIdUpdated: { ar: "تم تحديث رقم الصيانة", en: "Maintenance ID updated" },
  dateUpdated: { ar: "تم تحديث تاريخ الاستلام", en: "Date updated" },
  failureSaved: { ar: "تم حفظ أسباب العطل", en: "Failure analysis saved" },
  togglePayment: { ar: "تم تسجيل الدفع", en: "Payment recorded" },
  cancelPayment: { ar: "تم إلغاء الدفع", en: "Payment cancelled" },

  // New Maintenance
  maintenanceData: { ar: "بيانات الصيانة", en: "Maintenance Data" },
  maintenanceNumber: { ar: "رقم الصيانة", en: "Maintenance Number" },
  enterMaintenanceId: { ar: "أدخل رقم الصيانة", en: "Enter maintenance ID" },
  date: { ar: "التاريخ", en: "Date" },
  searchByNameOrPhone: { ar: "ابحث بالاسم أو رقم الهاتف...", en: "Search by name or phone..." },
  addNewCustomer: { ar: "إضافة عميل جديد", en: "Add New Customer" },
  customerName: { ar: "اسم العميل", en: "Customer Name" },
  phoneNumber: { ar: "رقم الهاتف", en: "Phone Number" },
  companyOptional: { ar: "الشركة (اختياري)", en: "Company (optional)" },
  selectExistingCustomer: { ar: "اختيار عميل موجود", en: "Select Existing Customer" },
  deviceDetails: { ar: "تفاصيل الجهاز", en: "Device Details" },
  deviceName: { ar: "اسم الجهاز", en: "Device Name" },
  deviceIdOptional: { ar: "رقم الجهاز (اختياري)", en: "Device ID (optional)" },
  additionalNotes: { ar: "ملاحظات إضافية...", en: "Additional notes..." },
  createMaintenanceOrder: { ar: "إنشاء طلب الصيانة", en: "Create Maintenance Order" },
  enterCustomerNamePhone: { ar: "يرجى إدخال اسم ورقم هاتف العميل", en: "Please enter customer name and phone" },
  selectCustomer: { ar: "يرجى اختيار عميل", en: "Please select a customer" },
  enterDeviceName: { ar: "يرجى إدخال اسم الجهاز", en: "Please enter device name" },
  enterMaintenanceNumber: { ar: "يرجى إدخال رقم الصيانة", en: "Please enter maintenance number" },
  maintenanceCreated: { ar: "تم إنشاء طلب الصيانة", en: "Maintenance order created" },

  // Records page
  searchRecordsPlaceholder: { ar: "ابحث برقم الصيانة، اسم الجهاز، أو اسم العميل...", en: "Search by maintenance ID, device name, or customer name..." },
  maintenanceStatus: { ar: "الصيانة", en: "Maintenance" },
  paymentStatus: { ar: "الدفع", en: "Payment" },
  warrantyStatus: { ar: "الضمان", en: "Warranty" },
  yes: { ar: "نعم", en: "Yes" },
  no: { ar: "لا", en: "No" },
  noResults: { ar: "لا توجد نتائج", en: "No results" },
  unpaidAmount: { ar: "غير مدفوع", en: "Unpaid" },

  // Customers page
  searchCustomersPlaceholder: { ar: "ابحث بالاسم أو رقم الهاتف أو الشركة...", en: "Search by name, phone, or company..." },
  maintenanceOrders: { ar: "طلب صيانة", en: "maintenance orders" },

  // Customer Detail
  customerProfile: { ar: "ملف العميل", en: "Customer Profile" },
  customerNotFound: { ar: "لم يتم العثور على العميل", en: "Customer not found" },
  totalOrdersCount: { ar: "عدد الطلبات", en: "Total Orders" },
  totalAmount: { ar: "إجمالي المبالغ", en: "Total Amount" },
  maintenanceHistory: { ar: "سجل الصيانة", en: "Maintenance History" },
  noRecords: { ar: "لا توجد سجلات", en: "No records" },
  underMaintenanceStatus: { ar: "قيد الصيانة", en: "Under Maintenance" },

  // Search page
  searchPlaceholder: { ar: "ابحث بالاسم، الشركة، رقم الهاتف، أو رقم الصيانة...", en: "Search by name, company, phone, or maintenance ID..." },
  resultsFound: { ar: "تم العثور على", en: "Found" },
  results: { ar: "نتيجة", en: "results" },

  // Daily Ledger
  dailyLedgerTitle: { ar: "يومية ورشة الهرم المثالي", en: "Al Haram Workshop Daily Ledger" },
  dailyLedgerPrintTitle: { ar: "يومية ورشة الهرم المثالي للآلات والمعدات", en: "Al Haram Perfect Workshop Daily Ledger" },
  printLedger: { ar: "طباعة اليومية", en: "Print Ledger" },
  dateLabel: { ar: "التاريخ", en: "Date" },
  dayLabel: { ar: "اليوم", en: "Day" },
  revenue: { ar: "الإيـــــــــراد", en: "Revenue" },
  expenses: { ar: "المصروف", en: "Expenses" },
  transfer: { ar: "تحويل", en: "Transfer" },
  network: { ar: "شبكة", en: "POS" },
  cash: { ar: "نقدي", en: "Cash" },
  statement: { ar: "بيـــــــان", en: "Description" },
  code: { ar: "كود", en: "Code" },
  expenseStatement: { ar: "بيان", en: "Description" },
  amount: { ar: "مبلغ", en: "Amount" },
  revenueDescPlaceholder: { ar: "بيان الإيراد", en: "Revenue description" },
  codePlaceholder: { ar: "كود", en: "Code" },
  expenseDescPlaceholder: { ar: "بيان المصروف", en: "Expense description" },
  totalDailyRevenue: { ar: "اجمالي الإيراد اليومي", en: "Total Daily Revenue" },
  cashLabel: { ar: "نقدي", en: "Cash" },
  networkLabel: { ar: "شبكة", en: "POS" },
  transferLabel: { ar: "تحويل", en: "Transfer" },
  todayExpenses: { ar: "المصروف اليوم", en: "Today's Expenses" },
  remainingCustody: { ar: "باقي العهده", en: "Remaining Custody" },
  totalRevenue: { ar: "إجمالي الإيرادات", en: "Total Revenue" },
  totalExpenses: { ar: "إجمالي المصروفات", en: "Total Expenses" },
  netAmount: { ar: "الصافي", en: "Net" },
  dayNames: { ar: "الأحد,الإثنين,الثلاثاء,الأربعاء,الخميس,الجمعة,السبت", en: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday" },
  openingBalance: { ar: "الرصيد السابق الافتتاحي", en: "Opening Balance" },
  cashSales: { ar: "المبيعات النقدية", en: "Cash Sales" },
  currentTotalBalance: { ar: "مجموع الرصيد الحالي", en: "Current Total Balance" },
  closingBalance: { ar: "رصيد الإقفال", en: "Closing Balance" },
  saveRecord: { ar: "حفظ", en: "Save" },
  editRecord: { ar: "تعديل", en: "Edit" },

  // Technicians
  tasks: { ar: "مهمة", en: "tasks" },
  completedTasks: { ar: "مكتملة", en: "Completed" },
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

  // Statistics
  statistics: { ar: "الإحصائيات", en: "Statistics" },
  totalPaid: { ar: "إجمالي المدفوع", en: "Total Paid" },
  remainingBalances: { ar: "المبالغ المتبقية", en: "Remaining Balances" },
  totalCustomers: { ar: "إجمالي العملاء", en: "Total Customers" },
  paymentDistribution: { ar: "توزيع المدفوعات", en: "Payment Distribution" },
  warrantyDistribution: { ar: "توزيع الضمان", en: "Warranty Distribution" },
  customerGrowth: { ar: "نمو العملاء", en: "Customer Growth" },
  newCustomers: { ar: "عملاء جدد", en: "New Customers" },
  returningCustomers: { ar: "عملاء عائدون", en: "Returning Customers" },

  // Reports
  reports: { ar: "التقارير", en: "Reports" },
  printReport: { ar: "طباعة التقرير", en: "Print Report" },
  techPerformanceReport: { ar: "تقرير أداء الفنيين", en: "Technician Performance" },
  masterReport: { ar: "التقرير الشامل", en: "Master Report" },
  analyticsReport: { ar: "تقرير تحليلي", en: "Analytics Report" },
  all: { ar: "الكل", en: "All" },

  // Smart Alerts
  waitPeriodExpired: { ar: "تم انتهاء مهلة الانتظار", en: "Wait Period Expired" },
  daysInService: { ar: "يوم في الخدمة", en: "days in service" },

  // Login
  username: { ar: "اسم المستخدم", en: "Username" },
  password: { ar: "كلمة المرور", en: "Password" },
  enterUsername: { ar: "أدخل اسم المستخدم", en: "Enter username" },
  enterPassword: { ar: "أدخل كلمة المرور", en: "Enter password" },
  login: { ar: "تسجيل الدخول", en: "Login" },
  loginError: { ar: "خطأ في اسم المستخدم أو كلمة المرور", en: "Invalid username or password" },
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
