"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { UserCog, Ban, Unlock, MoreVertical } from "lucide-react";
import { useState } from "react";

const mockUsers = [
  { id: "USR-001", name: "Nguyễn Văn Admin", email: "admin@ccosmetics.vn", phone: "0901234567", role: "Super Admin", status: "Hoạt động", registered: "15/05/2023", avatar: "" },
  { id: "USR-002", name: "Trần Thị Manager", email: "manager@ccosmetics.vn", phone: "0912345678", role: "Quản lý", status: "Hoạt động", registered: "20/06/2023", avatar: "" },
  { id: "USR-003", name: "Lê Văn Customer", email: "customer1@gmail.com", phone: "0987654321", role: "Khách hàng", status: "Hoạt động", registered: "10/08/2023", avatar: "" },
  { id: "USR-004", name: "Phạm Thị Khách", email: "khachhang2@yahoo.com", phone: "0934567890", role: "Khách hàng", status: "Khóa", registered: "05/09/2023", avatar: "" },
  { id: "USR-005", name: "Hoàng Nhân Viên", email: "staff@ccosmetics.vn", phone: "0976543210", role: "Nhân viên", status: "Hoạt động", registered: "01/10/2023", avatar: "" },
  { id: "USR-006", name: "Kim Tiểu Bảo", email: "baokim@gmail.com", phone: "0981122334", role: "Khách hàng", status: "Hoạt động", registered: "12/11/2023", avatar: "" },
  { id: "USR-007", name: "Đinh Đại Lục", email: "lục.dinh@yahoo.com", phone: "0909988776", role: "Khách hàng", status: "Hoạt động", registered: "15/12/2023", avatar: "" },
  { id: "USR-008", name: "Vũ Mị Nương", email: "nuong.vu@ccosmetics.vn", phone: "0912233445", role: "Nhân viên", status: "Hoạt động", registered: "20/01/2024", avatar: "" },
];

const columns = [
  {
    title: 'Người dùng',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => (
      <div className="flex items-center gap-3">
        <SWTAvatar src={record.avatar} size={40} className="shrink-0 border-pink-500/50 shadow-[0_0_8px_rgba(255,0,128,0.3)]" />
              <div className="flex flex-col">
                <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{record.name}</div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{record.email}</span>
              </div>
      </div>
    ),
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
    render: (text: string) => <div className="text-slate-300 font-medium text-sm">{text}</div>,
  },
  {
    title: 'Vai trò',
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => {
      let colorClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      if (role === "Super Admin") colorClass = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-500/30 dark:shadow-[0_0_8px_rgba(168,85,247,0.2)]";
      else if (role === "Quản lý") colorClass = "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-400 dark:border-pink-500/30 dark:shadow-[0_0_8px_rgba(255,0,128,0.2)]";
      else if (role === "Nhân viên") colorClass = "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-400 dark:border-cyan-500/30 dark:shadow-[0_0_8px_rgba(0,240,255,0.2)]";
      else if (role === "Khách hàng") colorClass = "bg-brand-50 text-brand-600 border-brand-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

      return (
        <div className={`text-xs font-bold px-2.5 py-1 rounded-md border inline-block ${colorClass}`}>
          {role}
        </div>
      );
    }
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorClass = status === "Hoạt động" 
        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
        : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30 dark:shadow-[0_0_8px_rgba(239,68,68,0.2)]";
      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === "Hoạt động" ? "bg-emerald-500 dark:bg-emerald-400 dark:shadow-[0_0_5px_#34d399]" : "bg-red-500 dark:shadow-[0_0_5px_#ef4444]"}`} />
          {status}
        </div>
      );
    }
  },
  {
    title: 'Ngày ĐK',
    dataIndex: 'registered',
    key: 'registered',
    render: (text: string) => <div className="text-slate-400 text-sm">{text}</div>,
  },
  {
    title: '',
    key: 'actions',
    render: (_: any, record: any) => {
      const isBanned = record.status === "Khóa";
      const actionItems: MenuProps['items'] = [
        {
          key: 'assign',
          label: (
            <div className="flex items-center gap-2 text-pink-500 font-medium px-2 py-1 hover:text-pink-400">
              <UserCog size={16} />
              <span>Phân quyền</span>
            </div>
          ),
        },
        { type: 'divider' },
        {
          key: 'ban',
          label: (
            <div className={`flex items-center gap-2 font-medium px-2 py-1 ${isBanned ? 'text-emerald-500 hover:text-emerald-400' : 'text-red-500 hover:text-red-400'}`}>
              {isBanned ? <Unlock size={16} /> : <Ban size={16} />}
              <span>{isBanned ? 'Mở Khóa User' : 'Khóa User'}</span>
            </div>
          ),
        }
      ];

      return (
        <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
          <button className="text-slate-400 hover:text-pink-400 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-pink-500/30">
            <MoreVertical size={18} />
          </button>
        </Dropdown>
      );
    }
  }
];
export default function UserTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="overflow-hidden !border !border-pink-500/20 !rounded-2xl !bg-slate-900/50 backdrop-blur-xl !shadow-sm overflow-x-auto cyber-table-wrapper">
      <SWTTable 
        columns={columns} 
        dataSource={paginatedData} 
        rowKey="id" 
        className="min-w-[700px] !bg-transparent" 
        pagination={{
            totalCount: mockUsers.length,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              setPage(p);
              setPageSize(f);
            }
        }}
      />
    </div>
  );
}
