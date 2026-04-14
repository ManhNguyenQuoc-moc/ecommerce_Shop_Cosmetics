import { prisma } from "../config/prisma";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";
import { DashboardQueryDto } from "../DTO/dashboard/input/DashboardQueryDto";

export class DashboardRepository implements IDashboardRepository {
  async getRawMetrics(query: DashboardQueryDto): Promise<any> {
    const { startDate, endDate } = this.getDateRange(query);

    const metrics = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM "Order" WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}) as "totalOrders",
        (SELECT COALESCE(SUM("final_amount"), 0) FROM "Order" WHERE "current_status" = 'DELIVERED' AND "createdAt" BETWEEN ${startDate} AND ${endDate}) as "totalRevenue",
        (SELECT COUNT(*) FROM "User" WHERE "role" = 'CUSTOMER' AND "createdAt" BETWEEN ${startDate} AND ${endDate}) as "monthlyNewUsers",
        (SELECT COUNT(*) FROM "User" WHERE "role" = 'CUSTOMER') as "totalUsers"
    `;
    
    // Profit calculation: Revenue - Cost
    const costData = await prisma.$queryRaw`
      SELECT COALESCE(SUM(oi.quantity * pv."costPrice"), 0) as "totalCost"
      FROM "OrderItem" oi
      JOIN "ProductVariant" pv ON oi."variantId" = pv.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."current_status" = 'DELIVERED' AND o."createdAt" BETWEEN ${startDate} AND ${endDate}
    `;

    return {
      ...(metrics as any)[0],
      totalCost: (costData as any)[0].totalCost
    };
  }

  async getRevenueProfitData(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    const grouping = this.getGroupingConfig(query.timeFilter, 'o');
    
    return prisma.$queryRawUnsafe(`
      SELECT 
        r.name,
        (r.revenue)::float as revenue,
        (r.revenue - COALESCE(c.cost, 0))::float as profit
      FROM (
        SELECT 
          ${grouping.sql} as name,
          ${grouping.sort} as sort_key,
          SUM("final_amount") as revenue
        FROM "Order" o
        WHERE o."current_status" = 'DELIVERED' AND o."createdAt" BETWEEN $1 AND $2
        GROUP BY name, sort_key
      ) r
      LEFT JOIN (
        SELECT 
          ${grouping.sql} as name,
          SUM(oi.quantity * pv."costPrice") as cost
        FROM "Order" o
        JOIN "OrderItem" oi ON oi."orderId" = o.id
        JOIN "ProductVariant" pv ON oi."variantId" = pv.id
        WHERE o."current_status" = 'DELIVERED' AND o."createdAt" BETWEEN $1 AND $2
        GROUP BY name
      ) c ON r.name = c.name
      ORDER BY r.sort_key
    `, startDate, endDate);
  }

  async getCategoryDistribution(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT COALESCE(cg.name, 'Sản phẩm khác') as name, COUNT(oi.id)::int as value
      FROM "OrderItem" oi
      JOIN "ProductVariant" pv ON oi."variantId" = pv.id
      JOIN "Product" p ON pv."productId" = p.id
      JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "CategoryGroup" cg ON c."categoryGroupId" = cg.id
      GROUP BY cg.name, cg.id
      ORDER BY value DESC
      LIMIT 10
    `;
  }

  async getProductsSoldGrowth(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    const grouping = this.getGroupingConfig(query.timeFilter, 'o');

    return prisma.$queryRawUnsafe(`
      SELECT 
        ${grouping.sql} as name,
        ${grouping.sort} as sort_key,
        SUM(oi.quantity)::int as products
      FROM "OrderItem" oi
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."current_status" = 'DELIVERED' AND o."createdAt" BETWEEN $1 AND $2
      GROUP BY name, sort_key
      ORDER BY sort_key
    `, startDate, endDate);
  }

  async getInventoryByCategory(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT COALESCE(cg.name, 'Tồn kho khác') as name, SUM(b.quantity)::int as stock
      FROM "Batch" b
      JOIN "ProductVariant" pv ON b."variantId" = pv.id
      JOIN "Product" p ON pv."productId" = p.id
      JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "CategoryGroup" cg ON c."categoryGroupId" = cg.id
      GROUP BY cg.name, cg.id
      ORDER BY stock DESC
    `;
  }

  async getStockTrend(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    return prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'W') as name,
        SUM("orderedQty")::int as ordered,
        SUM("receivedQty")::int as received
      FROM "PurchaseOrderItem"
      WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY name
      ORDER BY name
    `;
  }

  async getSupplyDemandTrend(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    const gr = (a: string) => this.getGroupingConfig(query.timeFilter, a);
    
    return prisma.$queryRawUnsafe(`
      WITH time_axis AS (
        SELECT DISTINCT ${gr('o').sql} as name, ${gr('o').sort} as sort_key
        FROM "Order" o WHERE o."createdAt" BETWEEN $1 AND $2
        UNION
        SELECT DISTINCT ${gr('po').sql} as name, ${gr('po').sort} as sort_key
        FROM "PurchaseOrder" po WHERE po."createdAt" BETWEEN $1 AND $2
      ),
      sales AS (
        SELECT ${gr('o').sql} as name, SUM(oi.quantity)::int as sold
        FROM "Order" o
        JOIN "OrderItem" oi ON o.id = oi."orderId"
        WHERE o."current_status" = 'DELIVERED' AND o."createdAt" BETWEEN $1 AND $2
        GROUP BY name
      ),
      purchases AS (
        SELECT ${gr('poi').sql} as name, SUM(poi."receivedQty")::int as received
        FROM "PurchaseOrderItem" poi
        WHERE poi."createdAt" BETWEEN $1 AND $2
        GROUP BY name
      )
      SELECT 
        ta.name, 
        COALESCE(s.sold, 0) as sold, 
        COALESCE(p.received, 0) as received
      FROM time_axis ta
      LEFT JOIN sales s ON ta.name = s.name
      LEFT JOIN purchases p ON ta.name = p.name
      ORDER BY ta.sort_key
    `, startDate, endDate);
  }

  async getBestSellingProducts(limit: number): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT p.name, SUM(oi.quantity)::int as sales
      FROM "OrderItem" oi
      JOIN "ProductVariant" pv ON oi."variantId" = pv.id
      JOIN "Product" p ON pv."productId" = p.id
      GROUP BY p.name
      ORDER BY sales DESC
      LIMIT ${limit}
    `;
  }

  async getBestSellingVariants(limit: number): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT 
        p.name || COALESCE(' - ' || pv.color, '') || COALESCE(' (' || pv.size || ')', '') as name, 
        SUM(oi.quantity)::int as sales
      FROM "OrderItem" oi
      JOIN "ProductVariant" pv ON oi."variantId" = pv.id
      JOIN "Product" p ON pv."productId" = p.id
      GROUP BY p.name, pv.color, pv.size
      ORDER BY sales DESC
      LIMIT ${limit}
    `;
  }

  async getRecentOrders(limit: number): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT 
        o.id, 
        u.full_name as customer, 
        (
          SELECT p.name 
          FROM "OrderItem" oi2 
          JOIN "ProductVariant" pv2 ON oi2."variantId" = pv2.id 
          JOIN "Product" p ON pv2."productId" = p.id 
          WHERE oi2."orderId" = o.id 
          LIMIT 1
        ) as product, 
        o."createdAt" as date, 
        o.final_amount as amount, 
        o.current_status as status
      FROM "Order" o
      JOIN "User" u ON o."userId" = u.id
      ORDER BY o."createdAt" DESC
      LIMIT ${limit}
    `;
  }

  async getOrderStatusDistribution(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    return prisma.$queryRaw`
      SELECT 
        "current_status" as status,
        COUNT(*)::int as count
      FROM "Order"
      WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY status
      ORDER BY count DESC
    `;
  }

  async getOrderHeatmap(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    return prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'FullDay') as day,
        EXTRACT(HOUR FROM "createdAt")::int as hour,
        COUNT(*)::int as value
      FROM "Order"
      WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY day, hour
      ORDER BY hour
    `;
  }

  async getUserGrowthByChannel(query: DashboardQueryDto): Promise<any[]> {
    const { startDate, endDate } = this.getDateRange(query);
    return prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'Mon') as name,
        TO_CHAR("createdAt", 'MM') as month_num,
        COUNT(*) FILTER (WHERE provider = 'GOOGLE')::int as google,
        COUNT(*) FILTER (WHERE provider = 'FACEBOOK')::int as facebook,
        COUNT(*) FILTER (WHERE provider = 'LOCAL')::int as email
      FROM "User"
      WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY name, month_num
      ORDER BY month_num
    `;
  }

  async getMembershipTierDistribution(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN lifetime_points >= 10000 THEN 'Kim Cương'
          WHEN lifetime_points >= 5000 THEN 'Vàng'
          WHEN lifetime_points >= 1000 THEN 'Bạc'
          ELSE 'Đồng'
        END as tier,
        COUNT(*)::int as count
      FROM "User"
      WHERE role = 'CUSTOMER'
      GROUP BY tier
      ORDER BY count DESC
    `;
  }

  async getUserLTVCorrelation(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT 
        COUNT(o.id)::int as x,
        SUM(o.final_amount)::float as y,
        u.full_name as name
      FROM "User" u
      JOIN "Order" o ON u.id = o."userId"
      WHERE o.current_status = 'DELIVERED'
      GROUP BY u.id, u.full_name
      HAVING COUNT(o.id) > 0
      LIMIT 100
    `;
  }

  async getGeoDistribution(): Promise<any[]> {
    // Basic heuristics for Vietnam provinces
    return prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN address ILIKE '%Hà Nội%' THEN 'Hà Nội'
          WHEN address ILIKE '%Hồ Chí Minh%' OR address ILIKE '%HCM%' THEN 'TP. HCM'
          WHEN address ILIKE '%Đà Nẵng%' THEN 'Đà Nẵng'
          WHEN address ILIKE '%Cần Thơ%' THEN 'Cần Thơ'
          WHEN address ILIKE '%Hải Phòng%' THEN 'Hải Phòng'
          ELSE 'Tỉnh thành khác'
        END as region,
        COUNT(*)::int as count
      FROM "Address"
      GROUP BY region
      ORDER BY count DESC
    `;
  }

  async getBrandPerformanceMetrics(limit?: number): Promise<any[]> {
    const limitClause = limit ? `LIMIT ${limit}` : '';
    return prisma.$queryRawUnsafe(`
      SELECT 
        b.name,
        SUM(oi.quantity * oi.price_at_purchase)::float as revenue,
        COUNT(DISTINCT p.id)::int as products,
        AVG(r.rating)::float as rating
      FROM "Brand" b
      JOIN "Product" p ON b.id = p."brandId"
      JOIN "ProductVariant" pv ON p.id = pv."productId"
      JOIN "OrderItem" oi ON pv.id = oi."variantId"
      LEFT JOIN "Review" r ON p.id = r."productId"
      GROUP BY b.id, b.name
      ORDER BY revenue DESC
      ${limitClause}
    `);
  }

  async getProductVariantStats(): Promise<any> {
    const counts = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM "Product")::int as "totalProducts",
        (SELECT COUNT(*) FROM "ProductVariant")::int as "totalVariants"
    `;

    const distribution = await prisma.$queryRaw`
      SELECT 
        COALESCE(cg.name, 'Nhóm khác') as category, 
        COUNT(DISTINCT p.id)::int as products, 
        COUNT(pv.id)::int as variants
      FROM "Category" c
      LEFT JOIN "CategoryGroup" cg ON c."categoryGroupId" = cg.id
      LEFT JOIN "Product" p ON c.id = p."categoryId"
      LEFT JOIN "ProductVariant" pv ON p.id = pv."productId"
      GROUP BY cg.name, cg.id
      ORDER BY products DESC
      LIMIT 12
    `;

    return {
      ...(counts as any)[0],
      distribution
    };
  }

  async getPurchaseOrderStats(query: DashboardQueryDto): Promise<any> {
    const { startDate, endDate } = this.getDateRange(query);
    const grouping = this.getGroupingConfig(query.timeFilter, 'po');

    const statusDist: any[] = await prisma.$queryRaw`
      SELECT status, COUNT(*)::int as count
      FROM "PurchaseOrder"
      WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY status
    `;

    const totalSpendingData: any[] = await prisma.$queryRaw`
      SELECT COALESCE(SUM("totalAmount"), 0)::float as total
      FROM "PurchaseOrder"
      WHERE status = 'COMPLETED' AND "createdAt" BETWEEN ${startDate} AND ${endDate}
    `;

    const spendingTrend: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        ${grouping.sql} as name,
        ${grouping.sort} as sort_key,
        SUM("totalAmount")::float as value
      FROM "PurchaseOrder" po
      WHERE status = 'COMPLETED' AND po."createdAt" BETWEEN $1 AND $2
      GROUP BY name, sort_key
      ORDER BY sort_key
    `, startDate, endDate);

    const spendingByBrand: any[] = await prisma.$queryRaw`
      SELECT b.name, SUM(po."totalAmount")::float as value
      FROM "PurchaseOrder" po
      JOIN "Brand" b ON po."brandId" = b.id
      WHERE po.status = 'COMPLETED' AND po."createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY b.name
      ORDER BY value DESC
    `;

    const priorityDist: any[] = await prisma.$queryRaw`
      SELECT priority, COUNT(*)::int as value
      FROM "PurchaseOrder"
      WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY priority
    `;

    const statusTrend: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        ${grouping.sql} as name,
        ${grouping.sort} as sort_key,
        status,
        COUNT(*)::int as count
      FROM "PurchaseOrder" po
      WHERE po."createdAt" BETWEEN $1 AND $2
      GROUP BY name, sort_key, status
      ORDER BY sort_key
    `, startDate, endDate);

    return {
      statusDistribution: statusDist.map(s => ({
        status: s.status,
        count: s.count,
        color: this.getPOStatusColor(s.status)
      })),
      totalSpending: totalSpendingData[0].total,
      spendingTrend,
      spendingByBrand,
      priorityDistribution: priorityDist,
      statusTrend
    };
  }

  async getDetailedInventoryStats(): Promise<any> {
    const valuation = await prisma.$queryRaw`
      SELECT COALESCE(SUM(quantity * "costPrice"), 0)::float as total
      FROM "Batch"
    `;

    const now = new Date();
    const nearExpiry = new Date();
    nearExpiry.setMonth(nearExpiry.getMonth() + 3);

    const expiryStatus = await prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN quantity = 0 THEN 'OUT_OF_STOCK'
          WHEN "expiryDate" < ${now} THEN 'EXPIRED'
          WHEN "expiryDate" <= ${nearExpiry} THEN 'NEAR_EXPIRY'
          ELSE 'GOOD'
        END as name,
        COUNT(*)::int as value
      FROM "Batch"
      GROUP BY name
    `;

    const lowStockAlerts = await prisma.$queryRaw`
      SELECT p.name, SUM(b.quantity)::int as stock, 10 as threshold
      FROM "Batch" b
      JOIN "ProductVariant" pv ON b."variantId" = pv.id
      JOIN "Product" p ON pv."productId" = p.id
      GROUP BY p.name
      HAVING SUM(b.quantity) < 10
      ORDER BY stock ASC
      LIMIT 10
    `;

    return {
      valuation: (valuation as any)[0].total,
      expiryStatus,
      lowStockAlerts
    };
  }

  private getGroupingConfig(filter: string, alias: string = '') {
    const col = alias ? `${alias}."createdAt"` : '"createdAt"';
    switch (filter) {
      case 'annually':
        return { sql: `TO_CHAR(${col}, 'YYYY')`, sort: `TO_CHAR(${col}, 'YYYY')` };
      case 'quarterly':
        return { sql: `'Q' || TO_CHAR(${col}, 'Q YYYY')`, sort: `TO_CHAR(${col}, 'YYYY-MM')` };
      case 'monthly':
        return { sql: `TO_CHAR(${col}, 'MM/YYYY')`, sort: `TO_CHAR(${col}, 'YYYY-MM')` };
      case 'weekly':
        return { sql: `'T' || TO_CHAR(${col}, 'IW/IYYY')`, sort: `TO_CHAR(${col}, 'IYYY-IW')` };
      case 'daily':
      default:
        return { sql: `TO_CHAR(${col}, 'DD/MM')`, sort: `TO_CHAR(${col}, 'YYYY-MM-DD')` };
    }
  }

  private getPOStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PENDING': '#F59E0B',
      'COMPLETED': '#10B981',
      'CANCELLED': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  private getDateRange(query: DashboardQueryDto) {
    let startDate = query.startDate ? new Date(query.startDate) : new Date();
    let endDate = query.endDate ? new Date(query.endDate) : new Date();

    // Ensure endDate is end of day
    endDate.setHours(23, 59, 59, 999);

    if (!query.startDate) {
      if (query.timeFilter === 'annually') {
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
      } else if (query.timeFilter === 'monthly') {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      } else if (query.timeFilter === 'weekly') {
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else if (query.timeFilter === 'daily') {
        startDate.setHours(0, 0, 0, 0);
      } else if (query.timeFilter === 'all') {
        startDate = new Date(0); // Lifetime data
      } else {
        // Default to last 10 days for analysis
        startDate.setDate(startDate.getDate() - 9);
        startDate.setHours(0, 0, 0, 0);
      }
    } else {
      // If startDate is picked, ensure it's start of day
      startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
  }
}
