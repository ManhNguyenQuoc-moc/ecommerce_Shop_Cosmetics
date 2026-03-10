"use client";

import AntDropDown from "@/src/@core/component/AntD/AntDropDown";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
type MenuItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type Menu = {
  name: string;
  subItems: MenuItem[];
};
export default function UserDropdown() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const userMenuItems: Menu = {
    name: "Tài khoản",
    subItems: [
      { name: "Trang cá nhân", path: "/profile", icon: <User size={16} /> },
      { name: "Giỏ hàng", path: "/cart", icon: <CreditCard size={16} /> },
      { name: "Lịch sử đơn hàng", path: "/profile/orders", icon: <Settings size={16} /> },
      { name: "Quản lý điểm thưởng", path: "/profile/points", icon: <Settings size={16} /> },
      { name: "Quản lý mã giảm giá", path: "/profile/vouchers", icon: <Settings size={16} /> },
      {
        name: "Đăng xuất",
        icon: <LogOut size={16} />,
        onClick: handleLogout,
      },
    ],
  };
  return (
    <AntDropDown item={userMenuItems}>
      <SWTAvatar size={36} shape = "circle">
      </SWTAvatar>
    </AntDropDown>
  );
}