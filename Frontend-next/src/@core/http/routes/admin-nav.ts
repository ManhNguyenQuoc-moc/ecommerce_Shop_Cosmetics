import { LayoutDashboard, Package, ShoppingCart, Users, PackagePlus, Settings, NotebookText, Ticket, Layers, Award, Truck, PackageSearch, Shield } from "lucide-react";
import { ElementType } from "react";

type NavItem = {
  name: string;
  path: string;
  icon: ElementType; // Using 'any' or 'ElementType' for lucide icons
};

export const adminNavItems: NavItem[] = [
  {
    name: "Bảng điều khiển",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Danh mục & Nhóm",
    path: "/admin/categories",
    icon: NotebookText,
  },
  {
    name: "Sản phẩm",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Phiên bản sản phẩm",
    path: "/admin/variants",
    icon: Layers,
  },
   {
    name: "Nhà cung cấp",
    path: "/admin/suppliers",
    icon: PackagePlus,
  },
  {
    name: "Nhập hàng",
    path: "/admin/purchases",
    icon: Truck,
  },
  {
    name: "Quản lý tồn kho",
    path: "/admin/inventory",
    icon: PackageSearch,
  },
  {
    name: "Đơn hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Người dùng",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Điểm thưởng",
    path: "/admin/rewards",
    icon: Award,
  },
  {
    name: "Mã giảm giá",
    path: "/admin/discounts",
    icon: Ticket,
  },
  {
    name: "Cấu hình điểm",
    path: "/admin/settings/points",
    icon: Settings,
  },
  {
    name: "Quản lý Phân quyền",
    path: "/admin/rbac",
    icon: Shield,
  },
];