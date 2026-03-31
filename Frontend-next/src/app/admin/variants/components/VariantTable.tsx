"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { softDeleteVariants, restoreVariants, PRODUCT_API_ENDPOINT } from "@/src/services/admin/product.service";
import { mutate as globalMutate } from "swr";
import { RotateCcw, Layers, Edit, Eye, Trash2 } from "lucide-react";
import EditVariantModal from "./EditVariantModal";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { ProductVariantDto } from "@/src/services/models/product/output.dto";

interface TableRecord extends ProductVariantDto {
  onEdit: (record: ProductVariantDto) => void;
  productStatus?: string;
}

interface VariantTableProps {
  variants: ProductVariantDto[];
  total: number;
  isLoading: boolean;
  isPending?: boolean;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  mutate: () => void;
}

export default function VariantTable({
  variants,
  total,
  isLoading,
  isPending,
  page,
  pageSize,
  onPaginationChange,
  mutate: refetch,
}: VariantTableProps) {
  console.log("VariantTable Data:", { variants, total });
  const [editingVariant, setEditingVariant] = useState<ProductVariantDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirm states
  const [confirmSingle, setConfirmSingle] = useState<{ open: boolean; record: ProductVariantDto | null }>({ open: false, record: null });
  const [confirmBulk, setConfirmBulk] = useState(false);

  const searchParams = useSearchParams();
  const isHiddenTab = searchParams.get("status") === "hidden";

  const handleEdit = (record: ProductVariantDto) => {
    setEditingVariant(record);
    setIsEditModalOpen(true);
  };

  const handleSingleAction = async () => {
    if (!confirmSingle.record) return;
    setIsDeleting(true);
    try {
      if (isHiddenTab) {
        await restoreVariants([confirmSingle.record.id]);
        showNotificationSuccess("Đã khôi phục biến thể thành công");
      } else {
        await softDeleteVariants([confirmSingle.record.id]);
        showNotificationSuccess("Đã ẩn biến thể thành công");
      }
      refetch();
      globalMutate(
        (key) => typeof key === "string" && key.startsWith(PRODUCT_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );
    } catch {
      showNotificationError("Có lỗi xảy ra");
    } finally {
      setIsDeleting(false);
      setConfirmSingle({ open: false, record: null });
    }
  };

  const handleBulkAction = async () => {
    setIsDeleting(true);
    try {
      if (isHiddenTab) {
        await restoreVariants(selectedRowKeys);
        showNotificationSuccess(`Đã khôi phục ${selectedRowKeys.length} biến thể thành công`);
      } else {
        await softDeleteVariants(selectedRowKeys);
        showNotificationSuccess(`Đã ẩn ${selectedRowKeys.length} biến thể thành công`);
      }
      setSelectedRowKeys([]);
      refetch();
      globalMutate(
        (key) => typeof key === "string" && key.startsWith(PRODUCT_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );
    } catch (err: any) {
      showNotificationError(err.message || "Có lỗi xảy ra");
    } finally {
      setIsDeleting(false);
      setConfirmBulk(false);
    }
  };


  const dataSource: TableRecord[] = variants.map((v) => ({ ...v, onEdit: handleEdit }));

const formatVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const columns = [
    {
      title: "Biến thể",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TableRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden">
            {record.image ? (
              <img src={record.image} alt={text} className="w-full h-full object-cover" />
            ) : (
              <Layers size={20} className="text-slate-400" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
              {record.name}
            </div>
            <div className="flex items-center gap-2">
               <span className="text-brand-500 dark:text-pink-400 font-bold text-xs">{record.category}</span>
               {record.productStatus === 'HIDDEN' && (
                 <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/30 font-bold uppercase tracking-tight">
                   Sản phẩm ẩn
                 </span>
               )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá niêm yết",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <div className="font-medium text-sm text-slate-400 line-through decoration-slate-300">
          {formatVND(price)}
        </div>
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice: number, record: TableRecord) => (
        <div className="font-bold text-sm text-rose-600 dark:text-rose-400">
          {formatVND(salePrice || record.price)}
        </div>
      ),
    },
    {
      title: "Đã bán",
      dataIndex: "soldCount",
      key: "soldCount",
      render: (soldCount: number) => (
        <div className="text-sm font-bold text-sky-600 dark:text-sky-400">{soldCount || 0}</div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Nhãn",
      dataIndex: "statusName",
      key: "statusName",
      render: (statusName: string) => {
        const map: Record<string, { label: string; cls: string; dot: string }> = {
          BEST_SELLING: {
            label: "Bán chạy",
            cls: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-500/30",
            dot: "bg-rose-500",
          },
          TRENDING: {
            label: "Xu hướng",
            cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-500/30",
            dot: "bg-blue-500",
          },
          NEW: {
            label: "Mới ra mắt",
            cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30",
            dot: "bg-emerald-500",
          },
        };
        const info = map[statusName] || {
          label: statusName || "N/A",
          cls: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700",
          dot: "bg-slate-500",
        };
        return (
          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-max ${info.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
            {info.label}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: TableRecord) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTTooltip title="Xem chi tiết" color="#3b82f6">
            <Link href={`/admin/variants/${record.id}`}>
              <button className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 cursor-pointer">
                <Eye size={18} />
              </button>
            </Link>
          </SWTTooltip>
          <SWTTooltip title="Chỉnh sửa" color="#ec4899">
            <button
              className="text-fuchsia-600 hover:text-fuchsia-800 transition-colors p-1.5 rounded-lg hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 border border-transparent hover:border-fuchsia-100 dark:hover:border-fuchsia-500/20 cursor-pointer"
              onClick={() => handleEdit(record)}
            >
              <Edit size={18} />
            </button>
          </SWTTooltip>
          {isHiddenTab && record.productStatus === 'HIDDEN' ? (
            <SWTTooltip title="Cần khôi phục Sản phẩm cha trước khi khôi phục biến thể" color="#f59e0b">
              <button
                className="text-slate-300 dark:text-slate-600 p-1.5 rounded-lg border border-transparent cursor-not-allowed"
                disabled
              >
                <RotateCcw size={18} />
              </button>
            </SWTTooltip>
          ) : (
            <SWTTooltip title={isHiddenTab ? "Khôi phục" : "Ẩn biến thể"} color={isHiddenTab ? "#10b981" : "#f59e0b"}>
              <button
                className={`${isHiddenTab ? "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-100 dark:hover:border-emerald-500/20" : "text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-100 dark:hover:border-amber-500/20"} transition-colors p-1.5 rounded-lg border border-transparent cursor-pointer`}
                onClick={() => setConfirmSingle({ open: true, record })}
              >
                {isHiddenTab ? <RotateCcw size={18} /> : <Trash2 size={18} />}
              </button>
            </SWTTooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={isLoading || isPending}
          rowSelection={{
            preserveSelectedRowKeys: true,
            onChange: (keys: any) => setSelectedRowKeys(keys),
          }}
          pagination={{
            totalCount: total,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              onPaginationChange(p, f);
            },
          }}
        />
      </div>

      {/* Bulk action bar - below table */}
      {selectedRowKeys.length > 0 && (
        <div className="flex items-center gap-3 mt-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-xl">
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex-1">
            Đã chọn {selectedRowKeys.length} biến thể
          </span>
          <SWTTooltip title={isHiddenTab ? "Khôi phục các biến thể đã chọn" : "Ẩn các biến thể đã chọn"} color={isHiddenTab ? "#10b981" : "#f59e0b"} placement="top">
            <button
              onClick={() => setConfirmBulk(true)}
              disabled={isDeleting}
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg ${isHiddenTab ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40" : "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-400 border-amber-200 dark:border-amber-500/40"} transition-colors disabled:opacity-60 cursor-pointer border`}
            >
              {isHiddenTab ? <RotateCcw size={14} /> : <Trash2 size={14} />}
              {isHiddenTab ? "Khôi phục" : "Ẩn"}
            </button>
          </SWTTooltip>
          <SWTTooltip title="Bỏ chọn tất cả" placement="top">
            <button
              onClick={() => setSelectedRowKeys([])}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
          </SWTTooltip>
        </div>
      )}

      <SWTConfirmModal
        open={confirmSingle.open}
        variant={isHiddenTab ? "info" : "warning"}
        title={isHiddenTab ? "Khôi phục biến thể?" : "Ẩn biến thể này?"}
        description={isHiddenTab 
          ? `Biến thể "${confirmSingle.record?.name}" sẽ được hiển thị lại trên cửa hàng.`
          : `Biến thể "${confirmSingle.record?.name}" sẽ bị ẩn khỏi cửa hàng. Bạn có thể khôi phục lại sau.`
        }
        confirmText={isHiddenTab ? "Khôi phục" : "Ẩn biến thể"}
        cancelText="Hủy"
        loading={isDeleting}
        onConfirm={handleSingleAction}
        onCancel={() => setConfirmSingle({ open: false, record: null })}
      />

      <SWTConfirmModal
        open={confirmBulk}
        variant={isHiddenTab ? "info" : "danger"}
        title={isHiddenTab ? `Khôi phục ${selectedRowKeys.length} biến thể?` : `Ẩn ${selectedRowKeys.length} biến thể?`}
        description={isHiddenTab 
          ? "Các biến thể đã chọn sẽ được hiển thị lại trên cửa hàng."
          : "Các biến thể đã chọn sẽ bị ẩn khỏi cửa hàng. Bạn có thể khôi phục lại sau."
        }
        confirmText={isHiddenTab ? "Khôi phục tất cả" : "Ẩn tất cả"}
        cancelText="Hủy"
        loading={isDeleting}
        onConfirm={handleBulkAction}
        onCancel={() => setConfirmBulk(false)}
      />

      <EditVariantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        variant={editingVariant}
        onUpdate={() => {
          refetch();
          globalMutate(
            (key) => typeof key === "string" && key.startsWith(PRODUCT_API_ENDPOINT),
            undefined,
            { revalidate: true }
          );
        }}
      />
    </div>
  );
}
