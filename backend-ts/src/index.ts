// import express from "express";
// import { prisma } from "./config/prisma";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/ping", (req, res) => {
//   res.json({ message: "may nhin cai cho gi" });
// });

// const featuredProducts = [
// {
// id:"p1",
// name:"Son Dưỡng LipIce Hiệu Chỉnh Sắc Môi Hương Tinh Khiết 2.4g",
// brand:"LipIce",
// price:120000,
// salePrice:99000,
// rating:4.8,
// sold:2100,
// image:"https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-co-mau-tu-nhien-lipice-natural-huong-tinh-khiet-2-4g-1721878206_img_320x320_b04c1a_fit_center.jpg"
// },
// {
// id:"p2",
// name:"Son Dưỡng Môi Mentholatum Melty Cream Lip Mật Ong 2.4g",
// brand:"LipIce",
// price:120000,
// salePrice:105000,
// rating:4.7,
// sold:1800,
// image:"https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-am-moi-mentholatum-tan-chay-huong-mat-ong-2-4g-1726715509_img_320x320_b04c1a_fit_center.jpg"
// },
// {
// id:"p3",
// name:"Serum Dưỡng Môi Lipstician Chống Nắng Bảo Vệ Toàn Diện 9g",
// brand:"Lipstician",
// price:150000,
// salePrice:129000,
// rating:4.9,
// sold:900,
// image:"https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-serum-duong-moi-lipstician-chong-nang-bao-ve-toan-dien-9g-1726717081_img_320x320_b04c1a_fit_center.jpg"
// },


// {
// id:"p4",
// name:"Son Kem Lì Glamrr Q 02 Lovely Day - Đỏ Nâu Trầm 5g",
// brand:"Glamrr Q",
// price:180000,
// salePrice:145000,
// rating:4.6,
// sold:1100,
// image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa"
// },
// {
// id:"p5",
// name:"Son Kem Lì Glamrr Q 01 Glad Day - Đỏ Nâu 5g",
// brand:"Glamrr Q",
// price:180000,
// salePrice:149000,
// rating:4.6,
// sold:980,
// image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348"
// },
// {
// id:"p6",
// name:"Son Lì Naris Ailus Mịn Môi Màu 02 Đỏ Cam 4g",
// brand:"Naris",
// price:220000,
// salePrice:179000,
// rating:4.7,
// sold:650,
// image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
// },
// {
// id:"p7",
// name:"Son Dưỡng Môi Milaganics Dừa Dưỡng Ẩm 4g",
// brand:"Milaganics",
// price:90000,
// salePrice:69000,
// rating:4.5,
// sold:1300,
// image:"https://tse3.mm.bing.net/th/id/OIP.Rnp6ltEe7vnuvdQgknx33wHaFA?rs=1&pid=ImgDetMain&o=7&rm=3"
// },
// {
// id:"p8",
// name:"Sáp Tẩy Trang Banila Co Original 100ml",
// brand:"Banila Co",
// price:350000,
// salePrice:299000,
// rating:4.9,
// sold:3200,
// image:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908"
// },
// {
// id:"p9",
// name:"Sữa Rửa Mặt Acnes Creamy Wash 100g",
// brand:"Acnes",
// price:95000,
// salePrice:79000,
// rating:4.6,
// sold:4100,
// image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883"
// },
// {
// id:"p10",
// name:"Kem Chống Nắng Skin Aqua UV Super Moisture Gel 80g",
// brand:"Skin Aqua",
// price:210000,
// salePrice:179000,
// rating:4.8,
// sold:2800,
// image:"https://images.unsplash.com/photo-1601049676869-702ea24cfd58"
// },
// {
// id:"p11",
// name:"Nước Tẩy Trang Garnier Micellar Water 400ml",
// brand:"Garnier",
// price:230000,
// salePrice:189000,
// rating:4.7,
// sold:5000,
// image:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b"
// },
// {
// id:"p12",
// name:"Serum The Ordinary Niacinamide 10% + Zinc 30ml",
// brand:"The Ordinary",
// price:320000,
// salePrice:279000,
// rating:4.9,
// sold:6200,
// image:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
// },
// ];

// const bestSellingProducts = [...featuredProducts].sort(
// (a,b)=> (b.sold ?? 0) - (a.sold ?? 0)
// );

// const newestProducts = [...featuredProducts].reverse();

// const brands = [
//  {
//     name: "Loreal",
//     logo: "/images/main/brands/loreal-logo.jpg",
//     banner: "/images/main/brands/loreal.jpg",
//   },
//   {
//     name: "Cocoon",
//     logo: "/images/main/brands/cocoon-logo.jpg",
//     banner: "/images/main/brands/cocoon.jpg",
//   },
//   {
//     name: "Dove",
//     logo: "/images/main/brands/dove-logo.jpg",
//     banner: "/images/main/brands/dove.jpg",
//   },
//   {
//     name: "Bioderma",
//     logo: "/images/main/brands/bioderma-logo.jpg",
//     banner: "/images/main/brands/bioderma.jpg",
//   },
// ];

// const categories = [
// {
//     name: "Sữa rửa mat",
//     image: "https://media.hasaki.vn/wysiwyg/HaNguyen1/kem-rua-mat-hada-labo-duong-am-toi-uu-cho-moi-loai-da-80g_2.jpg",
//   },
//   {
//     name: "Toner",
//     image: "https://tse3.mm.bing.net/th/id/OIP.SKhE4lieEB11sn5dZiTF9AHaFh?rs=1&pid=ImgDetMain&o=7&rm=3",
//   },
//   {
//     name: "Serum",
//     image: "https://th.bing.com/th/id/OIP.BtpjaSjaoZvk3_0xOXtg9AHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
//   },
//   {
//     name: "Kem dưỡng ẩm",
//     image: "https://i0.wp.com/bloganchoi.com/wp-content/uploads/2023/03/kem-duong-am-ngai-cuu-peacholic-probiotics-calming-cream-scaled.jpg",
//   },
//   {
//     name: "Kem chống nắng",
//     image: "https://trang.store/wp-content/uploads/2022/09/kem-chong-nang-sinh-hoc-dr-anh-trang-store.jpg",
//   },
//   {
//     name: "Mặt nạ dưỡng da",
//     image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
//   },
//   {
//     name: "Tẩy trang",
//     image: "https://tse2.mm.bing.net/th/id/OIP.2rjxqWvg20dyyYVFpEebBQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
//   },
//   {
//     name: "Tẩy tế bào chết",
//     image: "https://product.hstatic.net/1000006063/product/sg-11134201-22120-ufyp9xq6oykv46_63f8a4b9e2a44a738ff68cc2bc905bc9_1024x1024.jpg",
//   },
//   {
//     name: "Xịt khoáng",
//     image: "https://cdn.tgdd.vn/Files/2022/04/16/1426154/xit-khoang-co-duong-am-khong-huong-dan-xit-khoang-1.jpg",
//   },

//   {
//     name: "Son môi",
//     image: "https://www.way.com.vn/vnt_upload/File/Image/Thuong_Hieu_Son_Moi_MOI.jpg",
//   },
//   {
//     name: "Kem nền",
//     image: "https://product.hstatic.net/200000198575/product/118_bff7a206413448f193c506b316a967da_master.jpg",
//   },
//   {
//     name: "Phấn phủ",
//     image: "https://th.bing.com/th/id/OIP.dwIi4UV7Cwd0D9L3PRaQFQHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
//   },
//   {
//     name: "Phấn má hồng",
//     image: "https://tse2.mm.bing.net/th/id/OIP.o31CHPSMMH2dtWjIE13QIAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
//   },
//   {
//     name: "Kẻ mắt",
//     image: "https://2momart.vn/photos/2momart/24092020/but-ke-mat-nuoc.jpg",
//   },
//   {
//     name: "Mascara",
//     image: "https://tse4.mm.bing.net/th/id/OIP._roeao7Lb6Gi-NUu-QzErQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
//   },
//   {
//     name: "Chì kẻ mày",
//     image: "https://focallure.vn/wp-content/uploads/2023/06/but-ke-long-may-focallure-768x768.jpg",
//   },

//   {
//     name: "Dầu gội",
//     image: "https://th.bing.com/th/id/OIP.kfNaPFSQ29y8i7Xm4eOnagHaFH?w=262&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
//   },
//   {
//     name: "Dầu xả",
//     image: "https://th.bing.com/th/id/R.5723fb3557a135044468114b08f694ba?rik=4HcLIT3OANvhdQ&pid=ImgRaw&r=0",
//   },
//   {
//     name: "Ủ tóc",
//     image: "https://classic.vn/wp-content/uploads/2023/05/cach-u-toc-hieu-qua-tai-nha-cho-toc-mem-mai-suon-muot-2.webp",
//   },
//   {
//     name: "Tinh dầu dưỡng tóc",
//     image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80",
//   },

//   {
//     name: "Sữa tắm",
//     image: "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2444/358591/bhx/sua-tam-duong-sang-hazeline-matcha-luu-do-chai-800g-va-tui-900g_202511031515574158.jpg",
//   },
//   {
//     name: "Kem dưỡng thể",
//     image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
//   },
//   {
//     name: "Tẩy tế bào chết body",
//     image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80",
//   },
//   {
//     name: "Lăn khử mùi",
//     image: "https://ananmart.com/data/uploads/140214-5.jpg",
//   },

//   {
//   name: "Nước hoa nữ",
//   image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400"
// },
//  {
//   name: "Nước hoa nam",
//   image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"
// }
// ];

// const banners = [
//   {
//       title: "Discover Your Best Skin",
//       subtitle: "Shop Our Latest Essentials",
//       image:
//           "/images/main/banner.png"
//     },
//     {
//       title: "Discover Your Best Skin",
//       subtitle: "Shop Our Latest Essentials",
//       image:
//         "https://media.hcdn.vn/hsk/17722580881772247996290-1772247502337-l-e1-bb-8ach-s-c4-82n-sale-th-c3-81ng-3-home-846x250.jpg",
//     },
//     {
//       title: "Glow Naturally",
//       subtitle: "Premium Skincare Collection",
//       image:
//         "https://media.hcdn.vn/hsk/17728610101772792156902-homecogia.jpg",
//     },
//     {
//       title: "Glow Naturally",
//       subtitle: "Premium Skincare Collection",
//       image:
//         "https://media.hcdn.vn/hsk/17728619011772620603224-homecogia.jpg",
//     },
//     {
//       title: "Glow Naturally",
//       subtitle: "Premium Skincare Collection",
//       image:
//         "https://media.hcdn.vn/hsk/17728611901772791420592-846x250.jpg",
//     },
//     {
//       title: "Glow Naturally",
//       subtitle: "Premium Skincare Collection",
//       image:
//         "https://media.hcdn.vn/hsk/17728616831772705621390-homecogia.jpg",
//     },
//     {
//       title: "Glow Naturally",
//       subtitle: "Premium Skincare Collection",
//       image:
//         "https://media.hcdn.vn/hsk/17728617971772680663150-home-8.jpg",
//     },
// ];
// const homeData = {
//   banners,
//   categories,
//   featuredProducts,
//   bestSellingProducts,
//   newestProducts,
//   brands
// };
// const users = [
//   {
//     id: "1",
//     name: "Nguyen Van A",
//     phone: "0912345678",
//     addresses: [
//       { address: "123 Đường Lê Lợi, Quận 1, TP.HCM", lat: 10.7769, lon: 106.7009 },
//       { address: "456 Đường Trần Hưng Đạo, Quận 5, TP.HCM", lat: 10.7625, lon: 106.6829 },
//     ],
//   },
//   {
//     id: "2",
//     name: "Tran Thi B",
//     phone: "0987654321",
//     addresses: [
//       { address: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM", lat: 10.7712, lon: 106.6930 },
//     ],
//   },
// ];

// app.get("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const user = users.find((u) => u.id === id);

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }

//   res.json({
//     success: true,
//     message: "Get customer info successfully",
//     data: {
//       name: user.name,
//       phone: user.phone,
//       addresses: user.addresses,
//     },
//   });
// });
// app.get("/home", async (req,res)=>{
// // fake loading
// res.json({
//   success: true,
//   message: "Get home data successfully",
//   data: homeData
// });

// });
// const mockProducts = Array.from({ length: 120 }).map((_, index) => {
//   const base = featuredProducts[index % featuredProducts.length];

//   return {
//     ...base,
//     id: `${base.id}-${index + 1}`,
//     sold: (base.sold ?? 0) + Math.floor(Math.random() * 500),
//     price: base.price + Math.floor(Math.random() * 20000),
//   };
// });
// app.get("/products", async (req, res) => {

//   const page = Number(req.query.page);
//   const pageSize = Number(req.query.pageSize);

//   const start = (page - 1) * pageSize;
//   const end = start + pageSize;

//   const products = mockProducts.slice(start, end);

//   res.json({
//     success: true,
//     message: "Get products successfully",
//     data: {
//       products,
//       total: mockProducts.length,
//       page,
//       pageSize
//     }
//   });

// });

// export type ProductVariant = {
//   id: string;
//   color?: string;
//   size?: string;

//   price: number;
//   salePrice?: number;

//   stock: number;

//   image?: string;
// };

// export type ProductDetail = {
//   id: string;
//   name: string;
//   brand: string;
//   description: string;
//   shortdescription: string;
//   images: string[];

//   rating: number;
//   reviewCount: number;
//   sold: number;

//   priceRange: {
//     min: number;
//     max: number;
//   };

//   totalStock: number;

//   variants: ProductVariant[];

//   specifications: {
//     label: string;
//     value: string;
//   }[];
// };
// export const productDetails: ProductDetail[] = [
//   {
//     id: "p12",
//     name: "Son môi Dior Rouge 999",
//     brand: "Dior",
//     description:
//       "Son môi cao cấp với màu đỏ kinh điển, chất son mịn lì và dưỡng ẩm nhẹ.",
//     shortdescription: "Son môi cao cấp với màu đỏ kinh điển, chất son mịn lì và dưỡng ẩm nhẹ.",
//     images: [
//       "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
//       "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//       "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
//     ],

//     rating: 4.9,
//     reviewCount: 412,
//     sold: 1800,

//     priceRange: {
//       min: 850000,
//       max: 990000,
//     },

//     totalStock: 120,

//     variants: [
//       {
//         id: "v1",
//         color: "Classic Red",
//         price: 990000,
//         salePrice: 850000,
//         stock: 40,
//         image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
//       },
//       {
//         id: "v2",
//         color: "Rose Pink",
//         price: 990000,
//         salePrice: 850000,
//         stock: 40,
//         image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//       },
//       {
//         id: "v3",
//         color: "Coral Orange",
//         price: 990000,
//         salePrice: 820000,
//         stock: 40,
//         image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
//       },
//     ],

//     specifications: [
//       { label: "Thương hiệu", value: "Dior" },
//       { label: "Loại son", value: "Matte Lipstick" },
//       { label: "Xuất xứ", value: "Pháp" },
//       { label: "Dung tích", value: "3.5g" },
//     ],
//   },

//   {
//     id: "p11",
//     name: "Serum dưỡng da Estee Lauder Advanced Night Repair",
//     brand: "Estee Lauder",
//     description:
//       "Serum phục hồi và tái tạo da ban đêm giúp da căng mịn và sáng khỏe.",
//     shortdescription: "Son môi cao cấp với màu đỏ kinh điển, chất son mịn lì và dưỡng ẩm nhẹ.",
//     images: [
//       "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
//       "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
//       "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
//     ],

//     rating: 4.8,
//     reviewCount: 356,
//     sold: 1400,

//     priceRange: {
//       min: 2890000,
//       max: 3590000,
//     },

//     totalStock: 80,

//     variants: [
//       {
//         id: "v4",
//         size: "30ml",
//         price: 3200000,
//         salePrice: 2890000,
//         stock: 40,
//         image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
//       },
//       {
//         id: "v5",
//         size: "50ml",
//         price: 3800000,
//         salePrice: 3590000,
//         stock: 40,
//         image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
//       },
//     ],

//     specifications: [
//       { label: "Thương hiệu", value: "Estee Lauder" },
//       { label: "Loại sản phẩm", value: "Serum dưỡng da" },
//       { label: "Dung tích", value: "30ml / 50ml" },
//       { label: "Công dụng", value: "Phục hồi và tái tạo da" },
//     ],
//   },
// ];
// app.get("/products/:id", async (req, res) => {
//   await new Promise((r) => setTimeout(r, 500));

//   const { id } = req.params;

//   const product = productDetails.find((p) => p.id === id);

//   res.json({
//     success: true,
//     message: "Get product detail successfully",
//     data: product,
//   });
// });
// // app.use("/api/payment", paymentRoute);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log("Server running at", PORT);
// });

import "dotenv/config";
import express from "express";
import cors from "cors";
import paymentRoute from "./routes/payment.route";
import productRoute from "./routes/product.route";
import userRoute from "./routes/user.route";
import categoryRoute from "./routes/category.route";
import categoryGroupRoute from "./routes/category-group.routes";
import orderRoute from "./routes/order.route";
import cartRoute from "./routes/cart.route";
import homeRoute from "./routes/home.route";
import authRoute from "./routes/auth.route";
import uploadRoute from "./routes/upload.route";
import brandRoute from "./routes/brand.route";
import purchaseRoute from "./routes/purchase.route";
import inventoryRoute from "./routes/inventory.route";
import wishlistRoute from "./routes/wishlist.route";
import voucherRoute from "./routes/voucher.route";
import settingRoute from "./routes/setting.route";
import dashboardRoute from "./routes/dashboard.route";

const app = express();

// Fix for BigInt serialization issue
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-shop-cosmetics.vercel.app", // Removed trailing slash
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/category-groups", categoryGroupRoute);
app.use("/orders", orderRoute);
app.use("/carts", cartRoute);
app.use("/payment", paymentRoute);
app.use("/home", homeRoute);
app.use("/auth", authRoute);
app.use("/upload", uploadRoute);
app.use("/brands", brandRoute);
app.use("/purchases", purchaseRoute);
app.use("/inventory", inventoryRoute);
app.use("/wishlist", wishlistRoute);
app.use("/vouchers", voucherRoute);
app.use("/settings", settingRoute);
app.use("/admin/dashboard", dashboardRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running at", PORT);
});