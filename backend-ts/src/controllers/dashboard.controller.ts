import { Request, Response } from "express";
import { IDashboardService } from "../interfaces/IDashboardService";
import { DashboardQueryDto } from "../DTO/dashboard/input/DashboardQueryDto";

export class DashboardController {
  private readonly dashboardService: IDashboardService;

  constructor(dashboardService: IDashboardService) {
    this.dashboardService = dashboardService;
  }

  getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      // Basic input mapping from query params
      const query: DashboardQueryDto = {
        timeFilter: (req.query.timeFilter as any) || 'monthly',
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const dashboardData = await this.dashboardService.getDashboardSummary(query);

      res.status(200).json({
        success: true,
        message: "Dashboard summary retrieved successfully",
        data: dashboardData,
      });
    } catch (error: any) {
      console.error("DashboardController Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}
