import { useState, useMemo, useEffect } from "react";
import { useSales } from "../hooks/useSales";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

export default function Sale() {
  const { data: allSalesData = [], isLoading, isError, error } = useSales();
  const [selectedYear, setSelectedYear] = useState<number>(1404);
  const [isMobile, setIsMobile] = useState(false);

  // تشخیص موبایل
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allSalesData.map((item) => item.year)));
    return years.sort((a, b) => b - a);
  }, [allSalesData]);

  const salesData = allSalesData.filter((item) => item.year === selectedYear);

  const totalOnline = salesData.reduce((sum, item) => sum + item.online, 0);
  const totalInStore = salesData.reduce((sum, item) => sum + item.inStore, 0);
  const totalSales = totalOnline + totalInStore;

  const formatPrice = (value: number) =>
    value.toLocaleString("fa-IR") + " تومان";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm">در حال دریافت داده‌های فروش...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-center">
        خطا در دریافت داده‌های فروش
        <p className="text-xs mt-2 text-red-400/70">
          {(error as any)?.message || "لطفاً اتصال به سرور را بررسی کنید"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">میزان فروش</h2>
            <p className="text-sm text-slate-400">نمودار فروش ماهانه</p>
          </div>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">سال:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-indigo-500 transition-colors"
          >
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <option key={year} value={year} className="bg-slate-900">
                  {year}
                </option>
              ))
            ) : (
              <>
                <option value={1404} className="bg-slate-900">
                  ۱۴۰۴
                </option>
                <option value={1403} className="bg-slate-900">
                  ۱۴۰۳
                </option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">فروش آنلاین</p>
          <p className="text-base font-bold text-indigo-400">
            {formatPrice(totalOnline)}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">فروش حضوری</p>
          <p className="text-base font-bold text-emerald-400">
            {formatPrice(totalInStore)}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">مجموع فروش</p>
          <p className="text-base font-bold text-white">
            {formatPrice(totalSales)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-6">
        {salesData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
            داده‌ای برای سال {selectedYear} یافت نشد
          </div>
        ) : isMobile ? (
          /* ========== موبایل: Bar Chart ========== */
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={salesData}
              margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(0)}M`
                    : value >= 1000
                      ? `${(value / 1000).toFixed(0)}K`
                      : String(value)
                }
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString("fa-IR")} تومان`,
                ]}
              />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: 8,
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              />
              <Bar
                dataKey="online"
                name="فروش آنلاین"
                fill="#818cf8"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
              <Bar
                dataKey="inStore"
                name="فروش حضوری"
                fill="#34d399"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          /* ========== دسکتاپ: Area Chart ========== */
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={salesData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorInStore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(0)}M`
                    : value >= 1000
                      ? `${(value / 1000).toFixed(0)}K`
                      : String(value)
                }
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString("fa-IR")} تومان`,
                ]}
                labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: 16, color: "#94a3b8" }}
              />

              <Area
                type="monotone"
                dataKey="online"
                name="فروش آنلاین"
                stackId="1"
                stroke="#818cf8"
                fill="url(#colorOnline)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="inStore"
                name="فروش حضوری"
                stackId="1"
                stroke="#34d399"
                fill="url(#colorInStore)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
