"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useProducts, softDeleteProducts, restoreProducts, PRODUCT_API_ENDPOINT } from "@/src/services/admin/product.service";
import { mutate as globalMutate } from "swr";
import { RotateCcw, Edit, UserSquare2, Eye, Trash2 } from "lucide-react";
import EditProductModal from "./EditProductModal";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface ProductTableProps {
  isPending?: boolean;
}

export default function ProductTable({ isPending }: ProductTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Single-row confirm state
  const [confirmSingle, setConfirmSingle] = useState<{ open: boolean; record: any | null }>({ open: false, record: null });
  // Bulk confirm state
  const [confirmBulk, setConfirmBulk] = useState(false);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 6);

  const isHiddenTab = searchParams.get("status") === "hidden";

  const filters = {
    searchTerm: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "all",
    brandId: searchParams.get("brandId") || "all",
    status: isHiddenTab ? "hidden" : (searchParams.get("status") || "active_tab"),
    soldRange: searchParams.get("soldRange") || "all",
    sortBy: searchParams.get("sortBy") || "newest",
  };

  const { products, total, isLoading, mutate: refetch } = useProducts(page, pageSize, filters);

  const handleSingleAction = async () => {
    if (!confirmSingle.record) return;
    setIsDeleting(true);
    try {
      if (isHiddenTab) {
        await restoreProducts([confirmSingle.record.id]);
        showNotificationSuccess(`Đã khôi phục sản phẩm "${confirmSingle.record.name}"`);
      } else {
        await softDeleteProducts([confirmSingle.record.id]);
        showNotificationSuccess(`Đã ẩn sản phẩm "${confirmSingle.record.name}"`);
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
        await restoreProducts(selectedRowKeys);
        showNotificationSuccess(`Đã khôi phục ${selectedRowKeys.length} sản phẩm thành công`);
      } else {
        await softDeleteProducts(selectedRowKeys);
        showNotificationSuccess(`Đã ẩn ${selectedRowKeys.length} sản phẩm thành công`);
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

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
            {record.image ? (
              <img src={record.image} alt={text} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <UserSquare2 size={20} className="text-slate-400" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{text}</div>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">{record.category}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text: string) => <div className="text-slate-600 font-medium text-sm">{text}</div>,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (brand: string) => <div className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{brand || "N/A"}</div>,
    },
    {
      title: "Tổng đã bán",
      dataIndex: "sold",
      key: "sold",
      render: (sold: number) => <div className="text-sm font-bold text-sky-600 dark:text-sky-400">{sold || 0}</div>,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, { label: string; color: string; dot: string }> = {
          ACTIVE: {
            label: "Đang kinh doanh",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30",
            dot: "bg-emerald-500",
          },
          HIDDEN: {
            label: "Đang ẩn",
            color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400",
            dot: "bg-amber-500",
          },
          STOPPED: {
            label: "Hết hàng",
            color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500",
            dot: "bg-red-500",
          },
        };

        const config = statusMap[status] || {
          label: status,
          color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700",
          dot: "bg-slate-500",
        };

        return (
          <div className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 w-max shadow-sm ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`} />
            {config.label}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTTooltip title="Xem chi tiết" color="#3b82f6">
            <Link href={`/admin/products/${record.id}`}>
              <button className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 cursor-pointer">
                <Eye size={18} />
              </button>
            </Link>
          </SWTTooltip>
          <SWTTooltip title="Chỉnh sửa" color="#ec4899">
            <button
              onClick={() => setEditProductId(record.id)}
              className="text-fuchsia-600 hover:text-fuchsia-800 transition-colors p-1.5 rounded-lg hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 border border-transparent hover:border-fuchsia-100 dark:hover:border-fuchsia-500/20 cursor-pointer"
            >
              <Edit size={18} />
            </button>
          </SWTTooltip>
          <SWTTooltip title={isHiddenTab ? "Khôi phục" : "Ẩn sản phẩm"} color={isHiddenTab ? "#10b981" : "#f59e0b"}>
            <button
              onClick={() => setConfirmSingle({ open: true, record })}
              className={`${isHiddenTab ? "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-100 dark:hover:border-emerald-500/20" : "text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-100 dark:hover:border-amber-500/20"} transition-colors p-1.5 rounded-lg border border-transparent cursor-pointer`}
            >
              {isHiddenTab ? <RotateCcw size={18} /> : <Trash2 size={18} />}
            </button>
          </SWTTooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading || isPending}
          rowSelection={{
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (keys: any) => setSelectedRowKeys(keys),
          }}
          pagination={{
            totalCount: total,
            page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", p.toString());
              params.set("pageSize", f.toString());
              router.replace(`${pathname}?${params.toString()}`);
            },
          }}
        />
      </div>

      {/* Bulk action bar */}
      {selectedRowKeys.length > 0 && (
        <div className="flex items-center gap-3 mt-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-xl">
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex-1">
            Đã chọn {selectedRowKeys.length} sản phẩm
          </span>
          <SWTTooltip title={isHiddenTab ? "Khôi phục các sản phẩm đã chọn" : "Ẩn các sản phẩm đã chọn"} color={isHiddenTab ? "#10b981" : "#f59e0b"} placement="top">
            <button
              onClick={() => setConfirmBulk(true)}
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg ${isHiddenTab ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40" : "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-400 border-amber-200 dark:border-amber-500/40"} transition-colors cursor-pointer border`}
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

      {/* Single action confirm */}
      <SWTConfirmModal
        open={confirmSingle.open}
        variant={isHiddenTab ? "info" : "warning"}
        title={isHiddenTab ? "Khôi phục sản phẩm?" : "Ẩn sản phẩm này?"}
        description={isHiddenTab 
          ? `Sản phẩm "${confirmSingle.record?.name}" sẽ được hiển thị lại trên cửa hàng.`
          : `Sản phẩm "${confirmSingle.record?.name}" sẽ bị ẩn khỏi cửa hàng. Bạn có thể khôi phục lại sau.`
        }
        confirmText={isHiddenTab ? "Khôi phục" : "Ẩn sản phẩm"}
        cancelText="Hủy"
        loading={isDeleting}
        onConfirm={handleSingleAction}
        onCancel={() => setConfirmSingle({ open: false, record: null })}
      />

      {/* Bulk action confirm */}
      <SWTConfirmModal
        open={confirmBulk}
        variant={isHiddenTab ? "info" : "danger"}
        title={isHiddenTab ? `Khôi phục ${selectedRowKeys.length} sản phẩm?` : `Ẩn ${selectedRowKeys.length} sản phẩm?`}
        description={isHiddenTab 
          ? "Các sản phẩm đã chọn sẽ được hiển thị lại trên cửa hàng."
          : "Các sản phẩm đã chọn sẽ bị ẩn khỏi cửa hàng. Bạn có thể khôi phục lại sau."
        }
        confirmText={isHiddenTab ? "Khôi phục tất cả" : "Ẩn tất cả"}
        cancelText="Hủy"
        loading={isDeleting}
        onConfirm={handleBulkAction}
        onCancel={() => setConfirmBulk(false)}
      />

      {/* Edit Modal */}
      <EditProductModal
        isOpen={!!editProductId}
        onClose={() => setEditProductId(null)}
        productId={editProductId}
        onUpdated={() => {
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
