import React, { createContext, useContext, useState, useCallback } from "react";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  company?: string;
}

export interface SparePart {
  id: string;
  name: string;
  price: number;
}

export interface Technician {
  id: string;
  name: string;
}

export interface TechnicianAssignment {
  technicianName: string;
  contributionPercent: number;
}

export interface MaintenanceRecord {
  id: string;
  maintenanceId: string;
  customerId: string;
  itemName: string;
  itemId: string;
  receivedDate: string;
  deliveryDate?: string;
  isCompleted: boolean;
  isPaid: boolean;
  isUnderWarranty: boolean;
  beforePhoto?: string;
  afterPhoto?: string;
  additionalPhotos?: string[];
  spareParts: SparePart[];
  laborFee: number;
  notes?: string;
  failureAnalysis?: string;
  technicianName?: string;
  assignedTechnicians?: TechnicianAssignment[];
}

interface WorkshopContextType {
  customers: Customer[];
  records: MaintenanceRecord[];
  technicians: Technician[];
  addCustomer: (c: Omit<Customer, "id">) => Customer;
  addRecord: (r: Omit<MaintenanceRecord, "id">) => MaintenanceRecord;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getRecordsByCustomer: (customerId: string) => MaintenanceRecord[];
  searchRecords: (query: string) => MaintenanceRecord[];
  searchCustomers: (query: string) => Customer[];
  generateMaintenanceId: () => string;
  addTechnician: (name: string) => Technician;
  removeTechnician: (id: string) => void;
}

const WorkshopContext = createContext<WorkshopContextType | null>(null);

export const useWorkshop = () => {
  const ctx = useContext(WorkshopContext);
  if (!ctx) throw new Error("useWorkshop must be used within WorkshopProvider");
  return ctx;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const WorkshopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "c1", name: "أحمد محمد", phone: "0501234567", company: "شركة النور" },
    { id: "c2", name: "فهد العتيبي", phone: "0559876543", company: "مؤسسة الفجر" },
    { id: "c3", name: "خالد السعيد", phone: "0561112233" },
  ]);

  const [records, setRecords] = useState<MaintenanceRecord[]>([
    {
      id: "r1", maintenanceId: "MNT-001", customerId: "c1", itemName: "مكيف سبليت", itemId: "ITM-001",
      receivedDate: "2026-03-20", isCompleted: false, isPaid: false, isUnderWarranty: false,
      spareParts: [{ id: "sp1", name: "كمبروسر", price: 450 }, { id: "sp2", name: "فلتر", price: 80 }],
      laborFee: 200, notes: "يحتاج تنظيف شامل",
      assignedTechnicians: [{ technicianName: "محمد أحمد", contributionPercent: 100 }],
    },
    {
      id: "r2", maintenanceId: "MNT-002", customerId: "c2", itemName: "غسالة أوتوماتيك", itemId: "ITM-002",
      receivedDate: "2026-03-18", deliveryDate: "2026-03-22", isCompleted: true, isPaid: true, isUnderWarranty: true,
      spareParts: [{ id: "sp3", name: "موتور", price: 600 }],
      laborFee: 150,
      assignedTechnicians: [{ technicianName: "سعيد العمري", contributionPercent: 60 }, { technicianName: "محمد أحمد", contributionPercent: 40 }],
    },
    {
      id: "r3", maintenanceId: "MNT-003", customerId: "c1", itemName: "ثلاجة", itemId: "ITM-003",
      receivedDate: "2026-03-22", isCompleted: false, isPaid: false, isUnderWarranty: false,
      spareParts: [], laborFee: 100,
      assignedTechnicians: [],
    },
    {
      id: "r4", maintenanceId: "MNT-004", customerId: "c3", itemName: "مكنسة كهربائية", itemId: "ITM-004",
      receivedDate: "2026-03-15", deliveryDate: "2026-03-19", isCompleted: true, isPaid: false, isUnderWarranty: true,
      spareParts: [{ id: "sp4", name: "خرطوم", price: 120 }],
      laborFee: 80,
      assignedTechnicians: [{ technicianName: "سعيد العمري", contributionPercent: 100 }],
    },
  ]);

  const [technicians, setTechnicians] = useState<Technician[]>([
    { id: "t1", name: "محمد أحمد" },
    { id: "t2", name: "سعيد العمري" },
  ]);

  const [counter, setCounter] = useState(5);

  const generateMaintenanceId = useCallback(() => {
    const newId = `MNT-${String(counter).padStart(3, "0")}`;
    setCounter((c) => c + 1);
    return newId;
  }, [counter]);

  const addCustomer = useCallback((c: Omit<Customer, "id">) => {
    const newCustomer = { ...c, id: generateId() };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  }, []);

  const addRecord = useCallback((r: Omit<MaintenanceRecord, "id">) => {
    const newRecord = { ...r, id: generateId() };
    setRecords((prev) => [...prev, newRecord]);
    return newRecord;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<MaintenanceRecord>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const getCustomerById = useCallback((id: string) => customers.find((c) => c.id === id), [customers]);

  const getRecordsByCustomer = useCallback(
    (customerId: string) => records.filter((r) => r.customerId === customerId),
    [records]
  );

  const searchRecords = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return records.filter((r) => {
        const customer = customers.find((c) => c.id === r.customerId);
        return (
          r.maintenanceId.toLowerCase().includes(q) ||
          r.itemName.toLowerCase().includes(q) ||
          customer?.name.toLowerCase().includes(q) ||
          customer?.phone.includes(q) ||
          customer?.company?.toLowerCase().includes(q)
        );
      });
    },
    [records, customers]
  );

  const searchCustomers = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.company?.toLowerCase().includes(q)
      );
    },
    [customers]
  );

  const addTechnician = useCallback((name: string) => {
    const newTech: Technician = { id: generateId(), name };
    setTechnicians((prev) => [...prev, newTech]);
    return newTech;
  }, []);

  const removeTechnician = useCallback((id: string) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <WorkshopContext.Provider
      value={{
        customers, records, technicians, addCustomer, addRecord, updateRecord,
        getCustomerById, getRecordsByCustomer, searchRecords, searchCustomers, generateMaintenanceId,
        addTechnician, removeTechnician,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};
