"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useInventoryBatches } from "@/src/services/admin/iventory/inventory.hook";
import { Info, AlertCircle, ShoppingCart, TrendingDown } from "lucide-react";

const COLORS = ["#10b981", "#fbbf24", "#f43f5e", "#94a3b8"];

export default function InventoryCharts() {
  const { batches, total, isLoading } = useInventoryBatches(1, 100); // Fetch more for analytics

  if (isLoading) return <div className="h-64 flex items-center justify-center">Đang tải dữ liệu phân tích...</div>;

  // 1. Status Distribution
  const statusCounts = batches.reduce((acc: any, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: "Còn tốt", value: statusCounts.GOOD || 0 },
    { name: "Cận date", value: statusCounts.NEAR_EXPIRY || 0 },
    { name: "Quá hạn", value: statusCounts.EXPIRED || 0 },
    { name: "Hết hàng", value: statusCounts.OUT_OF_STOCK || 0 },
  ].filter(d => d.value > 0);

  // 2. Top Batches by Quantity
  const barData = batches
    .slice(0, 8)
    .map(b => ({
      name: b.batchNumber.slice(-6),
      qty: b.quantity,
      cost: b.costPrice
    }));

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ShoppingCart className="text-blue-500" />}
          label="Tổng số lô hàng"
          value={total}
          sub="Trong hệ thống"
        />
        <StatCard
          icon={<AlertCircle className="text-amber-500" />}
          label="Lô hàng cận date"
          value={statusCounts.NEAR_EXPIRY || 0}
          sub="Cần xử lý gấp"
        />
        <StatCard
          icon={<TrendingDown className="text-rose-500" />}
          label="Hết hàng"
          value={statusCounts.OUT_OF_STOCK || 0}
          sub="Đã bán hết"
        />
        <StatCard
          icon={<Info className="text-emerald-500" />}
          label="Tỉ lệ hàng tốt"
          value={`${total > 0 ? Math.round(((statusCounts.GOOD || 0) / total) * 100) : 0}%`}
          sub="Chất lượng đảm bảo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Status Distribution */}
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            Phân bổ trạng thái lô hàng
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Stock Levels */}
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            Số lượng tồn kho theo lô (8 lô gần nhất)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="qty" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
        <div className="text-xl font-black text-slate-800 dark:text-white">{value}</div>
        <div className="text-[10px] text-slate-400 font-medium">{sub}</div>
      </div>
    </div>
  );
}
