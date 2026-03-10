import React from "react";
import ViewGridIcon from "../../component/SWTIcon/iconoir/view-grid";
import TaskListIcon from "../../component/SWTIcon/iconoir/task-list";
import UserCartIcon from "../../component/SWTIcon/iconoir/user-cart";
import GroupUserIcon from "../../component/SWTIcon/iconoir/group-user";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

export const adminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <ViewGridIcon variant="primary" />,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: <TaskListIcon variant="primary" />,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: <UserCartIcon variant="primary" />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <GroupUserIcon variant="primary" />,
  },
];