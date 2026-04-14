export interface DashboardQueryDto {
  timeFilter: 'all' | 'annually' | 'quarterly' | 'monthly' | 'weekly' | 'daily' | 'custom';
  startDate?: string;
  endDate?: string;
  topProductsLimit?: number;
  topVariantsLimit?: number;
  topBrandsLimit?: number;
}
