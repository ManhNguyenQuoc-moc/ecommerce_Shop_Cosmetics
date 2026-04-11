import { get } from "../api";
import { PointLogDTO, PointSummaryDTO } from "../models/customer/point.dto";

const path = "/users/me";

export const getPointsSummary = async (): Promise<PointSummaryDTO> => {
  const user = await get<any>(path);
  
  // Real points from user profile, mock tier logic for now as it's not in DB yet
  const points = user.loyalty_points || 0;
  
  return {
    total_points: points,
    current_tier: points > 5000 ? "Kim cương" : points > 2000 ? "Vàng" : points > 1000 ? "Bạc" : "Thành viên",
    next_tier: points > 5000 ? "MAX" : points > 2000 ? "Kim cương" : points > 1000 ? "Vàng" : "Bạc",
    points_to_next_tier: points > 5000 ? 0 : points > 2000 ? 5000 - points : points > 1000 ? 2000 - points : 1000 - points,
  };
};

export const getPointsHistory = async (): Promise<PointLogDTO[]> => {
  const history = await get<any[]>(`${path}/points`);
  return history.map(h => ({
    id: h.id,
    amount: h.amount,
    reason: h.reason,
    created_at: h.createdAt,
    type: h.type as any,
  }));
};
