import { get } from "../../../@core/utils/api";
import { DashboardResponseDTO, DashboardQueryDTO } from "./models/output.model";

export const DASHBOARD_API_ENDPOINT = "/admin/dashboard/summary";

export const getDashboardData = (query?: DashboardQueryDTO): Promise<DashboardResponseDTO> => {
  return get<DashboardResponseDTO>(DASHBOARD_API_ENDPOINT, query);
};
