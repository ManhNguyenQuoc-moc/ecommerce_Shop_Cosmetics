import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { RecentOrderDTO } from "@/src/services/admin/dashboard/models/output.model";

interface RecentOrdersListProps {
  orders?: RecentOrderDTO[];
  loading?: boolean;
}

const columns = [
  {
    title: 'Mã ĐH',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <div className="font-bold text-slate-800 text-[12px] whitespace-nowrap">{text}</div>,
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'product',
    key: 'product',
    render: (text: string, record: RecentOrderDTO) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-pink-400 font-bold border border-slate-300 dark:border-pink-500/30 text-[10px]">
            {record.customer?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-slate-800 dark:text-white truncate max-w-[150px] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)] text-[12px]">{record.customer}</div>
            <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{record.product}</div>
          </div>
        </div>
    )
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'formattedAmount',
    key: 'formattedAmount',
    render: (text: string) => <div className="font-bold text-brand-600 text-[12px] whitespace-nowrap">{text}</div>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorClass = status.includes("đi") || status === "Đã giao" ? "bg-green-100 text-green-700" : 
                         status.includes("xử lý") ? "bg-amber-100 text-amber-700" : 
                         "bg-slate-100 text-slate-600";
      return (
        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block whitespace-nowrap ${colorClass}`}>
          {status}
        </div>
      );
    }
  },
];

export default function RecentOrdersList({ orders = [], loading = false }: RecentOrdersListProps) {
  return (
    <div className="h-full">
      <SWTCard className="!shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] !border !border-slate-100 dark:!border-cyan-500/20 !rounded-2xl h-full flex flex-col !bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl relative !overflow-hidden transition-colors" bodyClassName="!p-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/50 dark:bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />
        <div className="p-4 border-b border-slate-200 dark:border-cyan-500/20 relative z-10 flex items-center justify-between">
          <h3 className="!mb-0 text-base font-black text-slate-800 dark:text-white tracking-wide uppercase dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Đơn Hàng Gần Đây</h3>
          <button className="text-xs font-medium text-brand-600 hover:text-brand-700 transition">Xem tất cả</button>
        </div>
        <div className="p-1 overflow-x-auto">
          <SWTTable 
            columns={columns} 
            dataSource={orders} 
            rowKey="id" 
            className="min-w-[400px]" 
            loading={loading}
            pagination={false}
          />
        </div>
      </SWTCard>
    </div>
  );
}
