"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTStatusTag from "@/src/@core/component/SWTStatusTag";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useSearchParams } from "next/navigation";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { softDeleteVariants, restoreVariants, PRODUCT_API_ENDPOINT } from "@/src/services/admin/product/product.service";
import { mutate as globalMutate } from "swr";
import { RotateCcw, Layers, Edit, Eye, Trash2, AlertCircle, MoreVertical } from "lucide-react";
import EditVariantModal from "./EditVariantModal";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { ProductVariantDto } from "@/src/services/models/product/output.dto";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

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


  const dataSource: TableRecord[] = useMemo(() => variants.map((v) => ({ ...v, onEdit: handleEdit })), [variants]);
  const hasHiddenSelected = useMemo(() => isHiddenTab && selectedRowKeys.some(key => {
    const variant = variants.find(v => v.id === key);
    return variant?.productStatus === 'HIDDEN';
  }), [isHiddenTab, selectedRowKeys, variants]);

  const formatVND = (v: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const columns = useMemo(() => [
    {
      title: "Biến thể",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TableRecord) => (
        <div className="flex items-center gap-3">
          <div className="admin-image-placeholder w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
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
            <Layers size={20} className="text-text-muted" />
          )}
        </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-text-main">
              {record.color || "Không màu"} - {record.size || "Không kích thước"}
            </div>
            <div className="flex items-center gap-2">
               <span className="text-text-muted font-medium text-xs"></span>
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
        <div className="font-medium text-sm text-text-muted line-through opacity-60">
          {formatVND(price)}
        </div>
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice: number, record: TableRecord) => (
        <div className="font-bold text-sm text-status-error-text">
          {formatVND(salePrice || record.price)}
        </div>
      ),
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      render: (sold: number) => (
        <div className="text-sm font-bold text-status-info-text">{sold || 0}</div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="text-xs font-medium text-text-muted">
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
      render: (_: unknown, record: TableRecord) => {
        const isDisabledRestore = isHiddenTab && record.productStatus === 'HIDDEN';
        const actionItems: MenuProps['items'] = [
          {
            key: 'view',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-blue-500">
                <Eye size={16} />
                <span>Xem chi tiết</span>
              </div>
            ),
            onClick: () => window.location.href = `/admin/variants/${record.id}`
          },
          {
            key: 'edit',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-amber-600">
                <Edit size={16} />
                <span>Chỉnh sửa</span>
              </div>
            ),
            onClick: () => handleEdit(record)
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: (
              <div className={`flex items-center gap-2 font-medium px-1 py-1 ${isDisabledRestore ? 'text-gray-400 cursor-not-allowed' : isHiddenTab ? 'text-green-600' : 'text-red-600'}`}>
                {isHiddenTab ? <RotateCcw size={16} /> : <Trash2 size={16} />}
                <span>{isHiddenTab ? 'Khôi phục' : 'Ẩn biến thể'}</span>
              </div>
            ),
            onClick: () => {
              if (!isDisabledRestore) {
                setConfirmSingle({ open: true, record });
              }
            },
            disabled: isDisabledRestore
          }
        ];

        return (
          <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
            <SWTIconButton
              variant="custom"
              icon={<MoreVertical size={18} />}
              className="text-text-muted hover:text-brand-500 border-transparent hover:border-brand-500/30"
            />
          </Dropdown>
        );
      }
    },
  ], [isHiddenTab]);

  return (
    <div className="w-full">
      <div className="!bg-bg-card backdrop-blur-xl !rounded-xl overflow-hidden !border !border-border-default dark:!border-border-brand !shadow-lg mt-4 transition-colors">
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
        <div className="flex items-center gap-3 mt-4 px-4 py-3 bg-status-warning-bg border border-status-warning-border rounded-xl">
          <span className="text-sm font-semibold text-status-warning-text flex-1">
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
                  ? "!bg-bg-muted !text-text-muted !border-border-default !cursor-not-allowed"
                  : isHiddenTab
                  ? "!bg-status-success-bg hover:opacity-80 !text-status-success-text !border-status-success-border"
                  : "!bg-status-warning-bg hover:opacity-80 !text-status-warning-text !border-status-warning-border"
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
              className="!w-auto !h-8 !px-3 !text-xs !font-semibold !rounded-lg !bg-bg-muted hover:opacity-80 !text-text-sub !border !border-border-default transition-colors"
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
