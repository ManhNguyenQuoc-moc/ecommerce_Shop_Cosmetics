import { Users, ShoppingCart, DollarSign, UserPlus } from "lucide-react";
import MetricCard from "../MetricCard";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import RechartsBarChart from "../charts/RechartsBarChart";
import RechartsPieChart from "../charts/RechartsPieChart";
import RechartsComposedLineBar from "../charts/RechartsComposedLineBar";

const bestSellingData = [
  { name: 'Serum Phục Hồi', sales: 420 },
  { name: 'Son MAC', sales: 380 },
  { name: 'Toner Cân Bằng', sales: 310 },
  { name: 'Kem Nền', sales: 290 },
  { name: 'Nước Hoa Dior', sales: 250 },
];

const productTypesData = [
  { name: 'Chăm sóc da', value: 45 },
  { name: 'Trang điểm', value: 30 },
  { name: 'Nước hoa', value: 15 },
  { name: 'Chăm sóc body', value: 10 },
];

const revenueTrendData = [
  { name: 'T2', revenue: 15, profit: 5 },
  { name: 'T3', revenue: 20, profit: 7 },
  { name: 'T4', revenue: 18, profit: 6 },
  { name: 'T5', revenue: 25, profit: 9 },
  { name: 'T6', revenue: 30, profit: 12 },
  { name: 'T7', revenue: 35, profit: 15 },
  { name: 'CN', revenue: 40, profit: 18 },
];

export default function SimpleDashboard() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Tổng User" 
          value="12,543" 
          icon={Users} 
          trend={12.5} 
          isUp={true} 
        />
        <MetricCard 
          title="User Mới (Tháng)" 
          value="842" 
          icon={UserPlus} 
          trend={5.2} 
          isUp={true} 
        />
        <MetricCard 
          title="Tổng Đơn Hàng" 
          value="8,924" 
          icon={ShoppingCart} 
          trend={2.1} 
          isUp={false} 
        />
        <MetricCard 
          title="Doanh Thu" 
          value="45B ₫" 
          icon={DollarSign} 
          trend={15.3} 
          isUp={true} 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
        <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-cyan-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6">
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-200/50 dark:bg-fuchsia-500/10 blur-[30px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">Top Sản Phẩm Bán Chạy</h3>
          <div className="flex-1 w-full relative z-10">
            <RechartsBarChart 
              data={bestSellingData}
              xAxisKey="name"
              bars={[
                { key: 'sales', name: 'Số lượng bán', color: '#00f0ff' }
              ]}
              height={320}
            />
          </div>
        </SWTCard>
        {/* Weekly Trend Chart */}
        <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-pink-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200/50 dark:bg-pink-500/10 blur-[30px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">Xu Hướng Tuần Này</h3>
          <div className="flex-1 w-full relative z-10">
            <RechartsComposedLineBar 
              data={revenueTrendData}
              xAxisKey="name"
              barKey="revenue"
              barName="Doanh thu"
              barColor="#ff007f"
              lineKey="profit"
              lineName="Lợi nhuận"
              lineColor="#00f0ff"
              height={320}
            />
          </div>
        </SWTCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-purple-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6 lg:col-span-2">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-200/50 dark:bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">Cơ cấu doanh thu</h3>
          <div className="flex-1 w-full relative z-10">
            <RechartsPieChart 
              data={productTypesData}
              height={320}
            />
          </div>
        </SWTCard>
        <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-purple-500/20 !rounded-2xl flex flex-col h-full !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden" bodyClassName="!p-6 lg:col-span-2">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-200/50 dark:bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white mb-6 dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] z-10 tracking-wide uppercase">Cơ cấu doanh thu</h3>
          <div className="flex-1 w-full relative z-10">
            <RechartsPieChart 
              data={productTypesData}
              height={320}
            />
          </div>
        </SWTCard>  
      </div>
    </div>
  );
}
