"use client";

import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { User, Settings, LogOut, CreditCard, ChevronDown, Package, Award, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";

export default function UserDropdown() {
  
  const router = useRouter();
  const { currentUser, logout, isUploadingAvatar } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!currentUser) {
    const guestMenu: MenuProps = {
      items: [
        {
          key: 'login',
          label: (
            <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/login')}>
              <User size={16} className="text-brand-500" />
              <span>Đăng nhập</span>
            </div>
          ),
        },
        {
          key: 'register',
          label: (
            <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/register')}>
              <User size={16} className="text-brand-500" />
              <span>Đăng ký</span>
            </div>
          ),
        }
      ]
    };

    return (
      <Dropdown menu={guestMenu} trigger={['click']} placement="bottomRight">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-brand-200/60 hover:border-brand-500/40 text-brand-900 hover:text-brand-600 transition-all cursor-pointer group shadow-sm shrink-0">
          <User className="group-hover:fill-brand-400/20 transition-colors" size={20} />
        </div>
      </Dropdown>
    );
  }

  const accountMenu: MenuProps = {
    items: [
      {
        key: 'profile',
        label: (
          <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/profile')}>
            <User size={16} className="text-brand-500" />
            <span>Hồ sơ cá nhân</span>
          </div>
        ),
      },
      {
        key: 'cart',
        label: (
          <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/cart')}>
            <CreditCard size={16} className="text-slate-500" />
            <span>Giỏ hàng</span>
          </div>
        ),
      },
      {
        key: 'orders',
        label: (
          <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/profile/orders')}>
            <Package size={16} className="text-slate-500" />
            <span>Lịch sử đơn hàng</span>
          </div>
        ),
      },
      {
        key: 'points',
        label: (
          <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/profile/points')}>
            <Award size={16} className="text-slate-500" />
            <span>Điểm thưởng</span>
          </div>
        ),
      },
      {
        key: 'vouchers',
        label: (
          <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/profile/vouchers')}>
            <Ticket size={16} className="text-slate-500" />
            <span>Mã giảm giá</span>
          </div>
        ),
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: (
          <div className="flex items-center gap-2 text-red-500 font-medium px-2 py-1 hover:text-red-600" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </div>
        ),
      },
    ],
  };

  return (
    <Dropdown menu={accountMenu} trigger={['click']} placement="bottomRight">
      <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-2 sm:pr-4 rounded-2xl bg-white hover:bg-brand-50 border border-brand-200/60 hover:border-brand-500/40 transition-all group shadow-sm shrink-0">
        <div className="relative">
          <SWTAvatar 
            size={36} 
            src={currentUser?.avatar} 
            className="border-brand-100 shadow-sm group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="hidden sm:flex flex-col items-start border-none">
          <span className="text-[10px] uppercase font-bold text-brand-600 tracking-widest mb-1">Khách hàng</span>
          <span className="text-sm font-bold text-brand-900 leading-none">{(currentUser as any)?.full_name || currentUser?.name || "Người dùng"}</span>
        </div>
        <ChevronDown size={16} className="text-brand-400 ml-1 group-hover:translate-y-0.5 transition-transform hidden sm:block" />
      </div>
    </Dropdown>
  );
}