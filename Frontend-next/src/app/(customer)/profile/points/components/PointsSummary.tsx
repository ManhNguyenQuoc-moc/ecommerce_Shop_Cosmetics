import { Progress } from "antd";
import { StarFilled, GiftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { PointSummaryDTO } from "@/src/services/models/customer/point.dto";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

interface Props {
  summary: PointSummaryDTO;
}

export default function PointsSummary({ summary }: Props) {
  const percentToNext = summary.points_to_next_tier && summary.total_points > 0
    ? Math.min(100, (summary.total_points / (summary.total_points + summary.points_to_next_tier)) * 100)
    : 0;

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="md:col-span-2 bg-gradient-to-br from-brand-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-widest">Điểm tích luỹ hiện có</p>
              <h2 className="text-4xl font-bold mt-1 flex items-baseline gap-2">
                {summary.total_points.toLocaleString("vi-VN")}
                <span className="text-lg opacity-80">điểm</span>
              </h2>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-inner">
              <StarFilled className="text-amber-300 text-2xl" />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
              <span>Hạng: {summary.current_tier}</span>
              {summary.next_tier && <span>Hạng kế tếp: {summary.next_tier}</span>}
            </div>
            <Progress
              percent={percentToNext}
              showInfo={false}
              strokeColor="#ffffff"
              trailColor="rgba(255,255,255,0.2)"
              strokeWidth={8}
              className="!m-0"
            />
            {summary.points_to_next_tier && (
              <p className="text-[11px] text-white/90 mt-2 flex items-center gap-1.5 font-medium italic">
                <GiftOutlined />
                Cần thêm {summary.points_to_next_tier.toLocaleString("vi-VN")} điểm để thăng hạng {summary.next_tier}
              </p>
            )}
          </div>
        </div>
      </div>

      <SWTCard className="!border-none !shadow-sm !rounded-2xl" bodyClassName="!p-6 !flex !flex-col !justify-between !h-full">
        <div>
          <h3 className="text-gray-900 font-bold text-lg mb-3">Đổi quà ưu đãi</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Sử dụng điểm tích luỹ để đổi lấy các mã giảm giá và quà tặng hấp dẫn từ cửa hàng.
          </p>
        </div>
        <button className="w-full mt-4 flex items-center justify-between text-brand-500 font-bold text-sm bg-brand-50 px-4 py-3 rounded-xl transition-all group">
          Xem danh sách quà
          <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
        </button>
      </SWTCard>
    </div>

  );
}
