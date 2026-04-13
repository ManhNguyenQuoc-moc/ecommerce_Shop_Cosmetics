"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import React, { useState, useMemo } from "react";
import { Edit } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";

import { useGetVouchers, useDeleteVoucher } from "@/src/hooks/admin/voucher.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { Popconfirm, Tag } from "antd";
import { Trash } from "lucide-react";

interface VoucherTableProps {
  onEdit?: (voucher: VoucherResponseDto) => void;
}

export default function VoucherTable({ onEdit }: VoucherTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { vouchers, isLoading, mutate } = useGetVouchers();
  const { trigger: deleteVoucher } = useDeleteVoucher();

  const paginatedData = vouchers.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id: string) => {
    try {
      await deleteVoucher(id);
      showNotificationSuccess("Xóa Voucher thành công!");
      mutate();
    } catch (e: any) {
      showNotificationError(e.message || "Xóa Voucher thất bại");
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
      title: 'Tên Chương trình',
      dataIndex: 'program_name',
      key: 'program_name',
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{text}</div>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">{record.type === 'PERCENTAGE' ? 'Giảm theo %' : (record.type === 'FLAT_AMOUNT' ? 'Giảm số tiền' : 'N/A')}</span>
          {record.point_cost > 0 && <Tag color="blue" className="mt-1 w-max border-none font-bold">Đổi bằng {record.point_cost} điểm</Tag>}
        </div>
      ),
    },
    {
      title: 'Mức giảm',
      dataIndex: 'discount',
      key: 'discount',
      render: (val: number, record: any) => <div className="font-bold text-rose-500 text-sm">{record.type === 'PERCENTAGE' ? `${val}%` : `${val}đ`}</div>,
    },
    {
      title: 'Đơn Tối thiểu',
      dataIndex: 'min_order_value',
      key: 'min_order_value',
      render: (val: number) => <div className="text-slate-600 font-medium text-sm">{val > 0 ? `${val}đ` : 'Không'}</div>,
    },
    {
      title: 'Lượt dùng',
      dataIndex: 'usage_limit',
      key: 'usage_limit',
      render: (val: number, record: any) => <div className="text-slate-500 text-sm font-medium">{record.used_count}/{val}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: any) => {
        const now = new Date();
        const endDate = new Date(record.valid_until);
        const startDate = new Date(record.valid_from);
        
        let status = "Đang diễn ra";
        let colorClass = "bg-green-100 text-green-700 border-green-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30";

        if (!isActive) {
          status = "Đã khóa";
          colorClass = "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30";
        } else if (now < startDate) {
          status = "Sắp diễn ra";
          colorClass = "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30";
        } else if (now > endDate) {
          status = "Hết hạn";
          colorClass = "bg-slate-100 text-slate-600 border-slate-200";
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
      render: (date: string) => <div className="text-slate-500 text-xs whitespace-nowrap">{new Date(date).toLocaleDateString('vi-VN')}</div>,
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <SWTIconButton 
            variant="edit"
            icon={<Edit size={18} />}
            onClick={() => onEdit?.(record)}
            tooltip="Chỉnh sửa Voucher"
          />
          <Popconfirm
            title="Bạn có chắc chặn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <SWTIconButton
              variant="custom"
              icon={<Trash size={18} />}
              className="text-red-500 hover:text-red-700 border-transparent w-[34px] h-[34px]"
              tooltip="Xóa Voucher"
            />
          </Popconfirm>
        </div>
      )
    }
  ], [onEdit]);

  return (
    <div className="w-full mt-2">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-sm transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          loading={isLoading}
          pagination={{
            totalCount: vouchers.length,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              setPage(p);
              setPageSize(f);
            }
          }}
        />
      </div>
    </div>
  );
}
