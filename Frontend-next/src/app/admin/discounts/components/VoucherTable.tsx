"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import React, { useMemo, useState } from "react";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGetVouchers, useDeleteVoucher } from "@/src/services/admin/user/voucher.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { Dropdown, Tag } from "antd";
import type { MenuProps } from "antd";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";

interface VoucherTableProps {
  onEdit?: (voucher: VoucherResponseDto) => void;
}

export default function VoucherTable({ onEdit }: VoucherTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; record: VoucherResponseDto | null }>({ open: false, record: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 6);
  const searchTerm = searchParams.get("search") || "";
  const statusVal = searchParams.get("status") || "";

  const { vouchers, total, isLoading, mutate } = useGetVouchers(page, pageSize, { search: searchTerm, status: statusVal });
  const { trigger: deleteVoucher } = useDeleteVoucher();

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.record) return;
    setIsDeleting(true);
    try {
      await deleteVoucher(deleteConfirm.record.id);
      showNotificationSuccess(`Xóa Voucher "${deleteConfirm.record.program_name}" thành công!`);
      mutate();
    } catch (error: unknown) {
      const err = error as { message?: string };
      showNotificationError(err?.message || "Xóa Voucher thất bại");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ open: false, record: null });
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Mã Voucher',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <div className="font-bold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md inline-block dark:bg-brand-900/40 dark:border-brand-500/30 text-xs">{text}</div>,
    },
    {
      title: 'Tên Voucher',
      dataIndex: 'program_name',
      key: 'program_name',
      render: (text: string | null, record: VoucherResponseDto) => (
        <div className="flex flex-col">
          <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{text || 'N/A'}</div>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">{record.type === 'PERCENTAGE' ? 'Giảm theo %' : (record.type === 'FLAT_AMOUNT' ? 'Giảm số tiền' : 'Miễn phí vận chuyển')}</span>
          {record.point_cost && record.point_cost > 0 && <Tag color="blue" className="mt-1 w-max border-none font-bold">Đổi bằng {record.point_cost} điểm</Tag>}
        </div>
      ),
    },
    {
      title: 'Mức giảm',
      dataIndex: 'discount',
      key: 'discount',
      render: (val: number | undefined) => {
        if (val === undefined || val === null) return <div className="text-slate-400 text-sm">N/A</div>;
        return <div className="font-bold text-rose-500 text-sm">{val}</div>;
      },
    },
    {
      title: 'Đơn Tối thiểu',
      dataIndex: 'min_order_value',
      key: 'min_order_value',
      render: (val: number | undefined) => <div className="text-slate-600 font-medium text-sm">{val && val > 0 ? `${val}đ` : 'Không'}</div>,
    },
    {
      title: 'Lượt dùng',
      dataIndex: 'usage_limit',
      key: 'usage_limit',
      render: (val: number, record: VoucherResponseDto) => <div className="text-slate-500 text-sm font-medium">{record.used_count}/{val}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_: boolean, record: VoucherResponseDto) => {
        const now = new Date();
        const startDate = new Date(record.valid_from);
        const endDate = new Date(record.valid_until);
        
        let status = "Đang diễn ra";
        let colorClass = "bg-green-100 text-green-700 border-green-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30";

        // Kiểm tra hết lượt dùng trước tiên (có độ ưu tiên cao hơn)
        if (record.used_count >= record.usage_limit) {
          status = "Hết lượt";
          colorClass = "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30";
        } else if (now > endDate || !record.isActive) {
          status = "Hết hạn";
          colorClass = "bg-slate-100 text-slate-600 border-slate-200";
        } else if (now < startDate) {
          status = "Sắp diễn ra";
          colorClass = "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30";
        }

        return (
          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-block whitespace-nowrap ${colorClass}`}>
            {status}
          </div>
        );
      }
    },
    {
      title: 'Hạn dùng',
      dataIndex: 'valid_until',
      key: 'valid_until',
      render: (date: string | Date | undefined) => <div className="text-slate-500 text-xs whitespace-nowrap">{date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}</div>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      render: (_: unknown, record: VoucherResponseDto) => {
        const actionItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-amber-600">
                <Edit size={16} />
                <span>Chỉnh sửa</span>
              </div>
            ),
            onClick: () => onEdit?.(record)
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-red-600">
                <Trash2 size={16} />
                <span>Xóa Voucher</span>
              </div>
            ),
            onClick: () => setDeleteConfirm({ open: true, record })
          }
        ];

        return (
          <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
            <SWTIconButton
              variant="custom"
              icon={<MoreVertical size={18} />}
              className="text-slate-500 hover:text-brand-600 border-transparent hover:border-brand-500/30"
            />
          </Dropdown>
        );
      }
    }
  ], [onEdit, setDeleteConfirm]);

  return (
    <div className="w-full mt-2">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-sm transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={vouchers} 
          rowKey="id" 
          loading={isLoading}
          pagination={{
            totalCount: total,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              const params = new URLSearchParams(searchParams.toString());
              // If pageSize changed, reset to page 1
              if (f !== pageSize) {
                params.set("page", "1");
              } else {
                params.set("page", p.toString());
              }
              params.set("pageSize", f.toString());
              router.replace(`${pathname}?${params.toString()}`);
            }
          }}
        />
      </div>

      <SWTConfirmModal
        open={deleteConfirm.open}
        variant="danger"
        title="Xóa Voucher?"
        description={`Bạn có chắc chắn muốn xóa voucher "${deleteConfirm.record?.program_name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, record: null })}
      />
    </div>
  );
}
