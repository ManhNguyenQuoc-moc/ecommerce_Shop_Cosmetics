import { DashboardDataDTO } from "../models/admin/dashboard.dto";

// Giả lập network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardData = async (): Promise<DashboardDataDTO> => {
  await delay(800); // Mock API latency
  
  return {
    metrics: {
      totalRevenue: 124500000,
      totalRevenueTrend: 12.5,
      newOrders: 845,
      newOrdersTrend: 8.2,
      customers: 3201,
      customersTrend: -2.4,
      products: 142,
      productsTrend: 5.0,
    },
    monthlySales: [
      { month: "Jan", sales: 150, revenue: 20000000 },
      { month: "Feb", sales: 180, revenue: 24000000 },
      { month: "Mar", sales: 201, revenue: 26500000 },
      { month: "Apr", sales: 298, revenue: 35000000 },
      { month: "May", sales: 187, revenue: 22000000 },
      { month: "Jun", sales: 195, revenue: 23500000 },
      { month: "Jul", sales: 291, revenue: 38000000 },
      { month: "Aug", sales: 110, revenue: 15000000 },
      { month: "Sep", sales: 215, revenue: 28000000 },
      { month: "Oct", sales: 390, revenue: 52000000 },
      { month: "Nov", sales: 280, revenue: 36000000 },
      { month: "Dec", sales: 112, revenue: 16000000 },
    ]
  };
};
