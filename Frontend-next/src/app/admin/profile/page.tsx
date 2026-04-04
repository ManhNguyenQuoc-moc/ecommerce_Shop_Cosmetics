"use client";

import { useAuth } from "@/src/context/AuthContext";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { Mail, Phone, MapPin, Calendar, Shield, Edit, User } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function AdminProfilePage() {
  useSWTTitle("Hồ Sơ Quản Trị Viên | Admin");
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Shield size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black text-brand-600 dark:text-admin-accent tracking-tight flex items-center gap-2">
              Hồ sơ Quản Trị Viên
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest mt-1">
            Thông tin cá nhân & Quyền truy cập
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 p-8 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border flex flex-col items-center text-center relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="relative group mt-4">
            <SWTAvatar 
              src={currentUser?.avatar || "https://avatars.githubusercontent.com/u/1?v=4"} 
              size={120} 
              className="border-4 border-white dark:border-slate-800 shadow-md transition-transform duration-500 group-hover:scale-105"
            />
            <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-800 text-brand-500 dark:text-admin-accent border border-slate-200 dark:border-admin-sidebar-border rounded-full hover:bg-brand-500 hover:text-white transition-all shadow-md cursor-pointer z-10">
              <Edit size={16} />
            </button>
          </div>

          <h3 className="mt-8 text-2xl font-bold text-slate-800 dark:text-white tracking-wide">{currentUser?.name || "Nguyễn Quản Trị"}</h3>
          <div className="mt-3 inline-flex items-center justify-center font-bold px-4 py-1.5 rounded-lg border text-xs bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-admin-accent dark:border-admin-sidebar-border">
            Super Admin
          </div>
          
          <div className="w-full h-px bg-slate-800 my-8" />
          
          <div className="w-full flex justify-between tracking-wide text-sm px-2">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Trạng thái hệ thống</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đang hoạt động
            </span>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 p-8 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border relative overflow-hidden transition-colors">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-500/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-wider">Thông tin chi tiết</h3>
            <SWTButton 
              type="primary" 
              className="!bg-brand-500 !text-white !border-transparent !rounded-xl transition-all shadow-md shadow-brand-500/20 hover:!bg-brand-600"
              startIcon={<Edit size={16} />}
            >
              Chỉnh sửa
            </SWTButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 relative z-10 mt-4 px-2">
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-brand-500 dark:text-admin-accent tracking-widest">Họ và tên</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <User size={20} className="text-slate-500" />
                <span className="font-medium text-lg">{currentUser?.name || "Nguyễn Quản Trị"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-brand-500 dark:text-admin-accent tracking-widest">Email hệ thống</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <Mail size={20} className="text-slate-500" />
                <span className="font-medium text-lg">{currentUser?.email || "admin@ccosmetics.vn"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-brand-500 dark:text-admin-accent tracking-widest">Điện thoại</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <Phone size={20} className="text-slate-500" />
                <span className="font-medium text-lg">{(currentUser as any)?.phone || "0901 234 567"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-brand-500 dark:text-admin-accent tracking-widest">Ngày sinh</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <Calendar size={20} className="text-slate-500" />
                <span className="font-medium text-lg">15/08/1995</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 mt-4">
              <label className="text-xs uppercase font-bold text-brand-500 dark:text-admin-accent tracking-widest">Địa chỉ làm việc</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <MapPin size={20} className="text-slate-500 shrink-0" />
                <span className="font-medium text-lg truncate">123 Đường Neon, Phường Cyber, Quận Retro, Thành phố Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
