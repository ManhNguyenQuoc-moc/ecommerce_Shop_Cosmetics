import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import { TicketPercent, Clock, CircleDot, PlayCircle } from "lucide-react";
import { useState } from "react";

const campaigns = [
  {
    id: "CPN-001",
    name: "Siêu Sale Black Friday",
    discount: "Giảm 50% Tối đa 200k",
    usage: "1,245 / 5000",
    status: "Đang diễn ra",
    endDate: "30/11/2023"
  },
  {
    id: "CPN-002",
    name: "Tri Ân Khách Hàng VIP",
    discount: "Giảm 30% Đơn từ 1M",
    usage: "450 / 1000",
    status: "Đang diễn ra",
    endDate: "31/12/2023"
  },
  {
    id: "CPN-003",
    name: "Mừng Giáng Sinh",
    discount: "Freeship Đơn từ 500k",
    usage: "0 / 2000",
    status: "Sắp tới",
    endDate: "25/12/2023"
  },
];

export default function DiscountCampaignCards() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const paginatedCampaigns = campaigns.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCampaigns.map((item) => { // Changed 'camp' to 'item' to match the provided snippet
          const isActive = item.status === "Đang diễn ra"; // Changed 'camp' to 'item'

        return (
          <SWTCard key={item.id} className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !border !border-slate-100 dark:!border-brand-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !rounded-2xl relative overflow-hidden group transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200/50 dark:bg-brand-500/10 blur-[30px] rounded-full pointer-events-none group-hover:bg-brand-300/50 dark:group-hover:bg-brand-500/20 transition-all duration-500 transform group-hover:scale-110" />
            
            <div className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-slate-800 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center text-brand-500 dark:text-brand-400 font-bold mb-4 shadow-sm dark:shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]">
                <span className="text-xl">%</span>
              </div>
              
              <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1 dark:drop-shadow-sm group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">{item.name}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{item.discount}</p>
              
              <div className="mt-auto space-y-3 pt-4 border-t border-slate-200 dark:border-brand-500/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Đã dùng:</span>
                  <span className="font-black text-brand-600 dark:text-brand-400">{item.usage}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${(parseInt(item.usage.replace(/,/g, '')) / parseInt(item.usage.split(' / ')[1])) * 100}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Trạng thái:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isActive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 shadow-sm dark:shadow-[0_0_10px_currentColor]" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                  <Clock size={16} className="text-slate-400" />
                  Hết hạn: <span className="font-bold text-slate-700 dark:text-slate-300">{item.endDate}</span>
                </div>
              </div>
              
              <SWTButton className="!h-10 !text-sm w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-brand-500/30 mt-6">
                Chi tiết chiến dịch
              </SWTButton>
            </div>
          </SWTCard>
        );
      })}
      </div>
      
      {campaigns.length > 0 && (
        <div className="flex justify-end mt-4">
          <SWTPagination
             total={campaigns.length}
             current={page}
             pageSize={pageSize}
             onChange={(p, f) => {
               setPage(p);
               setPageSize(f);
             }}
          />
        </div>
      )}
    </div>
  );
}
