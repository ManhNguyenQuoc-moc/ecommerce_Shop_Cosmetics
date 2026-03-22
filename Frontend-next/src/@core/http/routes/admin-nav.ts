import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";

type NavItem = {
  name: string;
  path: string;
  icon: any; // Using 'any' or 'ElementType' for lucide icons
};

export const adminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];