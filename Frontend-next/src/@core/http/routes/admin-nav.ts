

type NavItem = {
  name: string;

  path: string;
};

export const adminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/admin",
  },
  {
    name: "Products",
    path: "/admin/products",
  },
  {
    name: "Orders",
    path: "/admin/orders",
  },
  {
    name: "Users",
    path: "/admin/users",
  },
];