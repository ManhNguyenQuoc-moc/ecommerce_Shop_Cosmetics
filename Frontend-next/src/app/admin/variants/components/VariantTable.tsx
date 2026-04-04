"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTStatusTag from "@/src/@core/component/SWTStatusTag";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { softDeleteVariants, restoreVariants, PRODUCT_API_ENDPOINT } from "@/src/services/admin/product.service";
import { mutate as globalMutate } from "swr";
import { RotateCcw, Layers, Edit, Eye, Trash2 } from "lucide-react";
import EditVariantModal from "./EditVariantModal";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { ProductVariantDto} from "@/src/services/models/product/output.dto";
import { AlertCircle } from "lucide-react";
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
  const hasHiddenSelected = isHiddenTab && selectedRowKeys.some(key => {
    const variant = variants.find(v => v.id === key);
    return variant?.productStatus === 'HIDDEN';
  });

  const formatVND = (v: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const columns = [
    {
      title: "Biến thể",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TableRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden relative">
          {record.image ? (
            <Image
              src={record.image}
              alt={text}
              fill
              className="object-cover"
              sizes="40px"
              unoptimized
            />
          ) : (
            <Layers size={20} className="text-slate-400" />
          )}
        </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
              {record.productName} - {record.color || "Không màu"} - {record.size || "Không kích thước"}
            </div>
            <div className="flex items-center gap-2">
               <span className="text-slate-500 dark:text-slate-400 font-medium text-xs"></span>
              {record.productStatus === 'HIDDEN' && (
             <SWTTooltip
                  title="Sản phẩm gốc đang bị ẩn"
                  placement="top"
                  color="#f59e0b"
                >
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertCircle size={16} />
                  </span>
              </SWTTooltip>
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
      render: (statusName: string) => <SWTStatusTag status={statusName} />,
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: TableRecord) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTIconButton
            variant="view"
            icon={<Eye size={18} />}
            tooltip="Xem chi tiết"
            href={`/admin/variants/${record.id}`}
          />
          <SWTIconButton
            variant="edit"
            icon={<Edit size={18} />}
            tooltip="Chỉnh sửa"
            onClick={() => handleEdit(record)}
          />
          {isHiddenTab && record.productStatus === 'HIDDEN' ? (
            <SWTIconButton
              variant="disabled"
              icon={<RotateCcw size={18} />}
              tooltip="Cần khôi phục Sản phẩm gốc trước khi khôi phục biến thể"
              tooltipColor="#f59e0b"
            />
          ) : (
            <SWTIconButton
              variant={isHiddenTab ? "restore" : "hide"}
              icon={isHiddenTab ? <RotateCcw size={18} /> : <Trash2 size={18} />}
              tooltip={isHiddenTab ? "Khôi phục" : "Ẩn biến thể"}
              onClick={() => setConfirmSingle({ open: true, record })}
            />
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
          <SWTTooltip
            title={
              hasHiddenSelected
                ? "Có biến thể có sản phẩm gốc bị ẩn. Vui lòng bỏ chọn hoặc khôi phục SP gốc."
                : isHiddenTab
                ? "Khôi phục các biến thể đã chọn"
                : "Ẩn các biến thể đã chọn"
            }
            color={hasHiddenSelected ? "#f59e0b" : isHiddenTab ? "#10b981" : "#f59e0b"}
            placement="top"
          >
            <SWTButton
              onClick={() => setConfirmBulk(true)}
              disabled={isDeleting || hasHiddenSelected}
              className={`!w-auto !h-8 !px-3 !text-xs !font-semibold !rounded-lg ${
                hasHiddenSelected
                  ? "!bg-slate-100 !text-slate-400 !border-slate-200 !cursor-not-allowed"
                  : isHiddenTab
                  ? "!bg-emerald-100 hover:!bg-emerald-200 !text-emerald-700 dark:!bg-emerald-500/20 dark:hover:!bg-emerald-500/30 dark:!text-emerald-400 !border-emerald-200 dark:!border-emerald-500/40"
                  : "!bg-amber-100 hover:!bg-amber-200 !text-amber-700 dark:!bg-amber-500/20 dark:hover:!bg-amber-500/30 dark:!text-amber-400 !border-amber-200 dark:!border-amber-500/40"
              } transition-colors`}
              startIcon={isHiddenTab ? <RotateCcw size={14} /> : <Trash2 size={14} />}
              size="sm"
            >
              {isHiddenTab ? "Khôi phục" : "Ẩn"}
            </SWTButton>
          </SWTTooltip>
          <SWTTooltip title="Bỏ chọn tất cả" placement="top">
            <SWTButton
              onClick={() => setSelectedRowKeys([])}
              className="!w-auto !h-8 !px-3 !text-xs !font-semibold !rounded-lg !bg-slate-100 hover:!bg-slate-200 !text-slate-600 dark:!bg-slate-800 dark:hover:!bg-slate-700 dark:!text-slate-400 !border !border-slate-200 dark:!border-slate-700 transition-colors"
              size="sm"
            >
              Bỏ chọn
            </SWTButton>
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
