"use client";

import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Breadcrumb */}
      <SWTBreadcrumb
        items={[
          { title: <span>Trang chủ</span>, href: "/" },
          { title: <span>Thanh toán</span> },
        ]}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold">Thanh toán</h1>

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT - Checkout Form */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Shipping Info */}
          <div className="bg-white border rounded-lg p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Thông tin giao hàng
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Họ và tên"
                className="border rounded px-3 py-2"
              />

              <input
                placeholder="Số điện thoại"
                className="border rounded px-3 py-2"
              />

              <input
                placeholder="Email"
                className="border rounded px-3 py-2 col-span-2"
              />

              <input
                placeholder="Địa chỉ"
                className="border rounded px-3 py-2 col-span-2"
              />

              <input
                placeholder="Tỉnh / Thành phố"
                className="border rounded px-3 py-2"
              />

              <input
                placeholder="Quận / Huyện"
                className="border rounded px-3 py-2"
              />

            </div>

          </div>

          {/* Payment Method */}
          <div className="bg-white border rounded-lg p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Phương thức thanh toán
            </h2>

            <div className="flex flex-col gap-3">

              <label className="flex items-center gap-3 border rounded p-3">
                <input type="radio" name="payment" defaultChecked />
                Thanh toán khi nhận hàng (COD)
              </label>

              <label className="flex items-center gap-3 border rounded p-3">
                <input type="radio" name="payment" />
                Thanh toán qua ví điện tử
              </label>

              <label className="flex items-center gap-3 border rounded p-3">
                <input type="radio" name="payment" />
                Chuyển khoản ngân hàng
              </label>

            </div>

          </div>

        </div>

        {/* RIGHT - Order Summary */}
        <div className="col-span-12 lg:col-span-4">

          <div className="bg-white border rounded-lg p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Đơn hàng của bạn
            </h2>

            {/* Item */}
            <div className="flex justify-between text-sm">
              <span>Kem dưỡng La Roche-Posay</span>
              <span>599.000đ</span>
            </div>

            <div className="border-t pt-3 flex justify-between text-sm">
              <span>Tạm tính</span>
              <span>599.000đ</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Phí vận chuyển</span>
              <span>30.000đ</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Tổng cộng</span>
              <span className="text-orange-500">
                629.000đ
              </span>
            </div>

            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600">
              Đặt hàng
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}