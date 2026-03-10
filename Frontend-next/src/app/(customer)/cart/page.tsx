"use client";

import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Breadcrumb */}
      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Giỏ hàng" },
        ]}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold">
        Giỏ hàng (1 sản phẩm)
      </h1>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT - Cart Items */}
        <div className="col-span-12 lg:col-span-8 bg-white border rounded-lg">

          {/* Header */}
          <div className="grid grid-cols-12 text-sm font-medium border-b p-4 text-gray-500">
            <div className="col-span-6">Sản phẩm</div>
            <div className="col-span-2 text-center">Giá tiền</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-2 text-right">Thành tiền</div>
          </div>

          {/* Cart Item */}
          <div className="grid grid-cols-12 items-center p-4 border-b">

            {/* Product */}
            <div className="col-span-6 flex gap-3 items-center">

              <div className="w-16 h-16 bg-gray-100 rounded" />

              <div>
                <p className="font-semibold text-sm">
                  LA ROCHE-POSAY
                </p>

                <p className="text-sm text-gray-600">
                  Kem Dưỡng La Roche-Posay Phục Hồi Da
                </p>

                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <button>♡ Yêu thích</button>
                  <button className="text-red-500">Xóa</button>
                </div>

              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-center">

              <p className="font-semibold">599.000 đ</p>

              <p className="text-sm line-through text-gray-400">
                880.000 đ
              </p>

            </div>

            {/* Quantity */}
            <div className="col-span-2 flex justify-center">

              <input
                type="number"
                defaultValue={1}
                className="w-16 border rounded px-2 py-1"
              />

            </div>

            {/* Total */}
            <div className="col-span-2 text-right font-semibold">
              599.000 đ
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-between p-4">

            <button>
              Tiếp tục mua hàng
            </button>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Tạm tính:
                <span className="text-orange-500 font-semibold ml-2">
                  599.000 đ
                </span>
              </p>

              <button className="mt-2 bg-orange-500 text-white px-6 py-2 rounded">
                Tiến hành đặt hàng
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT - Invoice */}
        <div className="col-span-12 lg:col-span-4">

          <div className="bg-white border rounded-lg p-4 space-y-4">

            <h2 className="font-semibold text-lg">
              Hóa đơn của bạn
            </h2>

            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>599.000 đ</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Giảm giá:</span>
              <span>0 đ</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-orange-500">
                599.000 đ
              </span>
            </div>

            <button className="w-full bg-orange-500 text-white py-3 rounded">
              Tiến hành đặt hàng
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}