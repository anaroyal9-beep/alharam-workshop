import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchPage = () => {
  const { searchRecords, getCustomerById } = useWorkshop();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = query.length >= 2 ? searchRecords(query) : [];

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold">البحث المتقدم</h2>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="ابحث بالاسم، الشركة، رقم الهاتف، أو رقم الصيانة..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 text-base h-12"
        />
      </div>

      {query.length >= 2 && (
        <p className="text-sm text-muted-foreground">تم العثور على {results.length} نتيجة</p>
      )}

      <div className="space-y-3">
        {results.map((r) => {
          const customer = getCustomerById(r.customerId);
          const total = r.spareParts.reduce((s, p) => s + p.price, 0) + r.laborFee;
          return (
            <div
              key={r.id}
              className="bg-card rounded-lg shadow-sm border border-border p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/maintenance/${r.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{r.itemName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {customer?.name} • {customer?.phone} {customer?.company && `• ${customer.company}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{r.maintenanceId} • {r.receivedDate}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">{total} ر.س</p>
                  <p className={`text-xs mt-1 ${r.isCompleted ? "text-success" : "text-secondary"}`}>
                    {r.isCompleted ? "مكتملة" : "قيد الصيانة"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;
