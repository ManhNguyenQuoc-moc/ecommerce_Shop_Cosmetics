export type Category = {
  name: string;
  slug: string;
  path: string;
  children?: Category[];
};

export const customerCategories: Category[] = [
  {
    name: "Trang chủ",
    slug: "home",
    path: "/",
  },
  {
    name: "Sản phẩm",
    slug: "san-pham",
    path: "/products",
  },
  {
    name: "Chăm sóc da",
    slug: "cham-soc-da",
    path: "/products?category=cham-soc-da",
    children: [
      {
        name: "Sữa rửa mặt",
        slug: "sua-rua-mat",
        path: "/products?category=sua-rua-mat",
      },
      {
        name: "Tẩy trang",
        slug: "tay-trang",
        path: "/products?category=tay-trang",
      },
      {
        name: "Toner",
        slug: "toner",
        path: "/products?category=toner",
      },
      {
        name: "Serum",
        slug: "serum",
        path: "/products?category=serum",
      },
      {
        name: "Kem dưỡng",
        slug: "kem-duong",
        path: "/products?category=kem-duong",
      },
      {
        name: "Kem chống nắng",
        slug: "kem-chong-nang",
        path: "/products?category=kem-chong-nang",
      },
      {
        name: "Mặt nạ",
        slug: "mat-na",
        path: "/products?category=mat-na",
      },
      {
        name: "Tẩy tế bào chết",
        slug: "tay-te-bao-chet",
        path: "/products?category=tay-te-bao-chet",
      },
    ],
  },

  {
    name: "Trang điểm",
    slug: "trang-diem",
    path: "/products?category=trang-diem",
    children: [
      {
        name: "Son môi",
        slug: "son-moi",
        path: "/products?category=son-moi",
      },
      {
        name: "Kem nền",
        slug: "kem-nen",
        path: "/products?category=kem-nen",
      },
      {
        name: "Phấn phủ",
        slug: "phan-phu",
        path: "/products?category=phan-phu",
      },
      {
        name: "Phấn má",
        slug: "phan-ma",
        path: "/products?category=phan-ma",
      },
      {
        name: "Kẻ mắt",
        slug: "ke-mat",
        path: "/products?category=ke-mat",
      },
      {
        name: "Mascara",
        slug: "mascara",
        path: "/products?category=mascara",
      },
      {
        name: "Chì kẻ mày",
        slug: "chi-ke-may",
        path: "/products?category=chi-ke-may",
      },
    ],
  },

  {
    name: "Chăm sóc tóc",
    slug: "cham-soc-toc",
    path: "/products?category=cham-soc-toc",
    children: [
      {
        name: "Dầu gội",
        slug: "dau-goi",
        path: "/products?category=dau-goi",
      },
      {
        name: "Dầu xả",
        slug: "dau-xa",
        path: "/products?category=dau-xa",
      },
      {
        name: "Ủ tóc",
        slug: "u-toc",
        path: "/products?category=u-toc",
      },
      {
        name: "Tinh dầu dưỡng tóc",
        slug: "tinh-dau-duong-toc",
        path: "/products?category=tinh-dau-duong-toc",
      },
    ],
  },

  {
    name: "Chăm sóc cơ thể",
    slug: "cham-soc-co-the",
    path: "/products?category=cham-soc-co-the",
    children: [
      {
        name: "Sữa tắm",
        slug: "sua-tam",
        path: "/products?category=sua-tam",
      },
      {
        name: "Kem dưỡng thể",
        slug: "kem-duong-the",
        path: "/products?category=kem-duong-the",
      },
      {
        name: "Tẩy tế bào chết body",
        slug: "tay-te-bao-chet-body",
        path: "/products?category=tay-te-bao-chet-body",
      },
      {
        name: "Lăn khử mùi",
        slug: "lan-khu-mui",
        path: "/products?category=lan-khu-mui",
      },
    ],
  },

  {
    name: "Nước hoa",
    slug: "nuoc-hoa",
    path: "/products?category=nuoc-hoa",
    children: [
      {
        name: "Nước hoa nữ",
        slug: "nuoc-hoa-nu",
        path: "/products?category=nuoc-hoa-nu",
      },
      {
        name: "Nước hoa nam",
        slug: "nuoc-hoa-nam",
        path: "/products?category=nuoc-hoa-nam",
      },
    ],
  },

  {
    name: "Thương hiệu",
    slug: "thuong-hieu",
    path: "/brands",
  },
];