import React, { useState } from "react";
import { TrendingUp, DollarSign, PackageCheck, Filter } from "lucide-react";
import MetricCard from "../MetricCard";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import RechartsComposedLineBar from "../charts/RechartsComposedLineBar";
import RechartsPieChart from "../charts/RechartsPieChart";
import RechartsBarChart from "../charts/RechartsBarChart";

const revenueProfitData = [
  { name: 'T1', revenue: 4000, profit: 2400 },
  { name: 'T2', revenue: 3000, profit: 1398 },
  { name: 'T3', revenue: 2000, profit: 9800 },
  { name: 'T4', revenue: 2780, profit: 3908 },
  { name: 'T5', revenue: 1890, profit: 4800 },
  { name: 'T6', revenue: 2390, profit: 3800 },
  { name: 'T7', revenue: 3490, profit: 4300 },
  { name: 'T8', revenue: 4200, profit: 2500 },
  { name: 'T9', revenue: 3100, profit: 1800 },
  { name: 'T10', revenue: 2500, profit: 1200 },
  { name: 'T11', revenue: 3800, profit: 2600 },
  { name: 'T12', revenue: 4800, profit: 3200 },
];

const productTypesData = [
  { name: 'Chăm sóc da', value: 400 },
  { name: 'Trang điểm', value: 300 },
  { name: 'Nước hoa', value: 300 },
  { name: 'Body Care', value: 200 },
  { name: 'Quà tặng', value: 278 },
  { name: 'Phụ kiện', value: 189 },
];

const productsSoldData = [
  { name: 'Q1', products: 1200 },
  { name: 'Q2', products: 1800 },
  { name: 'Q3', products: 2400 },
  { name: 'Q4', products: 3100 },
];

export default function AdvancedDashboard() {
  const [timeFilter, setTimeFilter] = useState("annually");

  return (
    <div className="animate-fade-in">
      {/* Filter Row */}
      <div className="!p-4 !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-pink-500/20 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-pink-400 font-semibold dark:drop-shadow-[0_0_5px_rgba(255,0,128,0.4)]">
          <Filter size={20} className="text-brand-500 dark:text-fuchsia-500" />
          <span>Bộ Lọc Thời Gian</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <SWTSelect 
            value={timeFilter}
            onChange={(value) => setTimeFilter(value as string)}
            className="min-w-[160px]"
            options={[
              { label: "Theo Năm", value: "annually" },
              { label: "Theo Quý", value: "quarterly" },
              { label: "Theo Tháng", value: "monthly" },
              { label: "Theo Tuần", value: "weekly" },
              { label: "Tùy chỉnh", value: "custom" },
            ]}
          />
          {timeFilter === "custom" && (
            <SWTDatePickerRange />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <MetricCard 
          title="Đơn Hàng Bán Ra" 
          value="1,492" 
          icon={PackageCheck} 
          trend={8.4} 
          isUp={true} 
        />
        <MetricCard 
          title="Tổng Doanh Thu" 
          value="4.2B ₫" 
          icon={DollarSign} 
          trend={12.1} 
          isUp={true} 
        />
        <MetricCard 
          title="Lợi Nhuận Thuần" 
          value="1.1B ₫" 
          icon={TrendingUp} 
          trend={1.2} 
          isUp={false} 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 my-6 gap-6">
        <SWTCard className="lg:col-span-2 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-pink-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-200/50 dark:bg-fuchsia-500/10 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">So Sánh Doanh Thu & Lợi Nhuận</h3>
          <div className="flex-1 w-full min-h-[300px] z-10">
            <RechartsComposedLineBar 
              data={revenueProfitData}
              xAxisKey="name"
              barKey="revenue"
              barName="Doanh Thu"
              barColor="#a855f7"
              lineKey="profit"
              lineName="Lợi Nhuận"
              lineColor="#00f0ff"
              height={350}
            />
          </div>
        </SWTCard>

        {/* Pie Chart */}
        <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-fuchsia-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200/50 dark:bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">Ngành Hàng Bán Chạy</h3>
          <div className="flex-1 w-full min-h-[300px] z-10">
            <RechartsPieChart 
              data={productTypesData}
              height={350}
            />
          </div>
        </SWTCard>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-purple-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-200/50 dark:bg-purple-500/10 blur-[30px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">Tăng Trưởng Số Sản Phẩm Bán Ra</h3>
          <div className="flex-1 w-full min-h-[300px] z-10">
            <RechartsBarChart 
              data={productsSoldData}
              xAxisKey="name"
              bars={[
                { key: 'products', name: 'Số Sản Phẩm', color: '#ff007f' } // neon pink
              ]}
              height={300}
            />
          </div>
        </SWTCard>
      </div>

    </div>
  );
}
