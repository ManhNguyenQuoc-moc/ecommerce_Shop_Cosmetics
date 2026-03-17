"use client";

import AntDropDown from "@/src/@core/component/AntD/AntDropDown";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";

export default function UserDropdown() {
  
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

 if (!currentUser) {
  const guestMenu = {
    name: "Tài khoản",
    subItems: [
      {
        name: "Đăng nhập",
        path: "/login",
      },
      {
        name: "Đăng ký",
        path: "/register",
      }
    ]
  };

  return (
    <AntDropDown item={guestMenu}>
      <div className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 cursor-pointer">
        <User className="text-black" size={26} />
      </div>
    </AntDropDown>
  );
}

  const userMenuItems = {
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
      <SWTAvatar size={36} shape="circle"  src={currentUser.avatar}>
      </SWTAvatar>
    </AntDropDown>
  );
}