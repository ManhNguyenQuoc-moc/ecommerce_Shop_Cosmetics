"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react";
import { getDashboardData } from "@/src/services/admin/dashboard.service";
import { DashboardDataDTO } from "@/src/services/models/admin/dashboard.dto";
import MonthlySalesChart from "./components/MonthlySalesChart";

const MetricCard = ({ title, value, icon: Icon, trend, isUp }: any) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-center w-12 h-12 bg-brand-50 text-brand-600 rounded-xl mb-4">
      <Icon size={24} strokeWidth={2} />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        <span className="text-sm font-medium text-slate-500 mt-1 block">{title}</span>
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {trend}%
      </div>
    </div>
  </div>
);

const recentOrders = [
  { id: "#ORD-001", product: "Serum Phục Hồi Da", date: "22/10/2023", amount: "550.000đ", status: "Đã giao" },
  { id: "#ORD-002", product: "Kem Ngăn Ngừa Lão Hóa", date: "22/10/2023", amount: "1.250.000đ", status: "Đang xử lý" },
  { id: "#ORD-003", product: "Sữa Rửa Mặt Dịu Nhẹ", date: "21/10/2023", amount: "350.000đ", status: "Đã hủy" },
  { id: "#ORD-004", product: "Mặt Nạ Đất Sét", date: "20/10/2023", amount: "420.000đ", status: "Đã giao" },
  { id: "#ORD-005", product: "Toner Cân Bằng Ẩm", date: "19/10/2023", amount: "280.000đ", status: "Đã giao" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardDataDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-brand-600 gap-4">
        <Loader2 size={40} className="animate-spin" />
        <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu Tổng quan...</span>
      </div>
    );
  }

  const { metrics, monthlySales } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tổng quan Hệ thống</h2>
        <p className="text-slate-500 text-sm mt-1">Theo dõi các chỉ số quan trọng của C Cosmetics hôm nay.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Tổng doanh thu" 
          value={`${(metrics.totalRevenue / 1000000).toFixed(1)}M ₫`} 
          icon={DollarSign} 
          trend={Math.abs(metrics.totalRevenueTrend)} 
          isUp={metrics.totalRevenueTrend >= 0} 
        />
        <MetricCard 
          title="Đơn hàng mới" 
          value={metrics.newOrders.toLocaleString()} 
          icon={ShoppingCart} 
          trend={Math.abs(metrics.newOrdersTrend)} 
          isUp={metrics.newOrdersTrend >= 0} 
        />
        <MetricCard 
          title="Khách hàng" 
          value={metrics.customers.toLocaleString()} 
          icon={Users} 
          trend={Math.abs(metrics.customersTrend)} 
          isUp={metrics.customersTrend >= 0} 
        />
        <MetricCard 
          title="Sản phẩm" 
          value={metrics.products.toLocaleString()} 
          icon={Package} 
          trend={Math.abs(metrics.productsTrend)} 
          isUp={metrics.productsTrend >= 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Biểu đồ Doanh thu (Tháng)</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <MonthlySalesChart data={monthlySales} />
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h3>
            <button className="text-sm font-medium text-brand-600 hover:text-brand-700">Xem tất cả</button>
          </div>
          
          <div className="flex-1 overflow-auto -mx-2 px-2 custom-scrollbar">
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{order.id}</div>
                    <div className="text-slate-600 text-sm mt-0.5">{order.product}</div>
                    <div className="text-slate-400 text-xs mt-1">{order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-600 text-sm">{order.amount}</div>
                    <div className={`text-[11px] font-semibold px-2 py-1 rounded-md mt-1 inline-block
                      ${order.status === "Đã giao" ? "bg-green-100 text-green-700" : 
                        order.status === "Đang xử lý" ? "bg-amber-100 text-amber-700" : 
                        "bg-slate-100 text-slate-600"}
                    `}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}