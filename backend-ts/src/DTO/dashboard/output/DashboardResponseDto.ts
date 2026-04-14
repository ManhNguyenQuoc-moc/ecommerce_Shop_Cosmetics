export interface MetricItemDto {
  value: number;
  trend: number;
  isUp: boolean;
  formattedValue?: string;
}

export interface RevenueProfitDataDto {
  name: string;
  revenue: number;
  profit: number;
}

export interface ProductTypeDataDto {
  name: string;
  value: number;
}

export interface ProductsSoldDataDto {
  name: string;
  products: number;
}

export interface InventoryCategoryDataDto {
  name: string;
  stock: number;
}

export interface StockTrendDataDto {
  name: string;
  ordered: number;
  received: number;
}

export interface BestSellingProductDataDto {
  name: string;
  sales: number;
}

export interface RecentOrderDto {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: number;
  status: string;
  formattedAmount?: string;
}

// New Advanced Analytics Types
export interface OrderStatusDistributionDto {
  status: string;
  count: number;
  color?: string;
}

export interface FunnelDataDto {
  stage: string;
  value: number;
}

export interface HeatmapDataDto {
  day: string;
  hour: number;
  value: number;
}

export interface UserGrowthDto {
  name: string; // e.g., "Jan"
  google: number;
  facebook: number;
  email: number;
}

export interface LTVDataDto {
  x: number; // Order Count
  y: number; // Total Spent
  z: number; // Bubble Size / Weight
  name?: string;
}

export interface GeoDistributionDto {
  region: string;
  count: number;
}

export interface BrandRadarDto {
  subject: string;
  A: number;
  fullMark: number;
}

export interface BrandHealthDto {
  brandName: string;
  data: BrandRadarDto[];
}

export interface DashboardResponseDto {
  metrics: {
    totalOrders: MetricItemDto;
    totalRevenue: MetricItemDto;
    netProfit: MetricItemDto;
    totalUsers: MetricItemDto;
    monthlyNewUsers: MetricItemDto;
  };
  revenueProfitComparison: RevenueProfitDataDto[];
  productTypesDistribution: ProductTypeDataDto[];
  productsSoldGrowth: ProductsSoldDataDto[];
  inventoryByCategory: InventoryCategoryDataDto[];
  stockInTrend: StockTrendDataDto[];
  bestSellingProducts: BestSellingProductDataDto[];
  bestSellingVariants: BestSellingProductDataDto[];
  recentOrders: RecentOrderDto[];
  
  // Advanced Sections
  orderManagement: {
    statusDistribution: OrderStatusDistributionDto[];
    revenueTrend: { date: string, revenue: number }[];
    conversionFunnel: FunnelDataDto[];
    orderHeatmap: HeatmapDataDto[];
  };
  userAnalytics: {
    customerGrouping: { name: string, value: number }[];
    growthByChannel: UserGrowthDto[];
    ltvScatter: LTVDataDto[];
    geoDistribution: GeoDistributionDto[];
    membershipTierDistribution: { name: string, value: number }[];
  };
  brandAnalytics: {
    topBrands: { name: string, revenue: number }[];
    brandHealth: BrandHealthDto[];
    brandProductCorrelation: { name: string, products: number, revenue: number }[];
    marketShare: { name: string, value: number }[];
  };
  productVariantMetrics: {
    totalProducts: number;
    totalVariants: number;
    distribution: { category: string, products: number, variants: number }[];
  };
  purchaseAnalytics: {
    totalSpending: number;
    statusDistribution: { status: string, count: number, color: string }[];
    spendingTrend: { name: string, value: number }[];
    spendingByBrand: { name: string, value: number }[];
    priorityDistribution: { name: string, value: number }[];
    statusTrend: any[];
    supplyDemandTrend: { name: string, sold: number, received: number }[];
  };
  inventoryAnalytics: {
    valuation: number;
    expiryStatus: { name: string, value: number }[];
    lowStockAlerts: { name: string, stock: number, threshold: number }[];
  };
}
