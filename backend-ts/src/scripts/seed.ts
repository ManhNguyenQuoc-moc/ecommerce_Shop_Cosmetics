import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../config/prisma";

const brandsData = [
  { name: "Loreal", logo: "/images/main/brands/loreal-logo.jpg", banner: "/images/main/brands/loreal.jpg" },
  { name: "Cocoon", logo: "/images/main/brands/cocoon-logo.jpg", banner: "/images/main/brands/cocoon.jpg" },
  { name: "Dove", logo: "/images/main/brands/dove-logo.jpg", banner: "/images/main/brands/dove.jpg" },
  { name: "Bioderma", logo: "/images/main/brands/bioderma-logo.jpg", banner: "/images/main/brands/bioderma.jpg" },
  { name: "LipIce", logo: "", banner: "" },
  { name: "Lipstician", logo: "", banner: "" },
  { name: "Glamrr Q", logo: "", banner: "" },
  { name: "Naris", logo: "", banner: "" },
  { name: "Milaganics", logo: "", banner: "" },
  { name: "Banila Co", logo: "", banner: "" },
  { name: "Acnes", logo: "", banner: "" },
  { name: "Skin Aqua", logo: "", banner: "" },
  { name: "Garnier", logo: "", banner: "" },
  { name: "The Ordinary", logo: "", banner: "" },
  { name: "Dior", logo: "", banner: "" },
  { name: "Estee Lauder", logo: "", banner: "" },
];

const categoriesData = [
  { name: "Sữa rửa mặt", image: "https://media.hasaki.vn/wysiwyg/HaNguyen1/kem-rua-mat-hada-labo-duong-am-toi-uu-cho-moi-loai-da-80g_2.jpg" },
  { name: "Toner", image: "https://tse3.mm.bing.net/th/id/OIP.SKhE4lieEB11sn5dZiTF9AHaFh?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Serum", image: "https://th.bing.com/th/id/OIP.BtpjaSjaoZvk3_0xOXtg9AHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
  { name: "Kem dưỡng ẩm", image: "https://i0.wp.com/bloganchoi.com/wp-content/uploads/2023/03/kem-duong-am-ngai-cuu-peacholic-probiotics-calming-cream-scaled.jpg" },
  { name: "Kem chống nắng", image: "https://trang.store/wp-content/uploads/2022/09/kem-chong-nang-sinh-hoc-dr-anh-trang-store.jpg" },
  { name: "Mặt nạ dưỡng da", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80" },
  { name: "Tẩy trang", image: "https://tse2.mm.bing.net/th/id/OIP.2rjxqWvg20dyyYVFpEebBQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Tẩy tế bào chết", image: "https://product.hstatic.net/1000006063/product/sg-11134201-22120-ufyp9xq6oykv46_63f8a4b9e2a44a738ff68cc2bc905bc9_1024x1024.jpg" },
  { name: "Xịt khoáng", image: "https://cdn.tgdd.vn/Files/2022/04/16/1426154/xit-khoang-co-duong-am-khong-huong-dan-xit-khoang-1.jpg" },
  { name: "Son môi", image: "https://www.way.com.vn/vnt_upload/File/Image/Thuong_Hieu_Son_Moi_MOI.jpg" },
  { name: "Kem nền", image: "https://product.hstatic.net/200000198575/product/118_bff7a206413448f193c506b316a967da_master.jpg" },
  { name: "Phấn phủ", image: "https://th.bing.com/th/id/OIP.dwIi4UV7Cwd0D9L3PRaQFQHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
  { name: "Phấn má hồng", image: "https://tse2.mm.bing.net/th/id/OIP.o31CHPSMMH2dtWjIE13QIAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Kẻ mắt", image: "https://2momart.vn/photos/2momart/24092020/but-ke-mat-nuoc.jpg" },
  { name: "Mascara", image: "https://tse4.mm.bing.net/th/id/OIP._roeao7Lb6Gi-NUu-QzErQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { name: "Chì kẻ mày", image: "https://focallure.vn/wp-content/uploads/2023/06/but-ke-long-may-focallure-768x768.jpg" },
  { name: "Dầu gội", image: "https://th.bing.com/th/id/OIP.kfNaPFSQ29y8i7Xm4eOnagHaFH?w=262&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
  { name: "Dầu xả", image: "https://th.bing.com/th/id/R.5723fb3557a135044468114b08f694ba?rik=4HcLIT3OANvhdQ&pid=ImgRaw&r=0" },
  { name: "Ủ tóc", image: "https://classic.vn/wp-content/uploads/2023/05/cach-u-toc-hieu-qua-tai-nha-cho-toc-mem-mai-suon-muot-2.webp" },
  { name: "Tinh dầu dưỡng tóc", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80" },
  { name: "Sữa tắm", image: "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2444/358591/bhx/sua-tam-duong-sang-hazeline-matcha-luu-do-chai-800g-va-tui-900g_202511031515574158.jpg" },
  { name: "Kem dưỡng thể", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80" },
  { name: "Tẩy tế bào chết body", image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80" },
  { name: "Lăn khử mùi", image: "https://ananmart.com/data/uploads/140214-5.jpg" },
  { name: "Nước hoa nữ", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400" },
  { name: "Nước hoa nam", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400" },
];

type Variant = {
  color?: string;
  size?: string;
  price: number;
  salePrice: number;
  stock: number;
  image: string;
};

const productsData: {
  name: string;
  brand: string;
  price: number;
  salePrice: number;
  rating: number;
  sold: number;
  description: string;
  shortdescription: string;
  images: string[];
  specifications: { label: string; value: string }[];
  variants: Variant[];
}[] = [
  {
    name: "Son môi Dior Rouge 999", brand: "Dior",
    price: 850000, salePrice: 850000, rating: 4.9, sold: 1800,
    description: "Son môi cao cấp với màu đỏ kinh điển, chất son mịn lì và dưỡng ẩm nhẹ.",
    shortdescription: "Son môi cao cấp với màu đỏ kinh điển, chất son mịn lì và dưỡng ẩm nhẹ.",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    ],
    specifications: [
      { label: "Thương hiệu", value: "Dior" },
      { label: "Loại son", value: "Matte Lipstick" },
      { label: "Xuất xứ", value: "Pháp" },
      { label: "Dung tích", value: "3.5g" },
    ],
    variants: [
      { color: "Classic Red", price: 990000, salePrice: 850000, stock: 40, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa" },
      { color: "Rose Pink", price: 990000, salePrice: 850000, stock: 40, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" },
      { color: "Coral Orange", price: 990000, salePrice: 820000, stock: 40, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
    ]
  },
  {
    name: "Serum dưỡng da Estee Lauder Advanced Night Repair", brand: "Estee Lauder",
    price: 2890000, salePrice: 2890000, rating: 4.8, sold: 1400,
    description: "Serum phục hồi và tái tạo da ban đêm giúp da căng mịn và sáng khỏe.",
    shortdescription: "Serum phục hồi ban đêm",
    images: [
        "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
    ],
    specifications: [
      { label: "Thương hiệu", value: "Estee Lauder" },
      { label: "Loại sản phẩm", value: "Serum dưỡng da" },
      { label: "Dung tích", value: "30ml / 50ml" },
      { label: "Công dụng", value: "Phục hồi và tái tạo da" },
    ],
    variants: [
      { size: "30ml", price: 3200000, salePrice: 2890000, stock: 40, image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6" },
      { size: "50ml", price: 3800000, salePrice: 3590000, stock: 40, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908" },
    ]
  },
  {
    name: "Son Dưỡng LipIce Hiệu Chỉnh Sắc Môi Hương Tinh Khiết 2.4g", brand: "LipIce",
    price: 120000, salePrice: 99000, rating: 4.8, sold: 2100,
    description: "Khám phá làn môi mềm mịn cùng Son Lì LipIce...", shortdescription: "Khám phá làn môi mềm mịn",
    images: ["https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-co-mau-tu-nhien-lipice-natural-huong-tinh-khiet-2-4g-1721878206_img_320x320_b04c1a_fit_center.jpg"],
    specifications: [{ label: "Thương hiệu", value: "LipIce" }],
    variants: [{ color: "Tự nhiên", salePrice: 99000, price: 120000, stock: 100, image: "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-co-mau-tu-nhien-lipice-natural-huong-tinh-khiet-2-4g-1721878206_img_320x320_b04c1a_fit_center.jpg" }]
  },
  {
    name: "Son Dưỡng Môi Mentholatum Melty Cream Lip Mật Ong 2.4g", brand: "LipIce", price: 120000, salePrice: 105000, rating: 4.7, sold: 1800,
    description: "Son Dưỡng Môi Mentholatum Melty Cream Lip Mật Ong Cung cấp khả năng dưỡng ẩm nổi bật nhờ lớp màng giữ nước dịu nhẹ.", shortdescription: "Dưỡng ẩm vượt trội",
    images: ["https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-am-moi-mentholatum-tan-chay-huong-mat-ong-2-4g-1726715509_img_320x320_b04c1a_fit_center.jpg"],
    specifications: [{ label: "Thương hiệu", value: "Mentholatum" }],
    variants: [{ color: "Mật ong", salePrice: 105000, price: 120000, stock: 100, image: "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-son-duong-am-moi-mentholatum-tan-chay-huong-mat-ong-2-4g-1726715509_img_320x320_b04c1a_fit_center.jpg" }]
  },
  {
    name: "Serum Dưỡng Môi Lipstician Chống Nắng Bảo Vệ Toàn Diện 9g", brand: "Lipstician", price: 150000, salePrice: 129000, rating: 4.9, sold: 900,
    description: "Serum Chống Nắng Lipstician", shortdescription: "Chống nắng bảo vệ môi toàn diện",
    images: ["https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-serum-duong-moi-lipstician-chong-nang-bao-ve-toan-dien-9g-1726717081_img_320x320_b04c1a_fit_center.jpg"],
    specifications: [{ label: "Thương hiệu", value: "Lipstician" }],
    variants: [{ size: "9g", salePrice: 129000, price: 150000, stock: 100, image: "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-serum-duong-moi-lipstician-chong-nang-bao-ve-toan-dien-9g-1726717081_img_320x320_b04c1a_fit_center.jpg" }]
  },
  {
    name: "Son Kem Lì Glamrr Q 02 Lovely Day - Đỏ Nâu Trầm 5g", brand: "Glamrr Q", price: 180000, salePrice: 145000, rating: 4.6, sold: 1100,
    description: "Đỏ Nâu Trầm cực cá tính.", shortdescription: "Màu Đỏ Nâu Trầm",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa"],
    specifications: [{ label: "Thương hiệu", value: "Glamrr Q" }],
    variants: [{ color: "Đỏ Nâu Trầm", salePrice: 145000, price: 180000, stock: 100, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa" }]
  },
  {
    name: "Son Kem Lì Glamrr Q 01 Glad Day - Đỏ Nâu 5g", brand: "Glamrr Q", price: 180000, salePrice: 149000, rating: 4.6, sold: 980,
    description: "Glamrr Q 01 Glad Day - Đỏ Nâu 5g", shortdescription: "Màu Đỏ Nâu tươi tắn",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348"],
    specifications: [{ label: "Thương hiệu", value: "Glamrr Q" }],
    variants: [{ color: "Đỏ Nâu", salePrice: 149000, price: 180000, stock: 100, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" }]
  },
  {
    name: "Son Lì Naris Ailus Mịn Môi Màu 02 Đỏ Cam 4g", brand: "Naris", price: 220000, salePrice: 179000, rating: 4.7, sold: 650,
    description: "Naris Ailus 02 Đỏ Cam 4g", shortdescription: "Màu Đỏ Cam Mịn Môi",
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"],
    specifications: [{ label: "Thương hiệu", value: "Naris" }],
    variants: [{ color: "Đỏ Cam", salePrice: 179000, price: 220000, stock: 100, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" }]
  },
  {
    name: "Son Dưỡng Môi Milaganics Dừa Dưỡng Ẩm 4g", brand: "Milaganics", price: 90000, salePrice: 69000, rating: 4.5, sold: 1300,
    description: "Son Dưỡng Milaganics Dừa", shortdescription: "Chiết xuất dầu dừa tự nhiên",
    images: ["https://tse3.mm.bing.net/th/id/OIP.Rnp6ltEe7vnuvdQgknx33wHaFA?rs=1&pid=ImgDetMain&o=7&rm=3"],
    specifications: [{ label: "Thương hiệu", value: "Milaganics" }],
    variants: [{ size: "4g", salePrice: 69000, price: 90000, stock: 100, image: "https://tse3.mm.bing.net/th/id/OIP.Rnp6ltEe7vnuvdQgknx33wHaFA?rs=1&pid=ImgDetMain&o=7&rm=3" }]
  },
  {
    name: "Sáp Tẩy Trang Banila Co Original 100ml", brand: "Banila Co", price: 350000, salePrice: 299000, rating: 4.9, sold: 3200,
    description: "Tẩy trang Banila Co Clean It Zero", shortdescription: "Sáp tẩy trang làm sạch sâu",
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908"],
    specifications: [{ label: "Thương hiệu", value: "Banila Co" }],
    variants: [{ size: "100ml", salePrice: 299000, price: 350000, stock: 100, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908" }]
  },
  {
    name: "Sữa Rửa Mặt Acnes Creamy Wash 100g", brand: "Acnes", price: 95000, salePrice: 79000, rating: 4.6, sold: 4100,
    description: "Sữa Rửa Mặt Cho Da Mụn Acnes", shortdescription: "Giảm nhờn, ngừa mụn",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883"],
    specifications: [{ label: "Thương hiệu", value: "Acnes" }],
    variants: [{ size: "100g", salePrice: 79000, price: 95000, stock: 100, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883" }]
  },
  {
    name: "Kem Chống Nắng Skin Aqua UV Super Moisture Gel 80g", brand: "Skin Aqua", price: 210000, salePrice: 179000, rating: 4.8, sold: 2800,
    description: "Kem chống nắng siêu ẩm Skin Aqua", shortdescription: "Bảo vệ tối ưu, cấp nước cho da",
    images: ["https://images.unsplash.com/photo-1601049676869-702ea24cfd58"],
    specifications: [{ label: "Thương hiệu", value: "Skin Aqua" }],
    variants: [{ size: "80g", salePrice: 179000, price: 210000, stock: 100, image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58" }]
  },
  {
    name: "Nước Tẩy Trang Garnier Micellar Water 400ml", brand: "Garnier", price: 230000, salePrice: 189000, rating: 4.7, sold: 5000,
    description: "Nước tẩy trang Garnier Micellar Water an toàn dịu nhẹ", shortdescription: "Tẩy trang dịu nhẹ cho mọi loại da",
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b"],
    specifications: [{ label: "Thương hiệu", value: "Garnier" }],
    variants: [{ size: "400ml", salePrice: 189000, price: 230000, stock: 100, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b" }]
  },
  {
    name: "Serum The Ordinary Niacinamide 10% + Zinc 30ml", brand: "The Ordinary", price: 320000, salePrice: 279000, rating: 4.9, sold: 6200,
    description: "Kháng viêm, giảm mụn, sáng da The Ordinary", shortdescription: "Niacinamide giúp thu nhỏ lỗ chân lông",
    images: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"],
    specifications: [{ label: "Thương hiệu", value: "The Ordinary" }],
    variants: [{ size: "30ml", salePrice: 279000, price: 320000, stock: 100, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd" }]
  }
];

async function main() {
  console.log("Start seeding...");
  console.log("Prisma models found:", Object.keys(prisma).filter(k => !k.startsWith("$") && !k.startsWith("_")));

  const generateSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  for (const b of brandsData) {
    const slug = generateSlug(b.name);
    let logoId = null;
    let bannerId = null;

    if (b.logo) {
      const img = await prisma.image.create({ data: { url: b.logo } });
      logoId = img.id;
    }
    if (b.banner) {
      const img = await prisma.image.create({ data: { url: b.banner } });
      bannerId = img.id;
    }

    const existingBrand = await prisma.brand.findFirst({ where: { name: b.name } });
    if (!existingBrand) {
      await prisma.brand.create({
        data: { name: b.name, slug, logoId, bannerId },
      });
    }
  }

  for (const c of categoriesData) {
    const slug = generateSlug(c.name);
    const existing = await prisma.category.findFirst({ where: { name: c.name } });
    if (!existing) {
      let imageId = null;
      if (c.image) {
        const img = await prisma.image.create({ data: { url: c.image } });
        imageId = img.id;
      }
      await prisma.category.create({
        data: {
          name: c.name,
          slug,
          imageId,
        },
      });
    }
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  for (const p of productsData) {
    const brand = brands.find((br) => br.name === p.brand);
    const categoryId = categories.length > 0 ? categories[Math.floor(Math.random() * categories.length)].id : null;

    const existingProduct = await prisma.product.findFirst({ where: { name: p.name } });
    
    if (!existingProduct) {
      const slug = generateSlug(p.name);
      
      const created = await prisma.product.create({
        data: {
          name: p.name,
          slug,
          price: p.price,
          salePrice: p.salePrice,
          rating: p.rating,
          sold: p.sold,
          brandId: brand?.id,
          categoryId: categoryId,
          short_description: p.shortdescription,
          long_description: p.description,
          specifications: p.specifications,
        },
      });

      for (let i = 0; i < p.images.length; i++) {
        const url = p.images[i];
        const img = await prisma.image.create({ data: { url } });
        await prisma.productImage.create({
          data: {
            productId: created.id,
            imageId: img.id,
            order: i
          }
        });
      }

      for (const v of p.variants) {
        let varImageId = null;
        if (v.image) {
           const vImg = await prisma.image.create({ data: { url: v.image } });
           varImageId = vImg.id;
        }

        await prisma.productVariant.create({
          data: {
            productId: created.id,
            price: v.price || p.price,
            salePrice: v.salePrice || p.salePrice,
            color: v.color ?? null,
            size: v.size ?? null,
            imageId: varImageId,
          }
        });
      }
    }
  }

  // Seed User for testing Login
  const testEmail = "admin@gmail.com";
  const existingUser = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!existingUser) {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await prisma.user.create({
      data: {
        full_name:"nguyen manh 2.0",
        email: testEmail,
        password_hash: hashedPassword,
        phone: "0123456789",
        role: "ADMIN"
      }
    });

    // Seed addresses for the test user
    await prisma.address.createMany({
      data: [
        {
          userId: user.id,
          address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
          lat: 10.7769,
          lon: 106.7009,
          isDefault: true
        },
        {
          userId: user.id,
          address: "456 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
          lat: 10.7625,
          lon: 106.6829,
          isDefault: false
        }
      ]
    });
    console.log(`Seeded test user and addresses: ${testEmail} / 123456`);
  } else {
    console.log(`Test user ${testEmail} already exists.`);
  }

  // === SEED PURCHASE ORDERS ===
  console.log("Seeding Purchase Orders...");
  const poCount = await prisma.purchaseOrder.count();
  if (poCount === 0) {
    const brands = await prisma.brand.findMany({ take: 2 });
    const b1 = brands[0];
    const b2 = brands[1] || b1;

    const allVariants = await prisma.productVariant.findMany({ take: 5 });
    if (allVariants.length >= 2 && b1) {
      const v1 = allVariants[0];
      const v2 = allVariants[1];

      // DRAFT PO
      await prisma.purchaseOrder.create({
        data: {
          code: `PO-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-0001`,
          brandId: b1.id,
          totalAmount: 15000000,
          status: "DRAFT",
          note: "Nhập đợt mỹ phẩm tháng 10",
          items: {
            create: [
              { variantId: v1.id, orderedQty: 50, costPrice: 200000 },
              { variantId: v2.id, orderedQty: 25, costPrice: 200000 }
            ]
          }
        }
      });

      // CONFIRMED PO (For testing Export)
      await prisma.purchaseOrder.create({
        data: {
          code: `PO-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-0002`,
          brandId: b2.id,
          status: "CONFIRMED",
          totalAmount: 25000000,
          items: {
            create: [
              { variantId: v2.id, orderedQty: 250, costPrice: 100000 }
            ]
          }
        }
      });
      console.log("Seeded 2 Purchase Orders (1 DRAFT, 1 CONFIRMED).");
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
