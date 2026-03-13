"use client";

import { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: Props) {

  /* ================= MOCK DATA ================= */

  const product = {
    title: "Nước Tẩy Trang L'Oreal Micellar Water 400ml",
    price: 137000,
    oldPrice: 249000,
    rating: 4.8,
    sold: 1179,
    images: [
      "/images/p1.jpg",
      "/images/p2.jpg",
      "/images/p3.jpg",
      "/images/p4.jpg",
    ],
    variants: ["4×95ml", "5×95ml", "95ml", "400ml", "400ml+95ml"],
    description:
      "Có hai lớp chất lỏng giúp hòa tan chất bẩn và loại bỏ toàn bộ lớp trang điểm hiệu quả.",
  };

  /* ================= STATE ================= */

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [variant, setVariant] = useState("400ml");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">

      {/* ================= TOP PRODUCT ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-2 border-brand-500 p-4 mb-4">

        {/* ================= IMAGE GALLERY ================= */}

        <div className="lg:col-span-5 space-y-4">

          <img
            src={activeImage}
            className="w-full h-[450px] object-cover rounded-lg border mb-6"
          />

          <div className="flex gap-2 mb-6">
            {product.images.map((img) => (
              <img
                key={img}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 object-cover border rounded cursor-pointer
                ${activeImage === img ? "border-orange-500" : "border-gray-200"}`}
              />
            ))}
          </div>

        </div>
        {/* ================= PRODUCT INFO ================= */}
        <div className="lg:col-span-5 space-y-5">
          <h1 className="text-2xl font-semibold">
            {product.title}
          </h1>
           <h2 className="text-sm text-gray">
            mo ta ngan tho 
          </h2>
          <h2 className="text-sm text-gray">
           Thuong hieu : xxxxxx
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            ⭐ {product.rating}
            <span>|</span>
            {product.sold} đã bán
            <span>|</span>
            ma san pham : 0976532
          </div>
          <div className="flex items-center gap-3 mt-6">
            <span className="text-3xl text-orange-600 font-bold">
              {product.price.toLocaleString()}đ
            </span>
            <span className="line-through text-gray-400">
              {product.oldPrice.toLocaleString()}đ
            </span>
          </div>

          {/* ================= VARIANT ================= */}

          <div className="space-y-3">

            <p className="text-sm mt-3">
              Dung tích: <span className="font-semibold">{variant}</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {product.variants.map((v) => {
                const active = variant === v;

                return (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-4 py-2 rounded-full border text-sm transition
                    ${active
                        ? "border-brand-500 text-brand-500 bg-brand-50"
                        : "border-gray-300 hover:border-brand-500"
                      }`}
                  >
                    {v}
                  </button>
                );

              })}

            </div>

          </div>

          {/* ================= QUANTITY ================= */}

          <div className="flex items-center gap-4 mb-3">

            <span className="text-sm">Số lượng</span>

            <div className="flex border rounded">

              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1"
              >
                -
              </button>

              <span className="px-4 py-1">{qty}</span>

              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-1"
              >
                +
              </button>

            </div>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="flex gap-4 pt-2">

            <button className="border border-brand-500 text-brand-500 px-6 py-2 rounded hover:bg-orange-50">
              Thêm giỏ hàng
            </button>

            <button className="bg-brand-500 text-white px-6 py-2 rounded hover:bg-brand-600">
              Mua ngay
            </button>

          </div>

        </div>

        {/* ================= SHIPPING ================= */}


      </div>
              
        <div className="lg:col-span-2 border rounded-lg p-4 space-y-3 text-sm border-2 border-brand-500 p-4 mb-4">

          <h3 className="font-semibold">Miễn phí vận chuyển</h3>

          <p>✔ Giao nhanh 2H</p>
          <p>✔ Hoàn tiền nếu hàng giả</p>
          <p>✔ Đổi trả 30 ngày</p>

        </div>
      {/* ================= PRODUCT TABS ================= */}

      <div className="border rounded-lg p-6 border-2 border-brand-500 mb-6 h-[500px]">

        <div className="flex gap-6 border-b pb-3 mb-4">

          <button
            onClick={() => setTab("desc")}
            className={tab === "desc" ? "font-semibold text-orange-500" : ""}
          >
            Mô tả
          </button>

          <button
            onClick={() => setTab("review")}
            className={tab === "review" ? "font-semibold text-orange-500" : ""}
          >
            Đánh giá
          </button>

          <button
            onClick={() => setTab("qa")}
            className={tab === "qa" ? "font-semibold text-orange-500" : ""}
          >
            Hỏi đáp
          </button>

        </div>

        {tab === "desc" && (
          <p className="text-sm text-gray-700">
            {product.description}
          </p>
        )}

        {tab === "review" && (
          <div>

            <h3 className="text-lg font-semibold mb-2">
              Đánh giá sản phẩm
            </h3>

            <p>⭐ 4.8 / 5 (298 đánh giá)</p>

            <div className="mt-4 border-t pt-4">

              <p className="font-semibold">Nguyễn Văn A</p>

              <p className="text-sm text-gray-500">
                Sản phẩm rất tốt
              </p>

            </div>

          </div>
        )}

        {tab === "qa" && (
          <div>

            <h3 className="font-semibold mb-2">
              Hỏi đáp
            </h3>

            <p className="text-sm">
              Giá trên web có giống ngoài cửa hàng không?
            </p>

          </div>
        )}

      </div>

      {/* ================= RELATED ================= */}

      <div className="space-y-4 ">

        <h2 className="text-lg font-semibold">
          Có thể bạn thích
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-2 border-brand-500">

          {Array.from({ length: 5 }).map((_, i) => (

            <div
              key={i}
              className="border rounded-lg p-3 space-y-2 hover:shadow"
            >

              <div className="h-32 bg-gray-200 rounded" />

              <p className="text-sm">
                Sản phẩm gợi ý {i + 1}
              </p>

              <p className="text-orange-500 font-semibold">
                120.000đ
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}