"use client";

import Image from "next/image";

export default function AppFooter() {
  return (
    <footer className="bg-white mt-10 border-t pt-3.5">
      <div className="flex justify-center pb-4">
        <Image
          src="/images/main/banner.png"
          alt="payment methods"
          width={1250}
          height={50}
          className="object-contain"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Về chúng tôi</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Giới thiệu</li>
            <li>Tuyển dụng</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Hỗ trợ khách hàng</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo hành</li>
            <li>Hướng dẫn mua hàng</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Danh mục</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Chăm sóc da</li>
            <li>Trang điểm</li>
            <li>Chăm sóc tóc</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Kết nối</h3>
          <p className="text-sm text-gray-600">
            Email: support@shop.com
          </p>
          <p className="text-sm text-gray-600">
            Hotline: 1900 1234
          </p>
        </div>
      </div>


      <div className="border-t text-center text-sm text-gray-500 py-4">
        © 2026 MyShop. All rights reserved.
      </div>
    </footer>
  );
}