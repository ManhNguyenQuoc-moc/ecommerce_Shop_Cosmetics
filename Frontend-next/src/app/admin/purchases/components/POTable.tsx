"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Truck, CheckCircle2, PackageCheck, Eye, FileText, FileDown } from "lucide-react";
import { useState } from "react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { usePurchaseOrders, getPurchaseOrderById, useConfirmPurchaseOrder } from "@/src/services/admin/purchase.service";
import { exportPOTopdf, exportPOToExcel } from "@/src/utils/exportPO";
import { showNotificationError, showNotificationInfo, showNotificationSuccess, showNotificationWarning } from "@/src/@core/utils/message";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import PODetailModal from "./PODetailModal";
import ReceiveStockModal from "./ReceiveStockModal";

export default function POTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewId, setViewId] = useState<string | null>(null);
  const [receiveId, setReceiveId] = useState<string | null>(null);
  const { orders, total, isLoading, mutate } = usePurchaseOrders(page, pageSize);

  const handleExport = async (type: "pdf" | "excel", id: string) => {
    try {
      showNotificationInfo("Đang tải dữ liệu...", { key: "exportPO" });
      const res = await getPurchaseOrderById(id) as any;
      
      if (res) {
        if (type === "pdf") {
          exportPOTopdf(res);
          showNotificationSuccess("Xuất PDF thành công!", { key: "exportPO" });
        } else {
          exportPOToExcel(res);
          showNotificationSuccess("Xuất Excel thành công!", { key: "exportPO" });
        }
      } else {
        showNotificationError("Không tìm thấy dữ liệu PO", { key: "exportPO" });
      }
    } catch (e) {
      console.error(e);
      showNotificationError("Lỗi kết nối khi tải phiếu xuất", { key: "exportPO" });
    }
  };

  const { trigger: submitConfirm } = useConfirmPurchaseOrder();

  const handleConfirm = async (id: string) => {
    try {
      showNotificationInfo("Đang duyệt phiếu nhập...", { key: "confirmPO" });
      const res = await submitConfirm(id);
      if (res) {
        showNotificationSuccess("Đã duyệt phiếu nhập thành công!", { key: "confirmPO" });
        mutate();
      }
    } catch (e: any) {
      console.error(e);
      showNotificationError("Lỗi kết nối khi duyệt phiếu nhập", { key: "confirmPO" });
    }
  };

  const columns = [
    {
      title: 'Mã PO',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <div className="font-bold text-blue-600 dark:text-blue-400">{text}</div>,
    },
    {
      title: 'Nhà Cung Cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (_: any, record: any) => <div className="font-semibold text-slate-700 dark:text-slate-300">{record.supplier?.name || "N/A"}</div>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <div className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr: string) => <div>{new Date(dateStr).toLocaleDateString("vi-VN")}</div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let colorClass = "";
        let Title = status;
        if (status === "DRAFT") colorClass = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
        if (status === "CONFIRMED" || status === "APPROVED") { colorClass = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400"; Title = "Đã duyệt"; }
        if (status === "PARTIALLY_RECEIVED") { colorClass = "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400"; Title = "Nhận một phần"; }
        if (status === "COMPLETED") { colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400"; Title = "Hoàn tất"; }
        
        return (
          <div className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
            {Title}
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="flex gap-2 items-center">
          {record.status === "DRAFT" && (
            <SWTTooltip title="Duyệt Phiếu Nhập">
              <div 
                className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:scale-105 hover:bg-blue-100 hover:shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                onClick={() => handleConfirm(record.id)}
              >
                <CheckCircle2 size={16} />
              </div>
            </SWTTooltip>
          )}

          {(record.status === "CONFIRMED" || record.status === "APPROVED" || record.status === "PARTIALLY_RECEIVED") && (
            <SWTTooltip title="Nhập Kho Cập Nhật Lot">
              <div 
                className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition-all hover:scale-105 hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                onClick={() => setReceiveId(record.id)}
              >
                <PackageCheck size={16} />
              </div>
            </SWTTooltip>
          )}

          <SWTTooltip title="Xem Chi Tiết">
            <div 
              className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:scale-105 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              onClick={() => setViewId(record.id)}
            >
              <Eye size={16} />
            </div>
          </SWTTooltip>

          {(record.status === "CONFIRMED" || record.status === "APPROVED" || record.status === "PARTIALLY_RECEIVED" || record.status === "COMPLETED") && (
            <>
              <SWTTooltip title="Xuất PDF">
                <div 
                  className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all hover:scale-105 hover:bg-red-100 hover:shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  onClick={() => handleExport("pdf", record.id)}
                >
                  <FileText size={16} />
                </div>
              </SWTTooltip>
              <SWTTooltip title="Xuất Excel">
                <div 
                  className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-600 transition-all hover:scale-105 hover:bg-green-100 hover:shadow-sm dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                  onClick={() => handleExport("excel", record.id)}
                >
                  <FileDown size={16} />
                </div>
              </SWTTooltip>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-blue-500/20 !shadow-lg mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={orders} 
          rowKey="id" 
          loading={isLoading}
          pagination={{
            totalCount: total,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              setPage(p);
              setPageSize(f);
            }
          }}
        />
      </div>
      <PODetailModal isOpen={!!viewId} onClose={() => setViewId(null)} poId={viewId} />
      <ReceiveStockModal isOpen={!!receiveId} onClose={() => setReceiveId(null)} poId={receiveId} onSuccess={() => mutate()} />
    </div>
  );
}
