export interface MetricItemDTO {
    value: number;
    trend: number;
    isUp: boolean;
    formattedValue?: string;
}

export interface RevenueProfitData {
    name: string;
    revenue: number;
    profit: number;
}

export interface MonthlySalesDTO {
    month: string;
    revenue: number;
    sales: number;
}

export interface ProductTypeData {
    name: string;
    value: number;
}

export interface ProductsSoldData {
    name: string;
    products: number;
}

export interface InventoryCategoryData {
    name: string;
    stock: number;
}

export interface StockTrendData {
    name: string;
    ordered: number;
    received: number;
}

export interface BestSellingProductData {
    name: string;
    sales: number;
}

export interface RecentOrderDTO {
    id: string;
    customer: string;
    product: string;
    date: string;
    amount: number;
    status: string;
    formattedAmount?: string;
}

// New Advanced Analytics Types
export interface OrderStatusDistributionDTO {
    status: string;
    count: number;
    color?: string;
}

export interface FunnelDataDTO {
    stage: string;
    value: number;
}

export interface HeatmapDataDTO {
    day: string;
    hour: number;
    value: number;
}

export interface UserGrowthDTO {
    name: string;
    google: number;
    facebook: number;
    email: number;
}

export interface LTVDataDTO {
    x: number;
    y: number;
    z: number;
    name?: string;
}

export interface GeoDistributionDTO {
    region: string;
    count: number;
}

export interface BrandRadarDTO {
    subject: string;
    A: number;
    fullMark: number;
}

export interface BrandHealthDTO {
    brandName: string;
    data: BrandRadarDTO[];
}

export interface DashboardResponseDTO {
    metrics: {
        totalOrders: MetricItemDTO;
        totalRevenue: MetricItemDTO;
        netProfit: MetricItemDTO;
        totalUsers: MetricItemDTO;
        monthlyNewUsers: MetricItemDTO;
    };
    revenueProfitComparison: RevenueProfitData[];
    productTypesDistribution: ProductTypeData[];
    productsSoldGrowth: ProductsSoldData[];
    inventoryByCategory: InventoryCategoryData[];
    stockInTrend: StockTrendData[];
    bestSellingProducts: BestSellingProductData[];
    bestSellingVariants: BestSellingProductData[];
    recentOrders: RecentOrderDTO[];

    // Advanced Sections
    orderManagement: {
        statusDistribution: OrderStatusDistributionDTO[];
        revenueTrend: { date: string, revenue: number }[];
        conversionFunnel: FunnelDataDTO[];
        orderHeatmap: HeatmapDataDTO[];
    };
    userAnalytics: {
        customerGrouping: { name: string, value: number }[];
        growthByChannel: UserGrowthDTO[];
        ltvScatter: LTVDataDTO[];
        geoDistribution: GeoDistributionDTO[];
        membershipTierDistribution: { name: string, value: number }[];
    };
    brandAnalytics: {
        topBrands: { name: string, revenue: number }[];
        brandHealth: BrandHealthDTO[];
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

export interface DashboardQueryDTO {
    timeFilter: 'all' | 'annually' | 'quarterly' | 'monthly' | 'weekly' | 'daily' | 'custom';
    startDate?: string;
    endDate?: string;
    topProductsLimit?: number;
    topVariantsLimit?: number;
    topBrandsLimit?: number;
}
