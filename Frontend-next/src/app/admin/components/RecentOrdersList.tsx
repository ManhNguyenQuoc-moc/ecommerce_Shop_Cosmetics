import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTable from "@/src/@core/component/AntD/SWTTable";

const recentOrders = [
  { id: "#ORD-001", product: "Serum Phục Hồi Da", date: "22/10/2023", amount: "550.000đ", status: "Đã giao" },
  { id: "#ORD-002", product: "Kem Ngăn Ngừa Lão Hóa", date: "22/10/2023", amount: "1.250.000đ", status: "Đang xử lý" },
  { id: "#ORD-003", product: "Sữa Rửa Mặt Dịu Nhẹ", date: "21/10/2023", amount: "350.000đ", status: "Đã hủy" },
  { id: "#ORD-004", product: "Mặt Nạ Đất Sét", date: "20/10/2023", amount: "420.000đ", status: "Đã giao" },
  { id: "#ORD-005", product: "Toner Cân Bằng Ẩm", date: "19/10/2023", amount: "280.000đ", status: "Đã giao" },
];

const columns = [
  {
    title: 'Mã ĐH',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{text}</div>,
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'product',
    key: 'product',
    render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-pink-400 font-bold border border-slate-300 dark:border-pink-500/30">
            {record.customer.charAt(0)}
          </div>
          <div className="font-bold text-slate-800 dark:text-white truncate max-w-[150px] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{record.customer}</div>
        </div>
    )
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'amount',
    key: 'amount',
    render: (text: string) => <div className="font-bold text-brand-600 text-sm whitespace-nowrap">{text}</div>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorClass = status === "Đã giao" ? "bg-green-100 text-green-700" : 
                         status === "Đang xử lý" ? "bg-amber-100 text-amber-700" : 
                         "bg-slate-100 text-slate-600";
      return (
        <div className={`text-[11px] font-semibold px-2 py-1 rounded-md inline-block whitespace-nowrap ${colorClass}`}>
          {status}
        </div>
      );
    }
  },
];

export default function RecentOrdersList() {
  return (
    <div className="h-full">
      <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-cyan-500/20 !rounded-2xl h-full flex flex-col !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden transition-colors" bodyClassName="!p-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/50 dark:bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />
        <div className="p-5 border-b border-slate-200 dark:border-cyan-500/20 relative z-10 flex items-center justify-between">
          <h3 className="!mb-0 text-lg font-black text-slate-800 dark:text-white tracking-wide uppercase dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Đơn Hàng Gần Đây</h3>
          <button className="text-sm font-medium text-brand-600 hover:text-brand-700 transition">Xem tất cả</button>
        </div>
        <div className="p-2 overflow-x-auto">
          <SWTTable columns={columns} dataSource={recentOrders} rowKey="id" className="min-w-[400px]" />
        </div>
      </SWTCard>
    </div>
  );
}
