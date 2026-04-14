import { DashboardQueryDto } from "../DTO/dashboard/input/DashboardQueryDto";

export interface IDashboardRepository {
  getRawMetrics(query: DashboardQueryDto): Promise<any>;
  getRevenueProfitData(query: DashboardQueryDto): Promise<any[]>;
  getCategoryDistribution(): Promise<any[]>;
  getProductsSoldGrowth(query: DashboardQueryDto): Promise<any[]>;
  getInventoryByCategory(): Promise<any[]>;
  getStockTrend(query: DashboardQueryDto): Promise<any[]>;
  getBestSellingProducts(limit: number): Promise<any[]>;
  getRecentOrders(limit: number): Promise<any[]>;
  
  // Advanced Analytics Methods
  getOrderStatusDistribution(query: DashboardQueryDto): Promise<any[]>;
  getOrderHeatmap(query: DashboardQueryDto): Promise<any[]>;
  getUserGrowthByChannel(query: DashboardQueryDto): Promise<any[]>;
  getUserLTVCorrelation(): Promise<any[]>;
  getGeoDistribution(): Promise<any[]>;
  getBrandPerformanceMetrics(limit: number): Promise<any[]>;
  getProductVariantStats(): Promise<any>;
  getPurchaseOrderStats(query: DashboardQueryDto): Promise<any>;
  getDetailedInventoryStats(): Promise<any>;
  getMembershipTierDistribution(): Promise<any[]>;
  getBestSellingVariants(limit: number): Promise<any[]>;
  getSupplyDemandTrend(query: DashboardQueryDto): Promise<any[]>;
}
