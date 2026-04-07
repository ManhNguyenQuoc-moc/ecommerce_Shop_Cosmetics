import { LayoutDashboard, Package, ShoppingCart, Users, PackagePlus, Settings, NotebookText, Ticket, Layers, Award, Truck, PackageSearch } from "lucide-react";
import { ElementType } from "react";

type NavItem = {
  name: string;
  path: string;
  icon: ElementType; // Using 'any' or 'ElementType' for lucide icons
};

export const adminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Categories & Groups",
    path: "/admin/categories",
    icon: NotebookText,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Variants",
    path: "/admin/variants",
    icon: Layers,
  },
   {
    name: "Suppliers",
    path: "/admin/suppliers",
    icon: PackagePlus,
  },
  {
    name: "Purchases",
    path: "/admin/purchases",
    icon: Truck,
  },
  {
    name: "Inventory",
    path: "/admin/inventory",
    icon: PackageSearch,
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
    name: "Rewards",
    path: "/admin/rewards",
    icon: Award,
  },
  {
    name: "Vouchers",
    path: "/admin/discounts",
    icon: Ticket,
  },
  // {
  //   name: "Settings",
  //   path: "/admin/settings",
  //   icon: Settings,
  // },
];