import { DashboardQueryDto } from "../DTO/dashboard/input/DashboardQueryDto";
import { DashboardResponseDto } from "../DTO/dashboard/output/DashboardResponseDto";

export interface IDashboardService {
  getDashboardSummary(query: DashboardQueryDto): Promise<DashboardResponseDto>;
}
