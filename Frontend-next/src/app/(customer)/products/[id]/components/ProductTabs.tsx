"use client";

import { useState } from "react";
import { ProductDetailDto } from "@/src/services/models/product/output.dto";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { TabsProps } from "antd";
import { ChevronDown } from "lucide-react";

type Props = {
  product: ProductDetailDto;
};

export default function ProductTabs({ product }: Props) {
  const [tab, setTab] = useState("desc");
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const description = product.long_description || '';
  const previewLength = 200;
  const preview = description.substring(0, previewLength);
  const hasMore = description.length > previewLength;
  const tabItems: TabsProps["items"] = [
    {
      key: "desc",
      label: "Mô tả",
      children: (
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Mô tả chi tiết</h3>

            {isDescExpanded ? (
              <>
                <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg mb-3">
                  {description}
                </div>
                <button
                  onClick={() => setIsDescExpanded(false)}
                  className="w-full flex items-center justify-center gap-2 text-brand-600 hover:text-brand-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Ẩn bớt
                  <ChevronDown size={18} className="rotate-180 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {hasMore ? preview + '...' : description}
                </p>
                {hasMore && (
                  <button
                    onClick={() => setIsDescExpanded(true)}
                    className="w-full flex items-center justify-center gap-2 text-brand-600 hover:text-brand-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Xem thêm
                    <ChevronDown size={18} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Thông số kỹ thuật</h3>
              <div className="border rounded-lg overflow-hidden">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex border-b last:border-none"
                  >
                    <div className="w-1/3 bg-gray-50 p-3 font-medium text-gray-700">
                      {spec.label}
                    </div>

                    <div className="flex-1 p-3 text-gray-600">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      key: "review",
      label: "Đánh giá",
      children: (
        <div className="text-sm text-gray-700">
          ⭐ {product.rating} / 5 ({product.reviewCount} đánh giá)
        </div>
      )
    },
    {
      key: "qa",
      label: "Hỏi đáp",
      children: (
        <div className="text-sm text-gray-600">
          Chưa có câu hỏi cho sản phẩm này
        </div>
      )
    }
  ];

  return (
    <SWTCard className="!p-6 !mt-3">
      <SWTTabs
        activeKey={tab}
        onChange={(key) => setTab(key)}
        items={tabItems}
      />
    </SWTCard>
  );
}