export type Category = {
  name: string;
  slug: string;
  path: string;
  children?: Category[];
};

/**
 * Hàm Helper để map dữ liệu phẳng từ API vào cấu trúc Tree dựa trên CategoryGroup thực tế
 */
export const getDynamicCategories = (apiCategories: any[]): Category[] => {
  const grouped: Category[] = [
    { name: "Trang chủ", slug: "home", path: "/" },
    { name: "Sản phẩm", slug: "san-pham", path: "/products" },
  ];

  // Map để theo dõi các nhóm đã tạo
  const groupMap = new Map<string, Category>();

  // Duyệt qua tất cả category từ API
  apiCategories.forEach(apiCat => {
    const group = apiCat.categoryGroup;
    
    const newNode: Category = {
      name: apiCat.name,
      slug: apiCat.slug,
      path: `/products?category=${apiCat.slug}`
    };

    if (group) {
      if (!groupMap.has(group.id)) {
        groupMap.set(group.id, {
          name: group.name,
          slug: group.slug,
          path: `/products?category=${group.slug}`, // Truyền slug của Group để backend lọc recursive
          children: []
        });
      }
      groupMap.get(group.id)?.children?.push(newNode);
    } else {
      // Nếu không có nhóm, có thể cho vào một nhóm mặc định hoặc để ở cấp ngoài
      // Ở đây tôi giữ lại logic phân loại vào nhóm đầu tiên hoặc bạn có thể bỏ qua
      if (!groupMap.has('others')) {
         groupMap.set('others', {
           name: "Khác",
           slug: "khác",
           path: "/products",
           children: []
         });
      }
      groupMap.get('others')?.children?.push(newNode);
    }
  });

  // Chuyển Map thành mảng và thêm vào grouped
  const activeGroups = Array.from(groupMap.values()).filter(g => g.children && g.children.length > 0);
  
  // Sắp xếp: Ưu tiên hiển thị các nhóm có tên trong CATEGORY_THEMES cũ (để giữ thứ tự quen thuộc)
  const order = ["Chăm sóc da", "Trang điểm", "Chăm sóc tóc", "Chăm sóc cơ thể", "Nước hoa"];
  activeGroups.sort((a, b) => {
    const indexA = order.indexOf(a.name);
    const indexB = order.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  grouped.push(...activeGroups);
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