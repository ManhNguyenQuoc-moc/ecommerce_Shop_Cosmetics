"use client";

import React from "react";
import { Truck, Calendar, User, Mail, Phone, MapPin } from "lucide-react";
import { PODetailDto } from "@/src/services/models/purchase/output.dto";

interface PODetailCardsProps {
  po: PODetailDto;
}

const PODetailCards: React.FC<PODetailCardsProps> = ({ po }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Supplier Card */}
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Truck size={18} className="text-brand-500" />
          Nhà cung cấp
        </h3>
        <div className="flex flex-col gap-3">
           <div className="font-black text-xl text-slate-900 dark:text-white group flex items-center gap-2">
              {po.brand?.name}
           </div>
           <div className="flex flex-col gap-1.5">
             <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
       
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{po.brand?.email || "Chưa cập nhật email"}</span>
             </div>
             <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                
                <Phone size={14} className="shrink-0" />
                <span>{po.brand?.phone || "Chưa cập nhật SĐT"}</span>
             </div>

             <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mt-1">
                <MapPin size={13} className="text-brand-400 shrink-0" />
                <span className="italic">{po.brand?.address || "Chưa cập nhật địa chỉ"}</span>
             </div>
           </div>
        </div>
      </div>

      {/* General Info Card */}
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 md:col-span-2 flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Calendar size={18} className="text-brand-500" />
          Thông tin chung
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
           <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Người tạo:</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-full">Admin</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Ngày tạo:</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(po.createdAt).toLocaleDateString("vi-VN", { dateStyle: 'medium' })}
                </span>
              </div>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest pl-1 mb-2 block">Ghi chú</span>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 min-h-[70px] text-slate-600 dark:text-slate-400 italic">
                 {po.note || "Không có ghi chú dành cho phiếu này."}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PODetailCards;
