import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Ticket, Layers, Award } from "lucide-react";

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
    name: "Variants",
    path: "/admin/variants",
    icon: Layers,
  },
  {
    name: "Rewards",
    path: "/admin/rewards",
    icon: Award,
  },
  {
    name: "Vouchers",
    path: "/admin/discounts",
    icon: Ticket,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];