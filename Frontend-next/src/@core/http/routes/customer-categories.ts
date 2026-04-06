export type Category = {
  name: string;
  slug: string;
  path: string;
  children?: Category[];
};

// Cấu trúc Shell để định nghĩa các Nhóm lớn (Theme)
export const CATEGORY_THEMES = [
  {
    name: "Chăm sóc da",
    slug: "cham-soc-da",
    keywords: ["sữa rửa mặt", "tẩy trang", "mặt nạ", "chống nắng", "toner", "serum", "kem dưỡng", "tẩy tế bào chết"],
  },
  {
    name: "Trang điểm",
    slug: "trang-diem",
    keywords: ["trang điểm", "son môi", "kem nền", "phấn phủ", "phấn má", "kẻ mắt", "mascara", "chì kẻ mày"],
  },
  {
    name: "Chăm sóc tóc",
    slug: "cham-soc-toc",
    keywords: ["dầu gội", "dầu xả", "ủ tóc", "dưỡng tóc", "xịt dưỡng tóc"],
  },
  {
    name: "Chăm sóc cơ thể",
    slug: "cham-soc-co-the",
    keywords: ["sữa tắm", "dưỡng thể", "lăn khử mùi", "răng miệng"],
  },
  {
    name: "Nước hoa",
    slug: "nuoc-hoa",
    keywords: ["nước hoa"],
  },
];

/**
 * Hàm Helper để map dữ liệu phẳng từ API vào cấu trúc Tree dựa trên Themes
 */
export const getDynamicCategories = (apiCategories: any[]): Category[] => {
  const grouped: Category[] = [
    { name: "Trang chủ", slug: "home", path: "/" },
    { name: "Sản phẩm", slug: "san-pham", path: "/products" },
  ];

  // Khởi tạo các Theme cha
  const themeNodes = CATEGORY_THEMES.map(theme => ({
    name: theme.name,
    slug: theme.slug,
    path: `/products?category=${theme.slug}`,
    children: [] as Category[],
    keywords: theme.keywords
  }));

  // Phân loại từng category từ API vào các theme dựa trên keyword trong tên/slug
  apiCategories.forEach(apiCat => {
    const parentTheme = themeNodes.find(theme => 
      theme.keywords.some(k => 
        apiCat.name.toLowerCase().includes(k) || apiCat.slug.toLowerCase().includes(k)
      )
    );

    const newNode: Category = {
      name: apiCat.name,
      slug: apiCat.slug,
      path: `/products?category=${apiCat.slug}`
    };

    if (parentTheme) {
      parentTheme.children.push(newNode);
    } else {
      // Nếu không khớp nhóm nào, mặc định cho vào Chăm sóc da hoặc nhóm Khác nếu muốn
      themeNodes[0].children.push(newNode); 
    }
  });

  // Chỉ lấy những Theme có chứa danh mục con (Tránh hiện folder rỗng)
  const activeThemes = themeNodes
    .filter(t => t.children.length > 0)
    .map(({ keywords, ...rest }) => rest);

  grouped.push(...activeThemes);
  grouped.push({ name: "Thương hiệu", slug: "thuong-hieu", path: "/brands" });

  return grouped;
};

// Fallback tĩnh (Dùng cho lúc đang load hoặc lỗi)
export const customerCategories: Category[] = [
  { name: "Trang chủ", slug: "home", path: "/" },
  { name: "Sản phẩm", slug: "san-pham", path: "/products" },
  { name: "Chăm sóc da", slug: "cham-soc-da", path: "/products?category=cham-soc-da" },
  { name: "Trang điểm", slug: "trang-diem", path: "/products?category=trang-diem" },
  { name: "Thương hiệu", slug: "thuong-hieu", path: "/brands" },
];