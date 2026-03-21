import { PointLogDTO, PointSummaryDTO } from "../models/customer/point.dto";

const MOCK_POINTS: PointLogDTO[] = [
  {
    id: "1",
    amount: 100,
    reason: "Hoàn thành đơn hàng ORD-20240321-001",
    created_at: "2024-03-21T10:00:00Z",
    type: "EARN",
  },
  {
    id: "2",
    amount: -50,
    reason: "Sử dụng điểm cho đơn hàng ORD-20240320-099",
    created_at: "2024-03-20T16:00:00Z",
    type: "SPEND",
  },
  {
    id: "3",
    amount: 200,
    reason: "Thưởng sinh nhật khách hàng",
    created_at: "2024-03-10T00:00:00Z",
    type: "EARN",
  }
];

export const getPointsSummary = async (): Promise<PointSummaryDTO> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    total_points: 1250,
    current_tier: "Vàng",
    next_tier: "Kim cương",
    points_to_next_tier: 750,
  };
};

export const getPointsHistory = async (): Promise<PointLogDTO[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_POINTS;
};
