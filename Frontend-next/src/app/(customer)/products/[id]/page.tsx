import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetail({ params }: Props) {

  const { id } = await params;

  /* ================= MOCK DATA ================= */

  const product = {
    id: "hasaki_000007",

    name: "Sáp Tẩy Trang Banila Co Original Cho Mọi Loại Da 100ml",

    brand: "Banila Co",

    shortName: "Clean it Zero Cleansing Balm #Original",

    image:
      "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-sap-tay-trang-banila-co-original-cho-moi-loai-da-100ml-1740631254_img_320x320_b04c1a_fit_center.jpg",

    rating: 4.9,

    sold: 1800,

    price: 380000,

    salePrice: 315000,

    description:
      "Sáp Tẩy Trang Banila Co Original Cho Mọi Loại Da Clean it Zero Cleansing Balm là sản phẩm sáp tẩy trang bán chạy hàng đầu của thương hiệu mỹ phẩm Banila Co đến từ Hàn Quốc, với khả năng làm sạch sâu nhanh chóng và hiệu quả, từ sản phẩm chống nắng đến makeup chống thấm nước, đồng thời cung cấp độ ẩm cho da mềm mịn, không bị khô căng sau khi tẩy trang. Bên cạnh đó, chiết xuất Acerola và Vitamin C giúp chống oxy hoá và hỗ trợ dưỡng sáng da. Hiện sản phẩm Sáp Tẩy Trang Banila Co Clean it Zero Cleansing Balm #Original đã có mặt tại Hasaki được thiết kế dành cho mọi loại da.     Sáp Tẩy Trang Banila Co Original Cho Mọi Loại Da phù hợp với loại da nào? Sản phẩm thích hợp tẩy trang cho mọi loại da. Ưu thế nổi bật của Sáp Tẩy Trang Banila Co Original Cho Mọi Loại Da:  Bằng cách lên men nước khoáng từ các suối nước nóng ở Pháp, phân tử thành phần hoạt chất có lợi trở nên nhỏ hơn được hấp thụ sâu vào da sau quá trình rửa mặt, mang lại hiệu quả tuyệt vời về dưỡng ẩm và làm dịu da. Thành phần chống oxi hóa chính của Clean It Zero kết hợp từ chiết xuất Acerola và Vitamin C. Chiết xuất cranberrys - dưỡng da khỏe mạnh. Chiết xuất lựu - Mang lại sự sức sống cho làn da. Sản phẩm là dạng sáp không có mùi (no perfume). Có khả năng làm sạch sâu từ sản phẩm chống nắng đến lớp trang điểm chống thấm nước, tất cả chỉ trong một bước duy nhất! Sản phẩm thân thiện với làn da, có thể sử dụng cho mắt và môi. Công dụng: Giúp tẩy sạch kem chống nắng và lớp trang điểm mặt / mắt môi, kể cả sản phẩm chống thấm nước. Cung cấp độ ẩm, giúp da mềm mại, không bị khô rát sau khi tẩy trang. Chống oxy hoá và hỗ trợ dưỡng sáng da.",

    highlights: [
      "Làm sạch lớp trang điểm chống nước",
      "Chiết xuất Acerola và Vitamin C chống oxy hoá",
      "Dưỡng ẩm giúp da mềm mịn",
      "Không chứa hương liệu",
    ],

    safety: [
      "Đã kiểm định không gây kích ứng da",
      "Không chứa 23 thành phần gây hại",
      "Không có màu nhân tạo",
      "Công thức thuần chay",
    ],

    storage: [
      "Bảo quản nơi khô ráo thoáng mát",
      "Tránh ánh nắng trực tiếp",
      "Đậy nắp kín sau khi sử dụng",
    ],
  };

  /* ================= PAGE ================= */

  return (
    <div className="bg-gray-100 min-h-screen py-6">

      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* Breadcrumb */}

        <div className="text-sm text-gray-500">
          Trang chủ / Sản phẩm / {id}
        </div>


        {/* MAIN PRODUCT */}

        <div className="grid grid-cols-12 gap-6">

          {/* GALLERY */}

          <div className="col-span-5">

            <SWTCard className="p-4">

              <div className="relative w-full h-[420px]">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />

              </div>

              <div className="flex gap-2 mt-4">

                {[1, 2, 3, 4].map((i) => (

                  <div
                    key={i}
                    className="relative w-16 h-16 border rounded cursor-pointer"
                  >

                    <Image
                      src={product.image}
                      alt=""
                      fill
                      className="object-cover"
                    />

                  </div>

                ))}

              </div>

            </SWTCard>

          </div>


          {/* PRODUCT INFO */}

          <div className="col-span-7">

            <SWTCard className="p-5 space-y-4">

              <h1 className="text-xl font-semibold">
                {product.name}
              </h1>

              <p className="text-sm text-gray-500">
                Thương hiệu: <b>{product.brand}</b>
              </p>


              {/* rating */}

              <div className="flex items-center gap-4 text-sm text-gray-600">

                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-yellow-500 fill-yellow-500"
                  />
                  {product.rating}
                </span>

                <span>Đã bán {product.sold}</span>

              </div>


              {/* price */}

              <div className="flex items-center gap-3">

                <span className="text-3xl font-bold text-red-600">
                  {product.salePrice.toLocaleString()}đ
                </span>

                <span className="line-through text-gray-400">
                  {product.price.toLocaleString()}đ
                </span>

              </div>


              {/* quantity */}

              <div className="flex items-center gap-4 pt-2">

                <span>Số lượng</span>

                <div className="flex border rounded">

                  <button className="px-3 py-1">-</button>

                  <input
                    className="w-12 text-center outline-none"
                    defaultValue={1}
                  />

                  <button className="px-3 py-1">+</button>

                </div>

              </div>


              {/* buttons */}

              <div className="flex gap-3 pt-4">

                <SWTButton className="flex-1 h-12 !bg-brand-500 !text-white text-lg">
                  Mua ngay
                </SWTButton>

                <SWTButton className="flex-1 h-12 border border-blue-500 text-blue-600 flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </SWTButton>

              </div>

            </SWTCard>

          </div>

        </div>


        {/* HIGHLIGHTS */}

        <SWTCard className="p-6 space-y-3">

          <h2 className="text-lg font-semibold">
            Ưu thế nổi bật
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">

            {product.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>

        </SWTCard>


        {/* DESCRIPTION */}

        <SWTCard className="p-6 space-y-3">

          <h2 className="text-lg font-semibold">
            Mô tả sản phẩm
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>

        </SWTCard>


        {/* SAFETY */}

        <SWTCard className="p-6 space-y-3">

          <h2 className="text-lg font-semibold">
            Độ an toàn
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">

            {product.safety.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>

        </SWTCard>


        {/* STORAGE */}

        <SWTCard className="p-6 space-y-3">

          <h2 className="text-lg font-semibold">
            Hướng dẫn bảo quản
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">

            {product.storage.map((item, index) => (
              <li key={index}>{item}</li>
            ))}

          </ul>

        </SWTCard>

      </div>

    </div>
  );
}