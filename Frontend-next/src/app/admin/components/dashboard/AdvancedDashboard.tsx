"use client";
import { useState } from "react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { Divider, Typography } from "antd";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Award,
  Clock,
  UserPlus,
  ShoppingCart,
  DollarSign,
  BoxSelect,
  Filter,
  CalendarDays,
  Truck,
  AlertTriangle,
  History,
  Coins,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import MetricCard from "../MetricCard";
import RechartsPieChart from "../charts/RechartsPieChart";
import RechartsBarChart from "../charts/RechartsBarChart";
import RechartsComposedLineBar from "../charts/RechartsComposedLineBar";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { DASHBOARD_API_ENDPOINT, getDashboardData } from "@/src/services/admin/dashboard/dashboard.service";
import AdminDashboardLoading from "../AdminDashboardLoading";
import RechartsRadarChart from "../charts/RechartsRadarChart";
import RechartsScatterChart from "../charts/RechartsScatterChart";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import dayjs, { Dayjs } from "dayjs";
import RechartsFunnelChart from "../charts/RechartsFunnelChart";
import RechartsHeatmap from "../charts/RechartsHeatmap";
import RechartsAreaChart from "../charts/RechartsAreaChart";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { exportDashboardToExcel, exportDashboardToPdf } from "@/src/@core/utils/exportDashboard";

const { Title, Text } = Typography;

export default function AdvancedDashboard() {
  const [timeFilter, setTimeFilter] = useState<string>('daily');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().subtract(9, 'day'),
    dayjs()
  ]);

  const { data, isLoading } = useFetchSWR(
    [DASHBOARD_API_ENDPOINT, timeFilter, dateRange],
    () => getDashboardData({ 
      timeFilter: timeFilter as any,
      startDate: dateRange?.[0] ? dateRange[0].format('YYYY-MM-DD') : undefined,
      endDate: dateRange?.[1] ? dateRange[1].format('YYYY-MM-DD') : undefined
    })
  );

  const handleSelectChange = (value: string) => {
    setTimeFilter(value);
  };

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    if (dates) {
      // Keep current timeFilter (daily/monthly etc) when changing range
    }
  };

  if (isLoading || !data) {
    return <AdminDashboardLoading />;
  }

  const handleExportPdf = async () => {
    try {
      await exportDashboardToPdf(data, "advanced", {
        timeFilter,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      });
      showNotificationSuccess("Đã xuất báo cáo PDF cho Phân Tích Chi Tiết");
    } catch {
      showNotificationError("Không thể xuất PDF. Vui lòng thử lại.");
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportDashboardToExcel(data, "advanced", {
        timeFilter,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      });
      showNotificationSuccess("Đã xuất báo cáo Excel cho Phân Tích Chi Tiết");
    } catch {
      showNotificationError("Không thể xuất Excel. Vui lòng thử lại.");
    }
  };

  const { userAnalytics, brandAnalytics, orderManagement, inventoryAnalytics, purchaseAnalytics } = data;

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-10">
      
      {/* Filters Header - REFINED */}
      <div className="flex flex-col xl:flex-row xl:flex-wrap justify-between items-start xl:items-center gap-6 bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-24 z-30 shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-600 dark:text-cyan-400">
            <Filter size={24} />
          </div>
          <div>
            <Title level={4} className="!mb-0 dark:text-white uppercase tracking-tight font-black">Phân Tích Hiệu Suất Vận Hành</Title>
            <Text className="text-slate-500 text-xs font-medium">Báo cáo động dựa trên mốc thời gian {timeFilter !== 'all' ? 'lọc' : 'toàn bộ'}</Text>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <CalendarDays size={18} className="text-slate-400 shrink-0" />
            <SWTSelect 
              value={timeFilter}
              onChange={handleSelectChange}
              placeholder="Chọn mốc thời gian"
              className="w-full sm:w-48"
              options={[
                { label: "Nhóm theo Ngày", value: "daily" },
                { label: "Nhóm theo Tuần", value: "weekly" },
                { label: "Nhóm theo Tháng", value: "monthly" },
                { label: "Nhóm theo Quý", value: "quarterly" },
                { label: "Nhóm theo Năm", value: "annually" }
              ]}
              allowClear={false}
            />
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
          <SWTDatePickerRange 
            value={dateRange}
            onChange={handleRangeChange}
            className="w-full sm:w-72"
          />
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto">
          <SWTButton
            size="sm"
            icon={<FileText size={14} />}
            onClick={handleExportPdf}
            className="!w-auto !h-9 !px-4 !bg-rose-500/10 !text-rose-500 !border-rose-500/20 hover:!bg-rose-500/20 !font-bold"
          >
            Xuất PDF
          </SWTButton>
          <SWTButton
            size="sm"
            icon={<FileSpreadsheet size={14} />}
            onClick={handleExportExcel}
            className="!w-auto !h-9 !px-4 !bg-emerald-500/10 !text-emerald-500 !border-emerald-500/20 hover:!bg-emerald-500/20 !font-bold"
          >
            Xuất Excel
          </SWTButton>
        </div>
      </div>

      {/* SECTION 1: PERFORMANCE ANALYTICS (Move in) */}
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Đơn Hàng" value={data.metrics.totalOrders.formattedValue || data.metrics.totalOrders.value} icon={ShoppingCart} trend={data.metrics.totalOrders.trend} isUp={data.metrics.totalOrders.isUp} />
          <MetricCard title="Doanh Thu" value={data.metrics.totalRevenue.formattedValue || data.metrics.totalRevenue.value} icon={DollarSign} trend={data.metrics.totalRevenue.trend} isUp={data.metrics.totalRevenue.isUp} />
          <MetricCard title="Lợi Nhuận" value={data.metrics.netProfit.formattedValue || data.metrics.netProfit.value} icon={TrendingUp} trend={data.metrics.netProfit.trend} isUp={data.metrics.netProfit.isUp} />
          <MetricCard title="Khách Mới" value={data.metrics.monthlyNewUsers.formattedValue || data.metrics.monthlyNewUsers.value} icon={UserPlus} trend={data.metrics.monthlyNewUsers.trend} isUp={data.metrics.monthlyNewUsers.isUp} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <SWTCard 
            title="Biến động Doanh thu & Lợi nhuận" 
            className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden" 
            bodyClassName="!p-6"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[30px] rounded-full pointer-events-none" />
            <div className="mb-4 text-xs text-slate-400 font-bold uppercase relative z-10">Tương quan tài chính theo bộ lọc</div>
            <div className="relative z-10">
              <RechartsComposedLineBar 
                data={data.revenueProfitComparison}
                xAxisKey="name"
                barKey="revenue"
                barName="Doanh thu"
                barColor="#6366f1"
                lineKey="profit"
                lineName="Lợi nhuận"
                lineColor="#10b981"
                height={350}
              />
            </div>
          </SWTCard>
        </div>
      </section>

      <Divider className="!my-2 border-slate-100 dark:border-slate-800" />

      {/* SECTION 2: ORDER OPERATIONS */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400"><Activity size={24} /></div>
          <Title level={3} className="!mb-0 dark:text-white uppercase tracking-tighter italic">2. Hiệu suất Vận hành & Đơn hàng</Title>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SWTCard title="Phễu chuyển đổi" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/90 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <RechartsFunnelChart data={orderManagement.conversionFunnel} height={320} />
          </SWTCard>
          <SWTCard title="Mật độ hoạt động" className="lg:col-span-2 !shadow-lg !bg-white/90 dark:!bg-slate-900/90 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <RechartsHeatmap data={orderManagement.orderHeatmap} height={320} />
          </SWTCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SWTCard title="Trạng thái đơn hàng" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/90 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <RechartsPieChart 
              data={orderManagement.statusDistribution.map((s: any) => ({ name: s.status, value: s.count }))} 
              colors={orderManagement.statusDistribution.map((s: any) => s.color || "#cbd5e1")}
              height={320} 
            />
          </SWTCard>
          <SWTCard title="Xu hướng Xử lý" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/90 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <RechartsAreaChart 
              data={orderManagement.revenueTrend}
              xAxisKey="date"
              areas={[{ key: "revenue", name: "Doanh thu", color: "#6366f1" }]}
              height={320}
            />
          </SWTCard>
        </div>
      </section>

      <Divider className="!my-2 border-slate-100 dark:border-slate-800" />

      {/* SECTION 3: STOCK & PROCUREMENT */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-600 dark:text-cyan-400"><BoxSelect size={24} /></div>
          <Title level={3} className="!mb-0 dark:text-white uppercase tracking-tighter italic">3. Phân tích Tồn kho & Nhập hàng</Title>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <MetricCard title="Giá Trị Kho" value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inventoryAnalytics.valuation)} icon={Coins} trend={5} isUp={true} />
          <MetricCard title="Chi Phí Nhập" value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(purchaseAnalytics.totalSpending)} icon={Truck} trend={12} isUp={true} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SWTCard title="Biến động Chi phí Nhập hàng" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><TrendingUp size={14} /> Dòng tiền nhập hàng theo thời gian</div>
            <RechartsAreaChart 
              data={purchaseAnalytics.spendingTrend}
              xAxisKey="name"
              areas={[{ key: "value", name: "Chi phí", color: "#6366f1" }]}
              height={320}
              showAverage={true}
            />
          </SWTCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SWTCard title="Tỷ trọng Nhập hàng theo Thương hiệu" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><Award size={14} /> Ngân sách theo nhà cung cấp</div>
            <RechartsPieChart 
              data={purchaseAnalytics.spendingByBrand} 
              height={320} 
            />
          </SWTCard>

          <SWTCard title="Tình trạng Hạn sử dụng" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><History size={14} /> Kiểm soát lô hàng</div>
            <RechartsPieChart 
              data={inventoryAnalytics.expiryStatus} 
              colors={["#ef4444", "#f59e0b", "#10b981", "#94a3b8"]} 
              height={320} 
            />
          </SWTCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SWTCard title="Trạng thái PO theo thời gian" className="lg:col-span-2 !shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><Clock size={14} /> Tốc độ xử lý đơn hàng</div>
            <RechartsBarChart 
              data={purchaseAnalytics.statusTrend}
              xAxisKey="name"
              bars={[
                { key: 'Lưu nháp', name: 'Lưu nháp', color: '#94a3b8', stackId: 'a' },
                { key: 'Đã duyệt', name: 'Đã duyệt', color: '#6366f1', stackId: 'a' },
                { key: 'Nhận một phần', name: 'Nhận một phần', color: '#f59e0b', stackId: 'a' },
                { key: 'Hoàn tất', name: 'Hoàn tất', color: '#10b981', stackId: 'a' },
                { key: 'Đã hủy', name: 'Đã hủy', color: '#ef4444', stackId: 'a' }
              ]}
              height={320}
            />
          </SWTCard>

          <SWTCard title="Mức độ Ưu tiên PO" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><AlertTriangle size={14} /> Phân bổ độ khẩn cấp</div>
            <RechartsBarChart 
              data={purchaseAnalytics.priorityDistribution}
              xAxisKey="name"
              bars={[{ key: 'value', name: 'Số lượng', color: '#6366f1' }]}
              cellColors={['#ef4444', '#3b82f6', '#94a3b8']}
              height={320}
            />
          </SWTCard>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SWTCard title="Tương quan Cung - Cầu (Nhập vs Bán)" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><Activity size={14} className="text-indigo-500" /> Cân bằng chuỗi cung ứng</div>
            <RechartsComposedLineBar 
              data={purchaseAnalytics.supplyDemandTrend}
              xAxisKey="name"
              barKey="sold"
              barName="Số lượng bán"
              barColor="#6366f1"
              lineKey="received"
              lineName="Số lượng nhập"
              lineColor="#10b981"
              height={350}
            />
          </SWTCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SWTCard title="Sản phẩm sắp hết hàng" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-bold uppercase"><AlertTriangle size={14} className="text-amber-500" /> Cảnh báo tồn kho thấp</div>
            <RechartsBarChart 
              data={inventoryAnalytics.lowStockAlerts}
              xAxisKey="name"
              bars={[
                { key: 'stock', name: 'Hiện có', color: '#f59e0b' },
                { key: 'threshold', name: 'Định mức', color: '#e2e8f0' }
              ]}
              height={320}
            />
          </SWTCard>

          <SWTCard title="Sức khỏe Thương hiệu" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
            <div className="grid grid-cols-2 gap-4 w-full min-h-[320px]">
              {brandAnalytics.brandHealth.slice(0, 2).map((b: any, i: number) => (
                <div key={b.brandName} className="flex flex-col items-center justify-center w-full">
                  <Text className="text-[10px] uppercase font-bold text-slate-400 mb-2">{b.brandName}</Text>
                  <div className="w-full h-[250px]">
                    <RechartsRadarChart data={b.data} name={b.brandName} color={i === 0 ? "#ec4899" : "#6366f1"} height={250} />
                  </div>
                </div>
              ))}
            </div>
          </SWTCard>
        </div>
      </section>

      <Divider className="!my-2 border-slate-100 dark:border-slate-800" />

      {/* SECTION 4: USER VALUATION */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400"><Users size={24} /></div>
          <Title level={3} className="!mb-0 dark:text-white uppercase tracking-tighter italic">4. Phân tích Giá trị Khách hàng</Title>
        </div>

        <SWTCard title="Giá trị vòng đời (LTV)" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
          <RechartsScatterChart data={userAnalytics.ltvScatter} xAxisLabel="Số đơn" yAxisLabel="Tổng chi" height={350} />
        </SWTCard>
      </section>
    </div>
  );
}
