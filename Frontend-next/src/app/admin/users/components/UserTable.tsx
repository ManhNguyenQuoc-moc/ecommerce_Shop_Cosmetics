"use client";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { Dropdown, type MenuProps } from "antd";
import { UserCog, Ban, Unlock, MoreVertical, Shield, Check, BadgeInfo } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { useMemo } from "react";
import { useUserModule } from "../provider";
import UserStatusTag from "@/src/enums/UserStatus";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";

export default function UserTable() {
  const { users, total, isLoading, pagination, handleToggleStatus, handleUpdateRole, handleUpdateAccountType, roles } = useUserModule();

  const columns = useMemo(() => [
    {
      title: 'Người dùng',
      dataIndex: 'full_name',
      key: 'name',
      render: (_: string, record: UserProfileDTO) => (
        <div className="flex items-center gap-3">
          <SWTAvatar src={record.avatar} size={40} className="shrink-0 border-brand-500/50 shadow-[0_0_8px_rgba(255,105,180,0.3)]" />
          <div className="flex flex-col">
            <div className="font-bold text-text-main">{record.full_name || "N/A"}</div>
            <span className="text-text-muted font-medium">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => <div className="text-text-sub font-medium text-sm">{text || "N/A"}</div>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let colorClass = "bg-bg-muted text-text-sub border-border-default";
        if (role === "ADMIN" || role === "INTERNAL") colorClass = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-500/30";
        else if (role === "STAFF") colorClass = "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-400 dark:border-cyan-500/30";
        else if (role === "CUSTOMER") colorClass = "bg-brand-500/10 text-brand-600 dark:text-brand-500 border-brand-500/20";
        return <div className={`text-[10px] font-black px-2 py-0.5 rounded border inline-block uppercase tracking-wider ${colorClass}`}>{role || "Customer"}</div>;
      }
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (accountType: string) => {
        const label = accountType === "INTERNAL" ? "Internal" : "Customer";
        const colorClass = accountType === "INTERNAL"
          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-500/30"
          : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-500/30";
        return <div className={`text-[10px] font-black px-2 py-0.5 rounded border inline-block uppercase tracking-wider ${colorClass}`}>{label}</div>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: "ACTIVE" | "BANNED") => (
        <UserStatusTag status={status} />
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: UserProfileDTO) => {
        const isBanned = record.status === "BANNED";
        const isInternal = record.accountType === "INTERNAL";
        const actionItems: MenuProps['items'] = [
          ...(isInternal
            ? [{
                key: 'assign',
                label: (
                  <div className="flex items-center gap-2 text-text-sub font-medium px-1 py-1">
                    <UserCog size={16} />
                    <span>Phân quyền</span>
                  </div>
                ),
                children: roles.map((role) => ({
                  key: `role-${role.id}`,
                  label: (
                    <div className="flex items-center justify-between gap-8 px-1 py-0.5">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-purple-500" />
                        <span>{role.name}</span>
                      </div>
                      {record.roleId === role.id && <Check size={14} className="text-brand-500" />}
                    </div>
                  ),
                  onClick: () => handleUpdateRole(record, role.id),
                  disabled: record.roleId === role.id
                }))
              }]
            : []),
          {
            key: 'account-type',
            label: (
              <div className="flex items-center justify-between gap-8 px-1 py-0.5">
                <div className="flex items-center gap-2">
                  <BadgeInfo size={14} className="text-amber-500" />
                  <span>Đổi account type</span>
                </div>
              </div>
            ),
            children: [
              {
                key: 'account-customer',
                label: <span>Customer</span>,
                onClick: () => handleUpdateAccountType(record, 'CUSTOMER'),
                disabled: record.accountType === 'CUSTOMER'
              },
              {
                key: 'account-internal',
                label: <span>Internal</span>,
                onClick: () => handleUpdateAccountType(record, 'INTERNAL'),
                disabled: record.accountType === 'INTERNAL'
              }
            ]
          },
          { type: 'divider' },
          { 
            key: 'toggle_status', 
            label: (
              <div className={`flex items-center gap-2 font-medium px-1 py-1 ${isBanned ? 'text-status-success-text' : 'text-status-error-text'}`} onClick={() => record.accountType !== 'INTERNAL' && handleToggleStatus(record)}>
                {isBanned ? <Unlock size={16} /> : <Ban size={16} />}
                <span>{isBanned ? 'Mở Khóa User' : 'Khóa User'}</span>
              </div>
            ),
            disabled: record.accountType === 'INTERNAL'
          }
        ];
        return (
          <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
            <SWTIconButton variant="custom" icon={<MoreVertical size={18} />} className="text-text-muted hover:text-brand-500 border-transparent hover:border-brand-500/30" />
          </Dropdown>
        );
      }
    }
  ], [handleToggleStatus, handleUpdateRole, handleUpdateAccountType, roles]);

  return (
    <div className="overflow-hidden border border-border-default dark:border-border-brand rounded-2xl bg-bg-card backdrop-blur-xl shadow-sm overflow-x-auto">
      <SWTTable
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isLoading}
        pagination={{
          totalCount: total,
          page: pagination.page,
          fetch: pagination.pageSize,
          onChange: (p: number, ps: number) => {
            pagination.setPage(p);
            if (ps !== pagination.pageSize) {
              pagination.setPageSize(ps);
            }
          }
        }}
      />
    </div>
  );
}