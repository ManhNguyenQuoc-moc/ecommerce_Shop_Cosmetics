export interface MonthlySalesDTO {
  month: string;
  sales: number;
  revenue: number;
}

export interface DashboardMetricsDTO {
  totalRevenue: number;
  totalRevenueTrend: number; // percentage
  newOrders: number;
  newOrdersTrend: number;
  customers: number;
  customersTrend: number;
  products: number;
  productsTrend: number;
}

export interface DashboardDataDTO {
  metrics: DashboardMetricsDTO;
  monthlySales: MonthlySalesDTO[];
}
