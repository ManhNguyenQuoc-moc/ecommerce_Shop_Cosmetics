import { get } from "../../../@core/utils/api";
import { PointLogDTO, PointSummaryDTO } from "../../models/customer/point.dto";

const path = "/users/me";

export const getPointsSummary = async (): Promise<PointSummaryDTO> => {
  const user = await get<any>(path);
  
  // Use lifetime_points (accumulated) instead of loyalty_points (available)
  // lifetime_points = total points ever earned
  // loyalty_points = available points (can be spent)
  const totalPoints = user.lifetime_points || 0;
  const availablePoints = user.loyalty_points || 0;
  const currentTier = user.member_rank || "Thành viên";
  
  // Calculate next tier based on lifetime_points
  let nextTier = "MAX";
  let pointsToNext = 0;
  
  if (totalPoints < 1000) {
    nextTier = "Bạc";
    pointsToNext = 1000 - totalPoints;
  } else if (totalPoints < 5000) {
    nextTier = "Vàng";
    pointsToNext = 5000 - totalPoints;
  } else if (totalPoints < 10000) {
    nextTier = "Kim cương";
    pointsToNext = 10000 - totalPoints;
  } else {
    nextTier = "MAX";
    pointsToNext = 0;
  }
  
  return {
    total_points: totalPoints,
    available_points: availablePoints,
    current_tier: currentTier,
    next_tier: nextTier,
    points_to_next_tier: pointsToNext,
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
