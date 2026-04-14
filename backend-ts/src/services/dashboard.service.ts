import { IDashboardService } from "../interfaces/IDashboardService";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";
import { DashboardQueryDto } from "../DTO/dashboard/input/DashboardQueryDto";
import { DashboardResponseDto } from "../DTO/dashboard/output/DashboardResponseDto";

export class DashboardService implements IDashboardService {
  private readonly dashboardRepo: IDashboardRepository;

  constructor(dashboardRepo: IDashboardRepository) {
    this.dashboardRepo = dashboardRepo;
  }

  async getDashboardSummary(query: DashboardQueryDto): Promise<DashboardResponseDto> {
    const [
      metrics,
      revenueProfit,
      categoryDist,
      productsSold,
      inventoryByCat,
      stockTrend,
      bestSellers,
      recentOrders,
      // Advanced
      statusDist,
      orderHeatmap,
      userGrowth,
      ltvScatter,
      geoDist,
      brandMetrics,
      productVariantStats,
      purchaseStats,
      detailedInventory,
      membershipTiers,
      bestSellingVariants,
      supplyDemandTrend
    ] = await Promise.all([
      this.dashboardRepo.getRawMetrics(query),
      this.dashboardRepo.getRevenueProfitData(query),
      this.dashboardRepo.getCategoryDistribution(),
      this.dashboardRepo.getProductsSoldGrowth(query),
      this.dashboardRepo.getInventoryByCategory(),
      this.dashboardRepo.getStockTrend(query),
      this.dashboardRepo.getBestSellingProducts(query.topProductsLimit || 5),
      this.dashboardRepo.getRecentOrders(10),
      // Advanced
      this.dashboardRepo.getOrderStatusDistribution(query),
      this.dashboardRepo.getOrderHeatmap(query),
      this.dashboardRepo.getUserGrowthByChannel(query),
      this.dashboardRepo.getUserLTVCorrelation(),
      this.dashboardRepo.getGeoDistribution(),
      this.dashboardRepo.getBrandPerformanceMetrics(query.topBrandsLimit || 5),
      this.dashboardRepo.getProductVariantStats(),
      this.dashboardRepo.getPurchaseOrderStats(query),
      this.dashboardRepo.getDetailedInventoryStats(),
      this.dashboardRepo.getMembershipTierDistribution(),
      this.dashboardRepo.getBestSellingVariants(query.topVariantsLimit || 5),
      this.dashboardRepo.getSupplyDemandTrend(query)
    ]);

    const netProfit = Number(metrics.totalRevenue) - Number(metrics.totalCost);

    return {
      metrics: {
        totalOrders: { 
          value: Number(metrics.totalOrders), 
          trend: 8.4, 
          isUp: true, 
          formattedValue: metrics.totalOrders.toLocaleString() 
        },
        totalRevenue: { 
          value: Number(metrics.totalRevenue), 
          trend: 12.1, 
          isUp: true, 
          formattedValue: this.formatCurrency(metrics.totalRevenue) 
        },
        netProfit: { 
          value: netProfit, 
          trend: 1.2, 
          isUp: netProfit > 0, 
          formattedValue: this.formatCurrency(netProfit) 
        },
        totalUsers: { 
          value: Number(metrics.totalUsers), 
          trend: 12.5, 
          isUp: true, 
          formattedValue: metrics.totalUsers.toLocaleString() 
        },
        monthlyNewUsers: { 
          value: Number(metrics.monthlyNewUsers), 
          trend: 5.2, 
          isUp: true, 
          formattedValue: metrics.monthlyNewUsers.toLocaleString() 
        },
      },
      revenueProfitComparison: revenueProfit.map((item: any) => ({
        name: item.name,
        revenue: Number(item.revenue),
        profit: Number(item.profit)
      })),
      productTypesDistribution: categoryDist.map((item: any) => ({
        name: item.name,
        value: Number(item.value)
      })),
      productsSoldGrowth: productsSold.map((item: any) => ({
        name: item.name,
        products: Number(item.products)
      })),
      inventoryByCategory: inventoryByCat.map((item: any) => ({
        name: item.name,
        stock: Number(item.stock)
      })),
      stockInTrend: stockTrend.map((item: any) => ({
        name: `Tuần ${item.name}`,
        ordered: Number(item.ordered),
        received: Number(item.received)
      })),
      bestSellingProducts: bestSellers.map((item: any) => ({
        name: item.name,
        sales: Number(item.sales)
      })),
      bestSellingVariants: bestSellingVariants.map((item: any) => ({
        name: item.name,
        sales: Number(item.sales)
      })),
      recentOrders: recentOrders.map((item: any) => ({
        id: item.id,
        customer: item.customer || "Khách vãng lai",
        product: item.product || "Đơn hàng tổng hợp",
        date: new Date(item.date).toLocaleDateString('vi-VN'),
        amount: Number(item.amount),
        status: this.translateStatus(item.status),
        formattedAmount: this.formatCurrency(item.amount)
      })),

      // Map Advanced Sections
      orderManagement: {
        statusDistribution: statusDist.map((item: any) => ({
          status: this.translateStatus(item.status),
          count: item.count,
          color: this.getStatusColor(item.status)
        })),
        revenueTrend: revenueProfit.map((item: any) => ({
          date: item.name,
          revenue: Number(item.revenue)
        })),
        conversionFunnel: [
          { stage: "Xem sản phẩm", value: Number(metrics.totalOrders) * 12 }, // Simulated view factor
          { stage: "Thêm vào giỏ", value: Number(metrics.totalOrders) * 3.5 }, // Simulated cart factor
          { stage: "Thanh toán", value: Number(metrics.totalOrders) },
          { stage: "Thành công", value: Number(statusDist.find((s: any) => s.status === 'DELIVERED')?.count || 0) }
        ],
        orderHeatmap: orderHeatmap.map((item: any) => ({
          day: item.day.trim(),
          hour: item.hour,
          value: item.value
        }))
      },

      userAnalytics: {
        customerGrouping: [
          { name: "Khách mới", value: Number(metrics.monthlyNewUsers) },
          { name: "Khách quay lại", value: Number(metrics.totalUsers) - Number(metrics.monthlyNewUsers) }
        ],
        growthByChannel: userGrowth.map((item: any) => ({
          name: item.name,
          google: Number(item.google),
          facebook: Number(item.facebook),
          email: Number(item.email)
        })),
        ltvScatter: ltvScatter.map((item: any) => ({
          x: Number(item.x),
          y: Number(item.y),
          z: Number(item.y) / Math.max(Number(item.x), 1), // Average order value as bubble size
          name: item.name
        })),
        geoDistribution: geoDist.map((item: any) => ({
          region: item.region,
          count: item.count
        })),
        membershipTierDistribution: membershipTiers.map((item: any) => ({
          name: item.tier,
          value: item.count
        }))
      },

      brandAnalytics: {
        topBrands: brandMetrics.slice(0, 5).map((item: any) => ({
          name: item.name,
          revenue: item.revenue
        })),
        brandHealth: brandMetrics.slice(0, 4).map((item: any) => ({
          brandName: item.name,
          data: [
            { subject: "Doanh số", A: Number(item.revenue) / 1000000, fullMark: 100 },
            { subject: "Sản phẩm", A: Number(item.products) * 5, fullMark: 100 },
            { subject: "Đánh giá", A: (Number(item.rating) || 0) * 20, fullMark: 100 },
            { subject: "Tồn kho", A: 65, fullMark: 100 }, // Placeholder for detailed stock health
            { subject: "Quay lại", A: 75, fullMark: 100 }   // Placeholder for retention
          ]
        })),
        brandProductCorrelation: brandMetrics.map((item: any) => ({
          name: item.name,
          products: Number(item.products),
          revenue: Number(item.revenue)
        })),
        marketShare: brandMetrics.map((item: any) => ({
          name: item.name,
          value: Number(item.revenue)
        }))
      },
      productVariantMetrics: productVariantStats,
      purchaseAnalytics: {
        totalSpending: purchaseStats.totalSpending,
        statusDistribution: purchaseStats.statusDistribution.map((m: any) => ({
          status: this.translatePOStatus(m.status),
          count: Number(m.count),
          color: this.getPOStatusColor(m.status)
        })),
        spendingTrend: purchaseStats.spendingTrend.map((m: any) => ({ name: m.name, value: Number(m.value) })),
        spendingByBrand: purchaseStats.spendingByBrand.map((m: any) => ({ name: m.name, value: Number(m.value) })),
        priorityDistribution: purchaseStats.priorityDistribution.map((m: any) => ({ 
          name: this.translatePOPriority(m.priority), 
          value: Number(m.value) 
        })),
        statusTrend: this.pivotStatusData(purchaseStats.statusTrend),
        supplyDemandTrend: supplyDemandTrend.map((m: any) => ({
          name: m.name,
          sold: Number(m.sold),
          received: Number(m.received)
        }))
      },
      inventoryAnalytics: detailedInventory
    };
  }

  private pivotStatusData(data: any[]): any[] {
    const pivoted: Record<string, any> = {};
    data.forEach(item => {
      if (!pivoted[item.name]) {
        pivoted[item.name] = { name: item.name };
      }
      pivoted[item.name][this.translatePOStatus(item.status)] = Number(item.count);
    });
    return Object.values(pivoted);
  }

  private translatePOPriority(priority: string): string {
    const map: Record<string, string> = {
      'HIGH': 'Cao',
      'NORMAL': 'Thường',
      'LOW': 'Thấp'
    };
    return map[priority] || priority;
  }

  private translatePOStatus(status: string): string {
    const map: Record<string, string> = {
      'DRAFT': 'Lưu nháp',
      'CONFIRMED': 'Đã duyệt',
      'PARTIALLY_RECEIVED': 'Nhận một phần',
      'COMPLETED': 'Hoàn tất',
      'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
  }

  private getPOStatusColor(status: string): string {
    const map: Record<string, string> = {
      'DRAFT': '#94a3b8',
      'CONFIRMED': '#6366f1',
      'PARTIALLY_RECEIVED': '#f59e0b',
      'COMPLETED': '#10b981',
      'CANCELLED': '#ef4444'
    };
    return map[status] || '#cbd5e1';
  }

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'DELIVERED': '#10B981',
      'PENDING': '#F59E0B',
      'SHIPPING': '#3B82F6',
      'CANCELLED': '#EF4444',
      'CONFIRMED': '#8B5CF6',
      'RETURNED': '#6B7280'
    };
    return colors[status] || '#CBD5E1';
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  private translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'Đang xử lý',
      'DELIVERED': 'Đã giao',
      'CANCELLED': 'Đã hủy',
      'SHIPPING': 'Đang giao',
      'CONFIRMED': 'Đã xác nhận',
      'RETURNED': 'Đã trả'
    };
    return statusMap[status] || status;
  }
}
