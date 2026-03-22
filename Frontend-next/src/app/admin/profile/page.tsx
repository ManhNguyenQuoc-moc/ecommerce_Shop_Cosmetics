"use client";

import { useAuth } from "@/src/context/AuthContext";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { Mail, Phone, MapPin, Calendar, Shield, Edit, User } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

export default function AdminProfilePage() {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="!mb-0 text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            <Shield size={26} className="text-pink-500 drop-shadow-[0_0_8px_#ff007f]" />
            Hồ sơ Quản Trị Viên
          </h2>
          <p className="text-pink-400 text-sm mt-1 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,0,128,0.3)]">
            Thông tin cá nhân & Quyền truy cập
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 p-8 bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-pink-500/20 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="relative group mt-4">
            <SWTAvatar 
              src={currentUser?.avatar || "https://avatars.githubusercontent.com/u/1?v=4"} 
              size={120} 
              className="border-[3px] border-pink-500/50 shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-transform duration-500 group-hover:scale-105"
            />
            <button className="absolute bottom-1 right-1 p-2 bg-slate-800 text-pink-400 border border-pink-500/30 rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-lg cursor-pointer z-10">
              <Edit size={16} />
            </button>
          </div>

          <h3 className="mt-8 text-2xl font-bold text-white drop-shadow-sm tracking-wide">{currentUser?.name || "Nguyễn Quản Trị"}</h3>
          <div className="mt-3 inline-flex items-center justify-center font-bold px-4 py-1.5 rounded-md border text-xs bg-purple-900/40 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.3)] drop-shadow-sm">
            Super Admin
          </div>
          
          <div className="w-full h-px bg-slate-800 my-8" />
          
          <div className="w-full flex justify-between tracking-wide text-sm px-2">
            <span className="text-slate-400 font-medium">Trạng thái hệ thống</span>
            <span className="text-emerald-400 font-bold flex items-center gap-2 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đang hoạt động
            </span>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 p-8 bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-purple-500/20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-fuchsia-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-xl font-bold text-white drop-shadow-sm uppercase tracking-wider">Thông tin chi tiết</h3>
            <SWTButton 
              type="primary" 
              className="!bg-slate-800 !text-white !border-slate-700 hover:!border-pink-500/50 hover:!text-pink-400 !rounded-xl transition-all"
              startIcon={<Edit size={16} />}
            >
              Chỉnh sửa
            </SWTButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 relative z-10 mt-4 px-2">
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-pink-400 tracking-widest drop-shadow-[0_0_2px_rgba(255,0,128,0.5)]">Họ và tên</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <User size={20} className="text-slate-500" />
                <span className="font-medium text-lg">{currentUser?.name || "Nguyễn Quản Trị"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-pink-400 tracking-widest drop-shadow-[0_0_2px_rgba(255,0,128,0.5)]">Email hệ thống</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <Mail size={20} className="text-slate-500" />
                <span className="font-medium text-lg">{currentUser?.email || "admin@ccosmetics.vn"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-pink-400 tracking-widest drop-shadow-[0_0_2px_rgba(255,0,128,0.5)]">Điện thoại</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <Phone size={20} className="text-slate-500" />
                <span className="font-medium text-lg">{(currentUser as any)?.phone || "0901 234 567"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-pink-400 tracking-widest drop-shadow-[0_0_2px_rgba(255,0,128,0.5)]">Ngày sinh</label>
              <div className="flex items-center gap-4 text-white border-b border-slate-700/50 pb-3">
                <Calendar size={20} className="text-slate-500" />
                <span className="font-medium text-lg">15/08/1995</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 mt-4">
              <label className="text-xs uppercase font-bold text-pink-400 tracking-widest drop-shadow-[0_0_2px_rgba(255,0,128,0.5)]">Địa chỉ làm việc</label>
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
