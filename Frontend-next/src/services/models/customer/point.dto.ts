export interface PointLogDTO {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
  type: "EARN" | "SPEND" | "REFUND" | "EXPIRE";
}

export interface PointSummaryDTO {
  total_points: number;
  available_points?: number;
  current_tier: string;
  next_tier?: string;
  points_to_next_tier?: number;
}
