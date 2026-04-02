"use client";

import { useState } from "react";
import { ProductDetail } from "@/src/@core/type/Product";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Props = {
  product: ProductDetail;
};

export default function ProductTabs({ product }: Props) {
  const [tab, setTab] = useState("desc");
  const tabClass = (key: string) =>
    `pb-3 border-b-2 transition ${
      tab === key
        ? "border-brand-500 text-brand-600 font-semibold"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`;
  return (
    <SWTCard className="!p-6 !mt-3">
      <div className="flex gap-8 border-b mb-6">
        <button
          onClick={() => setTab("desc")}
          className={tabClass("desc")}
        >
          Mô tả
        </button>
        <button
          onClick={() => setTab("review")}
          className={tabClass("review")}
        >
          Đánh giá
        </button>

        <button
          onClick={() => setTab("qa")}
          className={tabClass("qa")}
        >
          Hỏi đáp
        </button>

      </div>
      {/* Content */}
      {tab === "desc" && (
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>{product.long_description}</p>
          <div className="border rounded-lg overflow-hidden mt-4">
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

      {tab === "review" && (
        <div className="text-sm text-gray-700">
          ⭐ {product.rating} / 5 ({product.reviewCount} đánh giá)
        </div>
      )}

      {tab === "qa" && (
        <div className="text-sm text-gray-600">
          Chưa có câu hỏi cho sản phẩm này
        </div>
      )}

    </SWTCard>
  );
}