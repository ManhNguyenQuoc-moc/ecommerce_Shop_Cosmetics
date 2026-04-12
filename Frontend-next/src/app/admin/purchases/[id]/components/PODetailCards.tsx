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
      <div className="bg-bg-card/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-border-default flex flex-col gap-4">
        <h3 className="font-bold text-text-main flex items-center gap-2 text-sm uppercase tracking-wider">
          <Truck size={18} className="text-brand-500" />
          Nhà cung cấp
        </h3>
        <div className="flex flex-col gap-3">
           <div className="font-black text-xl text-text-main group flex items-center gap-2 uppercase tracking-tight">
              {po.brand?.name}
           </div>
           <div className="flex flex-col gap-1.5">
             <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
       
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{po.brand?.email || "Chưa cập nhật email"}</span>
             </div>
             <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                
                <Phone size={14} className="shrink-0" />
                <span>{po.brand?.phone || "Chưa cập nhật SĐT"}</span>
             </div>

             <div className="flex items-center gap-2 text-text-sub text-xs font-bold uppercase mt-1">
                <MapPin size={13} className="text-brand-500 shrink-0" />
                <span className="italic">{po.brand?.address || "Chưa cập nhật địa chỉ"}</span>
             </div>
           </div>
        </div>
      </div>

      {/* General Info Card */}
      <div className="bg-bg-card/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-border-default md:col-span-2 flex flex-col gap-4">
        <h3 className="font-bold text-text-main flex items-center gap-2 text-sm uppercase tracking-wider">
          <Calendar size={18} className="text-brand-500" />
          Thông tin chung
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
           <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-border-default">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-text-muted" />
                  <span className="text-text-muted font-bold uppercase text-[10px] tracking-tight">Người tạo:</span>
                </div>
                <span className="font-bold text-text-main bg-bg-muted px-3 py-0.5 rounded-full uppercase text-[10px] tracking-widest">Admin</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-border-default">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-text-muted" />
                  <span className="text-text-muted font-bold uppercase text-[10px] tracking-tight">Ngày tạo:</span>
                </div>
                <span className="font-black text-text-main uppercase tracking-tighter">
                  {new Date(po.createdAt).toLocaleDateString("vi-VN", { dateStyle: 'medium' })}
                </span>
              </div>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-text-muted font-bold text-[10px] uppercase tracking-widest pl-1 mb-2 block">Ghi chú</span>
              <div className="p-4 bg-bg-muted/50 rounded-2xl border border-dashed border-border-default min-h-[70px] text-text-sub italic font-medium">
                 {po.note || "Không có ghi chú dành cho phiếu này."}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PODetailCards;
