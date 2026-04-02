import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../config/prisma";
import { POPriority, POStatus, Role, ItemStatus, ProductStatus } from "@prisma/client";

/** 
 * SEEDING SCRIPT
 * Version 2.0 (Refactored)
 * Flow: 
 * 1. Base Entities: Images -> Brands -> Categories
 * 2. Product Entities: Products -> Variants -> ProductImages
 * 3. User Entities: Users -> Addresses
 * 4. Inventory Entities: PurchaseOrders -> Batches -> StockTransactions
 */

const generateSlug = (str: string) => 
  str.toLowerCase()
    .trim()
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a")
    .replace(/[éèẻẽẹêếềểễệ]/g, "e")
    .replace(/[íìỉĩị]/g, "i")
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[úùủũụưứừửữự]/g, "u")
    .replace(/[ýỳỷỹỵ]/g, "y")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function main() {
  console.log("🚀 Starting database seeding (V2)...");

  // 1. BASE ENTITIES: IMAGES
  console.log("🖼️ Seeding Images...");
  const placeholderImages = [
    { url: "/images/main/brands/loreal-logo.jpg", alt: "Loreal Logo" },
    { url: "/images/main/brands/cocoon-logo.jpg", alt: "Cocoon Logo" },
    { url: "/images/main/brands/dove-logo.jpg", alt: "Dove Logo" },
    { url: "/images/main/brands/bioderma-logo.jpg", alt: "Bioderma Logo" },
    { url: "https://media.hasaki.vn/wysiwyg/HaNguyen1/kem-rua-mat-hada-labo-duong-am-toi-uu-cho-moi-loai-da-80g_2.jpg", alt: "Face wash category" },
    { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348", alt: "Lipstick product" },
    { url: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6", alt: "Serum product" },
  ];

  for (const img of placeholderImages) {
    await prisma.image.upsert({
      where: { id: generateSlug(img.url) }, // Mock ID for consistent seeding
      update: {},
      create: { id: generateSlug(img.url), url: img.url, altText: img.alt },
    });
  }

  // 2. BASE ENTITIES: BRANDS
  console.log("🏷️ Seeding Brands...");
  const brandsData = [
    { name: "Loreal" }, { name: "Cocoon" }, { name: "Dove" }, { name: "Bioderma" }, 
    { name: "LipIce" }, { name: "Dior" }, { name: "Estee Lauder" }, { name: "The Ordinary" }
  ];

  for (const b of brandsData) {
    await prisma.brand.upsert({
      where: { slug: generateSlug(b.name) },
      update: {},
      create: { 
        name: b.name, 
        slug: generateSlug(b.name), 
        description: `Thương hiệu mỹ phẩm ${b.name} cao cấp.` 
      },
    });
  }

  // 3. BASE ENTITIES: CATEGORIES
  console.log("📂 Seeding Categories...");
  const categoriesData = [
    { name: "Sữa rửa mặt" }, { name: "Serum" }, { name: "Toner" }, 
    { name: "Kem dưỡng ẩm" }, { name: "Son môi" }, { name: "Nước tẩy trang" }
  ];

  for (const c of categoriesData) {
    await prisma.category.upsert({
      where: { slug: generateSlug(c.name) },
      update: {},
      create: { 
        name: c.name, 
        slug: generateSlug(c.name), 
        description: `Danh mục các sản phẩm ${c.name}.` 
      },
    });
  }

  // 4. PRODUCT ENTITIES: PRODUCTS & VARIANTS
  console.log("🧴 Seeding Products & Variants...");
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  const productsToSeed = [
    {
      name: "Serum The Ordinary Niacinamide 10% + Zinc 1%",
      brandName: "The Ordinary",
      categoryName: "Serum",
      price: 320000,
      salePrice: 280000,
      rating: 4.8,
      sold: 1200,
      shortDescription: "Serum kiềm dầu và giảm mụn hiệu quả.",
      longDescription: "Serum với nồng độ Niacinamide cao giúp cải thiện làn da dầu mụn, thu nhỏ lỗ chân lông và làm đều màu da.",
      variants: [
        { size: "30ml", color: "Tự nhiên", sku: "TO-NIA-30ML", price: 320000, salePrice: 280000, costPrice: 150000 },
        { size: "60ml", color: "Tự nhiên", sku: "TO-NIA-60ML", price: 550000, salePrice: 490000, costPrice: 280000 },
      ],
      imageUrl: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=500"
    },
    {
      name: "Son Dior Rouge 999 Velvet",
      brandName: "Dior",
      categoryName: "Son môi",
      price: 950000,
      salePrice: 890000,
      rating: 4.9,
      sold: 500,
      shortDescription: "Sắc đỏ huyền thoại từ nhà Dior.",
      longDescription: "Dòng son Rouge Dior nổi tiếng với chất son mướt mịn, màu chuẩn xác và thiết kế sang trọng.",
      variants: [
        { size: "Tiêu chuẩn", color: "999 Velvet", sku: "DIOR-999-V", price: 950000, salePrice: 890000, costPrice: 450000 },
        { size: "Tiêu chuẩn", color: "777 Satin", sku: "DIOR-777-S", price: 950000, salePrice: 890000, costPrice: 450000 },
      ],
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"
    }
  ];

  for (const p of productsToSeed) {
    const brand = brands.find(b => b.name === p.brandName);
    const category = categories.find(c => c.name === p.categoryName);

    const product = await prisma.product.upsert({
      where: { slug: generateSlug(p.name) },
      update: {},
      create: {
        name: p.name,
        slug: generateSlug(p.name),
        price: p.price,
        salePrice: p.salePrice,
        rating: p.rating,
        sold: p.sold,
        short_description: p.shortDescription,
        long_description: p.longDescription,
        brandId: brand?.id,
        categoryId: category?.id,
        status: ItemStatus.ACTIVE,
      },
    });

    // Seed Variants
    for (const v of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: {
          productId: product.id,
          sku: v.sku,
          price: v.price,
          salePrice: v.salePrice,
          costPrice: v.costPrice,
          size: v.size,
          color: v.color,
          status: ItemStatus.ACTIVE,
          statusName: ProductStatus.NEW
        },
      });
    }

    // Seed Product Image
    const img = await prisma.image.create({ data: { url: p.imageUrl, altText: p.name } });
    await prisma.productImage.create({
      data: { productId: product.id, imageId: img.id, order: 0 }
    });
  }

  // 5. USER ENTITIES: USERS & ADDRESSES
  console.log("👤 Seeding Users & Addresses...");
  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash("123456", 10);

  const adminEmail = "admin@gmail.com";
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      full_name: "SWT Admin Root",
      password_hash: hashedPassword,
      phone: "0999888777",
      role: Role.ADMIN,
      loyalty_points: 1000,
      is_verified: true
    },
  });

  await prisma.address.upsert({
    where: { id: "default-admin-addr" },
    update: {},
    create: {
      id: "default-admin-addr",
      userId: user.id,
      address: "123 Central Beauty St, Cosmetic City",
      isDefault: true
    }
  });

  // 6. INVENTORY ENTITIES: PURCHASE ORDERS
  console.log("📦 Seeding Purchase Orders (with Priority)...");
  const diorBrand = await prisma.brand.findUnique({ where: { slug: "dior" } });
  const ordinaryBrand = await prisma.brand.findUnique({ where: { slug: "the-ordinary" } });
  const variants = await prisma.productVariant.findMany();

  if (diorBrand && ordinaryBrand && variants.length >= 2) {
    const poData = [
      {
        code: `PO-${new Date().getFullYear()}0402-001`,
        brandId: diorBrand.id,
        status: POStatus.DRAFT,
        priority: POPriority.HIGH,
        note: "Hàng gấp bán hè, ưu tiên nhập sớm.",
        amount: 50000000,
        items: [
          { variantId: variants.find(v => v.sku === "DIOR-999-V")?.id || variants[0].id, qty: 100, cost: 450000 }
        ]
      },
      {
        code: `PO-${new Date().getFullYear()}0402-002`,
        brandId: ordinaryBrand.id,
        status: POStatus.CONFIRMED,
        priority: POPriority.NORMAL,
        note: "Hàng nhập kho định kỳ.",
        amount: 15000000,
        items: [
          { variantId: variants.find(v => v.sku === "TO-NIA-30ML")?.id || variants[1].id, qty: 100, cost: 150000 }
        ]
      },
      {
        code: `PO-${new Date().getFullYear()}0402-003`,
        brandId: diorBrand.id,
        status: POStatus.COMPLETED,
        priority: POPriority.LOW,
        note: "Đơn hàng mẫu.",
        amount: 890000,
        items: [
          { variantId: variants.find(v => v.sku === "DIOR-777-S")?.id || variants[2]?.id || variants[0].id, qty: 2, cost: 445000 }
        ]
      }
    ];

    for (const po of poData) {
      const existing = await prisma.purchaseOrder.findUnique({ where: { code: po.code } });
      if (!existing) {
        await prisma.purchaseOrder.create({
          data: {
            code: po.code,
            brandId: po.brandId,
            status: po.status,
            priority: po.priority,
            note: po.note,
            totalAmount: po.amount,
            items: {
              create: po.items.map(i => ({
                variantId: i.variantId,
                orderedQty: i.qty,
                costPrice: i.cost,
                receivedQty: po.status === POStatus.COMPLETED ? i.qty : 0
              }))
            }
          }
        });
      }
    }
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed!");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
