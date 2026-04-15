"use client";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { Truck, ShieldCheck, RefreshCcw, Clock } from "lucide-react";

export default function ShippingInfo() {
  const items = [
    {
      icon: Clock,
      title: "Giao Nhanh Miễn Phí 2H",
      desc: "Trễ tặng 100K",
    },
    {
      icon: ShieldCheck,
      title: "CosmeticsShop đền bù 100%",
      desc: "Đền bù 100% nếu phát hiện hàng giả",
    },
    {
      icon: Truck,
      title: "Giao Hàng Miễn Phí",
      desc: "(từ 90K tại 60 tỉnh thành, toàn quốc từ 249K)",
    },
    {
      icon: RefreshCcw,
      title: "Đổi trả",
      desc: "Trong 30 ngày",
    },
  ];

  return (
    <SWTCard className="!py-4 !px-4 !mb-4">

      {/* Title */}
      <h3 className="text-center text-brand-700 font-semibold text-sm tracking-wide mb-4">
        MIỄN PHÍ VẬN CHUYỂN
      </h3>

      <div className="space-y-4">

        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded-lg transition"
            >

              {/* Icon */}
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-brand-500">
                <IconComponent size={24} />
              </div>

              {/* Text */}
              <div className="text-sm leading-relaxed">
                <p className="font-medium text-gray-800">
                  {item.title}
                </p>
                <p className="text-gray-600 text-xs">
                  {item.desc}
                </p>
              </div>

            </div>
          );
        })}

      </div>
    </SWTCard>
  );
}