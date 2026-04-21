import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  UserPlus, 
  Package, 
  Layers,
  BarChart3,
  Truck,
  TrendingUp,
  CreditCard,
  MapPin,
  Target,
  Activity,
  BoxSelect,
  Award,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import MetricCard from "../MetricCard";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import RechartsBarChart from "../charts/RechartsBarChart";
import RechartsPieChart from "../charts/RechartsPieChart";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { DASHBOARD_API_ENDPOINT, getDashboardData } from "@/src/services/admin/dashboard/dashboard.service";
import AdminDashboardLoading from "../AdminDashboardLoading";
import {Typography,  } from "antd";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { useState } from "react";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { exportDashboardToExcel, exportDashboardToPdf } from "@/src/@core/utils/exportDashboard";

const { Title, Text } = Typography;

export default function SimpleDashboard() {
  const [limits, setLimits] = useState({
    products: 5,
    variants: 5,
    brands: 5
  });

  const { data } = useFetchSWR(
    [DASHBOARD_API_ENDPOINT, limits.products, limits.variants, limits.brands], 
    () => getDashboardData({ 
      timeFilter: 'all',
      topProductsLimit: limits.products,
      topVariantsLimit: limits.variants,
      topBrandsLimit: limits.brands
    }),
    { keepPreviousData: true }
  );

  if (!data) {
    return <AdminDashboardLoading />;
  }

  const { productVariantMetrics, purchaseAnalytics, userAnalytics, brandAnalytics, bestSellingProducts, bestSellingVariants } = data;

  const handleExportPdf = async () => {
    try {
      await exportDashboardToPdf(data, "simple", {
        timeFilter: "all",
      });
      showNotificationSuccess("Đã xuất báo cáo PDF cho Tổng Quan Kinh Doanh");
    } catch {
      showNotificationError("Không thể xuất PDF. Vui lòng thử lại.");
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportDashboardToExcel(data, "simple", {
        timeFilter: "all",
      });
      showNotificationSuccess("Đã xuất báo cáo Excel cho Tổng Quan Kinh Doanh");
    } catch {
      showNotificationError("Không thể xuất Excel. Vui lòng thử lại.");
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-10 pb-10">
      
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div>
          <Title level={4} className="!mb-0 dark:text-white uppercase tracking-tighter">Tổng Quan Cửa Hàng</Title>
          <Text className="text-slate-500 text-xs font-medium">Toàn bộ dữ liệu hệ thống chuẩn hóa</Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
      
      {/* Expanded Metrics Grid - 2 ROWS of 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        <MetricCard title="Khách Hàng" value={data.metrics.totalUsers.value} icon={Users} trend={15} isUp={true} />
        <MetricCard title="Khách Mới (Tháng)" value={data.metrics.monthlyNewUsers.value} icon={UserPlus} trend={10} isUp={true} />
        <MetricCard title="Sản Phẩm" value={productVariantMetrics.totalProducts} icon={Package} trend={5} isUp={true} />
        <MetricCard title="Biến Thể" value={productVariantMetrics.totalVariants} icon={Layers} trend={3} isUp={true} />
        
        <MetricCard title="Đơn Hàng" value={data.metrics.totalOrders.value} icon={ShoppingCart} trend={8} isUp={true} />
        <MetricCard title="Doanh Thu" value={data.metrics.totalRevenue.formattedValue || data.metrics.totalRevenue.value} icon={DollarSign} trend={12} isUp={true} />
        <MetricCard 
          title="Chi Phí Nhập" 
          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(purchaseAnalytics.totalSpending)} 
          icon={CreditCard} 
          trend={18} 
          isUp={true} 
        />
        <MetricCard
          title="Phiếu Nhập"
          value={purchaseAnalytics.statusDistribution.reduce((total, item) => total + item.count, 0)}
          icon={Truck}
          trend={5}
          isUp={true}
        />
      </div>

      {/* SECTION 1: INVENTORY & LOGISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SWTCard 
          title="Tồn kho theo Danh mục" 
          className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden" 
          bodyClassName="!p-6"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="mb-4 flex items-center gap-2 relative z-10">
            <BoxSelect size={16} className="text-cyan-500" />
            <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Phân bổ nguồn cung</Text>
          </div>
          <div className="relative z-10">
            <RechartsBarChart 
              data={data.inventoryByCategory}
              xAxisKey="name"
              bars={[{ key: 'stock', name: 'Số lượng', color: '#06b6d4' }]}
              height={320}
            />
          </div>
        </SWTCard>

        <SWTCard 
          title="Trạng thái Nhập hàng (PO)"
          className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden"
          bodyClassName="!p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Truck size={18} className="text-amber-500" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tiến độ cung ứng</span>
          </div>
          <div className="relative z-10">
            <RechartsPieChart 
              data={purchaseAnalytics.statusDistribution.map(s => ({ name: s.status, value: s.count }))} 
              colors={purchaseAnalytics.statusDistribution.map(s => s.color || "#94a3b8")}
              height={320}
            />
          </div>
        </SWTCard>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SWTCard 
            title="Top Sản Phẩm Bán Chạy" 
            className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden" 
            bodyClassName="!p-6"
            extra={
              <SWTSelect 
                defaultValue={5} 
                size="small" 
                className="w-24"
                onChange={(v) => setLimits(prev => ({ ...prev, products: v }))}
                options={[
                  { value: 5, label: 'Top 5' },
                  { value: 10, label: 'Top 10' },
                  { value: 15, label: 'Top 15' },
                ]}
              />
            }
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />
            <div className="mb-4 flex items-center gap-2 relative z-10">
              <TrendingUp size={16} className="text-cyan-500" />
              <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hiệu suất sản phẩm dẫn đầu</Text>
            </div>
            <div className="relative z-10">
              <RechartsBarChart 
                data={bestSellingProducts} 
                xAxisKey="name" 
                bars={[{ key: 'sales', name: 'Số lượng bán', color: '#06b6d4' }]} 
                height={limits.products > 5 ? limits.products * 60 : 350} 
                layout="vertical"
                showLabelOnTop={true}
                showGrid={false}
              />
            </div>
          </SWTCard>

          <SWTCard 
            title="Top Biến Thể Bán Chạy" 
            className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden" 
            bodyClassName="!p-6"
            extra={
              <SWTSelect 
                defaultValue={5} 
                size="small" 
                className="w-24"
                onChange={(v) => setLimits(prev => ({ ...prev, variants: v }))}
                options={[
                  { value: 5, label: 'Top 5' },
                  { value: 10, label: 'Top 10' },
                  { value: 15, label: 'Top 15' },
                ]}
              />
            }
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[30px] rounded-full pointer-events-none" />
            <div className="mb-4 flex items-center gap-2 relative z-10">
              <Activity size={16} className="text-indigo-500" />
              <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Chi tiết theo phân loại</Text>
            </div>
            <div className="relative z-10">
              <RechartsBarChart 
                data={bestSellingVariants} 
                xAxisKey="name" 
                bars={[{ key: 'sales', name: 'Số lượng bán', color: '#6366f1' }]} 
                height={limits.variants > 5 ? limits.variants * 60 : 350} 
                layout="vertical"
                showLabelOnTop={true}
                showGrid={false}
              />
            </div>
        </SWTCard>
      </div>

      {/* SECTION 2-B: BRAND INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <SWTCard 
          title="Thị phần Thương hiệu"
          className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden" 
          bodyClassName="!p-6"
          extra={
            <SWTSelect 
              defaultValue={5} 
              size="small" 
              className="w-24"
              onChange={(v) => setLimits(prev => ({ ...prev, brands: v }))}
              options={[
                { value: 5, label: 'Top 5' },
                { value: 10, label: 'Top 10' },
                { value: 15, label: 'Top 15' },
              ]}
            />
          }
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="mb-4 flex items-center gap-2 relative z-10">
            <Target size={16} className="text-emerald-500" />
            <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Dựa trên doanh thu</Text>
          </div>
          <div className="relative z-10">
            <RechartsPieChart 
              data={brandAnalytics.marketShare}
              height={320} 
            />
          </div>
        </SWTCard>
      </div>

      {/* SECTION 3: ENTITIES & LOGISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SWTCard 
          title="Tương quan Sản phẩm & Biến thể" 
          className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden"
          bodyClassName="!p-6"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <BarChart3 size={18} className="text-indigo-500" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Mật độ tùy chọn hàng hóa</span>
          </div>
          <div className="relative z-10">
            <RechartsBarChart 
              data={productVariantMetrics.distribution}
              xAxisKey="category"
              bars={[
                { key: "products", name: "Sản phẩm", color: "#6366f1" },
                { key: "variants", name: "Biến thể", color: "#f59e0b" }
              ]}
              height={320}
            />
          </div>
        </SWTCard>

        <SWTCard 
          title="Trạng thái Nhập hàng (PO)"
          className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0 relative overflow-hidden"
          bodyClassName="!p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Truck size={18} className="text-amber-500" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tiến độ cung ứng</span>
          </div>
          <div className="relative z-10">
            <RechartsPieChart 
              data={purchaseAnalytics.statusDistribution.map(s => ({ name: s.status, value: s.count }))} 
              colors={purchaseAnalytics.statusDistribution.map(s => s.color || "#94a3b8")}
              height={320}
            />
          </div>
        </SWTCard>
      </div>

      {/* SECTION 3: MARKET & USERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SWTCard title="Phân loại Khách hàng" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
          <div className="mb-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Mới vs. Quay lại</div>
          <RechartsPieChart data={userAnalytics.customerGrouping} colors={["#f43f5e", "#10b981"]} height={250} />
        </SWTCard>

        <SWTCard title="Cơ cấu Hạng thành viên" className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" bodyClassName="!p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award size={16} className="text-amber-500" />
            <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Phân bổ theo mức chi</Text>
          </div>
          <RechartsBarChart 
            data={userAnalytics.membershipTierDistribution} 
            xAxisKey="name" 
            bars={[{ key: "value", name: "Số lượng", color: "#f59e0b" }]} 
            cellColors={["#06b6d4", "#f59e0b", "#94a3b8", "#e2e8f0"]}
            height={250} 
          />
        </SWTCard>

        <SWTCard 
          title="Địa lý Khách hàng" 
          className="!shadow-lg !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-2xl !border-0" 
          bodyClassName="!p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-rose-500" />
            <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Khu vực tập trung</Text>
          </div>
          <RechartsBarChart data={userAnalytics.geoDistribution} xAxisKey="region" bars={[{ key: "count", name: "Khách", color: "#f43f5e" }]} height={250} />
        </SWTCard>
      </div>
    </div>
  );
}
