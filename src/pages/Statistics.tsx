import { useMemo } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { useLanguage } from "@/context/LanguageContext";
import StatCard from "@/components/StatCard";
import { DollarSign, ShieldCheck, ShieldX, Users, TrendingUp, CreditCard, Banknote } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["hsl(152,56%,40%)", "hsl(0,84%,40%)", "hsl(38,92%,50%)", "hsl(210,18%,55%)"];

const Statistics = () => {
  const { records, customers } = useWorkshop();
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const totalRevenue = records.reduce((s, r) => s + r.spareParts.reduce((sp, p) => sp + p.price, 0) + r.laborFee, 0);
    const paidRecords = records.filter((r) => r.isPaid);
    const totalPaid = paidRecords.reduce((s, r) => s + r.spareParts.reduce((sp, p) => sp + p.price, 0) + r.laborFee, 0);
    const remaining = totalRevenue - totalPaid;
    const underWarranty = records.filter((r) => r.isUnderWarranty).length;
    const outWarranty = records.filter((r) => !r.isUnderWarranty).length;
    const uniqueCustomers = new Set(records.map((r) => r.customerId));
    const returningCustomers = [...uniqueCustomers].filter(
      (cId) => records.filter((r) => r.customerId === cId).length > 1
    ).length;
    const newCustomers = uniqueCustomers.size - returningCustomers;

    return { totalRevenue, totalPaid, remaining, underWarranty, outWarranty, newCustomers, returningCustomers };
  }, [records, customers]);

  const paymentData = [
    { name: t("paid"), value: records.filter((r) => r.isPaid).length },
    { name: t("unpaid"), value: records.filter((r) => !r.isPaid).length },
  ];

  const warrantyData = [
    { name: t("underWarranty"), value: stats.underWarranty },
    { name: t("noMaintenanceWarranty"), value: stats.outWarranty },
  ];

  const customerData = [
    { name: t("newCustomers"), value: stats.newCustomers },
    { name: t("returningCustomers"), value: stats.returningCustomers },
  ];

  const currency = t("sar");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold">{t("statistics")}</h2>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t("totalRevenue")} value={`${stats.totalRevenue} ${currency}`} icon={TrendingUp} variant="primary" />
        <StatCard title={t("totalPaid")} value={`${stats.totalPaid} ${currency}`} icon={Banknote} variant="accent" />
        <StatCard title={t("remainingBalances")} value={`${stats.remaining} ${currency}`} icon={CreditCard} variant="destructive" />
        <StatCard title={t("totalCustomers")} value={customers.length} icon={Users} variant="secondary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Distribution - Bar Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">{t("paymentDistribution")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={paymentData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {paymentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Warranty Distribution - Bar Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">{t("warrantyDistribution")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={warrantyData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {warrantyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth - Bar Chart */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">{t("customerGrowth")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={customerData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maintenance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t("underWarranty")} value={stats.underWarranty} icon={ShieldCheck} variant="primary" />
        <StatCard title={t("noMaintenanceWarranty")} value={stats.outWarranty} icon={ShieldX} variant="destructive" />
        <StatCard title={t("newCustomers")} value={stats.newCustomers} icon={Users} variant="accent" />
        <StatCard title={t("returningCustomers")} value={stats.returningCustomers} icon={Users} variant="secondary" />
      </div>
    </div>
  );
};

export default Statistics;
