"use client"
import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";
import { useState, useEffect } from "react";
export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);
   const banners = [
    {
      title: "Discover Your Best Skin",
      subtitle: "Shop Our Latest Essentials",
      image:
        "https://media.hcdn.vn/hsk/17722580881772247996290-1772247502337-l-e1-bb-8ach-s-c4-82n-sale-th-c3-81ng-3-home-846x250.jpg",
    },
    {
      title: "Glow Naturally",
      subtitle: "Premium Skincare Collection",
      image:
        "https://media.hcdn.vn/hsk/17728610101772792156902-homecogia.jpg",
    },
    {
      title: "Glow Naturally",
      subtitle: "Premium Skincare Collection",
      image:
        "https://media.hcdn.vn/hsk/17728619011772620603224-homecogia.jpg",
    },
    {
      title: "Glow Naturally",
      subtitle: "Premium Skincare Collection",
      image:
        "https://media.hcdn.vn/hsk/17728611901772791420592-846x250.jpg",
    },
    {
      title: "Glow Naturally",
      subtitle: "Premium Skincare Collection",
      image:
        "https://media.hcdn.vn/hsk/17728616831772705621390-homecogia.jpg",
    },
    {
      title: "Glow Naturally",
      subtitle: "Premium Skincare Collection",
      image:
        "https://media.hcdn.vn/hsk/17728617971772680663150-home-8.jpg",
    },
  ];

const categories = [
  {
    name: "Sữa rửa mặt",
    image: "https://media.hasaki.vn/wysiwyg/HaNguyen1/kem-rua-mat-hada-labo-duong-am-toi-uu-cho-moi-loai-da-80g_2.jpg",
  },
  {
    name: "Toner / Nước hoa hồng",
    image: "https://tse3.mm.bing.net/th/id/OIP.SKhE4lieEB11sn5dZiTF9AHaFh?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Serum / Tinh chất",
    image: "https://th.bing.com/th/id/OIP.BtpjaSjaoZvk3_0xOXtg9AHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    name: "Kem dưỡng ẩm",
    image: "https://i0.wp.com/bloganchoi.com/wp-content/uploads/2023/03/kem-duong-am-ngai-cuu-peacholic-probiotics-calming-cream-scaled.jpg",
  },
  {
    name: "Kem chống nắng",
    image: "https://trang.store/wp-content/uploads/2022/09/kem-chong-nang-sinh-hoc-dr-anh-trang-store.jpg",
  },
  {
    name: "Mặt nạ dưỡng da",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
  },
  {
    name: "Tẩy trang",
    image: "https://tse2.mm.bing.net/th/id/OIP.2rjxqWvg20dyyYVFpEebBQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Tẩy tế bào chết",
    image: "https://product.hstatic.net/1000006063/product/sg-11134201-22120-ufyp9xq6oykv46_63f8a4b9e2a44a738ff68cc2bc905bc9_1024x1024.jpg",
  },
  {
    name: "Xịt khoáng",
    image: "https://cdn.tgdd.vn/Files/2022/04/16/1426154/xit-khoang-co-duong-am-khong-huong-dan-xit-khoang-1.jpg",
  },

  {
    name: "Son môi",
    image: "https://www.way.com.vn/vnt_upload/File/Image/Thuong_Hieu_Son_Moi_MOI.jpg",
  },
  {
    name: "Kem nền",
    image: "https://product.hstatic.net/200000198575/product/118_bff7a206413448f193c506b316a967da_master.jpg",
  },
  {
    name: "Phấn phủ",
    image: "https://th.bing.com/th/id/OIP.dwIi4UV7Cwd0D9L3PRaQFQHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    name: "Phấn má hồng",
    image: "https://tse2.mm.bing.net/th/id/OIP.o31CHPSMMH2dtWjIE13QIAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Kẻ mắt",
    image: "https://2momart.vn/photos/2momart/24092020/but-ke-mat-nuoc.jpg",
  },
  {
    name: "Mascara",
    image: "https://tse4.mm.bing.net/th/id/OIP._roeao7Lb6Gi-NUu-QzErQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Chì kẻ mày",
    image: "https://focallure.vn/wp-content/uploads/2023/06/but-ke-long-may-focallure-768x768.jpg",
  },

  {
    name: "Dầu gội",
    image: "https://th.bing.com/th/id/OIP.kfNaPFSQ29y8i7Xm4eOnagHaFH?w=262&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    name: "Dầu xả",
    image: "https://th.bing.com/th/id/R.5723fb3557a135044468114b08f694ba?rik=4HcLIT3OANvhdQ&pid=ImgRaw&r=0",
  },
  {
    name: "Ủ tóc",
    image: "https://classic.vn/wp-content/uploads/2023/05/cach-u-toc-hieu-qua-tai-nha-cho-toc-mem-mai-suon-muot-2.webp",
  },
  {
    name: "Tinh dầu dưỡng tóc",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80",
  },

  {
    name: "Sữa tắm",
    image: "https://images.unsplash.com/photo-1585238342028-4b6f1d7d3b9a?w=400&q=80",
  },
  {
    name: "Kem dưỡng thể",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
  },
  {
    name: "Tẩy tế bào chết body",
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80",
  },
  {
    name: "Lăn khử mùi",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6c?w=400&q=80",
  },

  {
    name: "Nước hoa nữ",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
  },
  {
    name: "Nước hoa nam",
    image: "https://images.unsplash.com/photo-1615634262417-3c0c4c7d8c14?w=400&q=80",
  },
];

const products = [
  {
    name: "Serum Vitamin C dưỡng sáng da",
    price: 250000,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
  },
  {
    name: "Kem chống nắng SPF50+",
    price: 320000,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&q=80",
  },
  {
    name: "Son lì cao cấp",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80",
  },
  {
    name: "Sữa rửa mặt dịu nhẹ",
    price: 150000,
    image:
      "https://images.unsplash.com/photo-1608248597269-f99d160bfcbc?w=500&q=80",
  },
  {
    name: "Kem dưỡng ẩm ban đêm",
    price: 290000,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80",
  },
];

const brands = [
  {
    name: "Innisfree",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Innisfree-logo.png",
  },
  {
    name: "La Roche Posay",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/La_Roche-Posay_logo.png",
  },
  {
    name: "CeraVe",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/7/7f/CeraVe_logo.png",
  },
  {
    name: "Laneige",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2b/Laneige_logo.png",
  },
  {
    name: "Dior",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Dior_Logo.svg",
  },
  {
    name: "Chanel",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Chanel_logo_interlocking_cs.svg",
  },
];
  return (
    <div className="space-y-10 ">
      <HeroBanner banners={banners} loading={isLoading} />
      <CategorySection categories={categories} loading={isLoading} />
      <ProductSection
        title="Sản phẩm nổi bật"
        products={products}
      />
      <BrandSection brands={brands} />
    </div>
  );
}