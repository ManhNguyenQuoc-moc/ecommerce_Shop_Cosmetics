"use client";

import React from "react";
import { Dropdown } from "antd";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export type SubItem = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

interface ChildProps {
  className?: string;
  variant?: string;
  children?: React.ReactNode;
}

export type AntDropdownProps = {
  item: {
    subItems: SubItem[];
  };
  children: React.ReactElement<ChildProps>;
};

export default function AntDropdown({ item, children }: AntDropdownProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

  const isSubItemActive = item.subItems?.some((sub) => currentPath === sub.path);

  const menuItems = item.subItems.map((sub, index) => {
    const isActive = currentPath === sub.path;

    return {
      key: index.toString(),
      label: sub.onClick ? (
        <div onClick={sub.onClick} className="block px-2 py-1 cursor-pointer hover:bg-brand-50">
          <div className="flex items-center">
            {sub.icon && <span className="m-2">{sub.icon}</span>}
            <span>{sub.name}</span>
          </div>
        </div>
      ) : (
        <Link
          href={sub.path || "#"}
          className={`block px-3 py-2 rounded-md transition-colors ${
            isActive 
              ? "text-blue-600 font-bold" 
              : "text-gray-600 hover:text-blue-50"
          }`}
        >
          <div className="flex items-center">
            {sub.icon && <span className="m-2">{sub.icon}</span>}
            <span>{sub.name}</span>
          </div>
        </Link>
      ),
    };
  });

  return (
    <Dropdown 
      menu={{ items: menuItems }} 
      trigger={["hover"]}
      placement="bottomLeft"
      classNames={{ root: "min-w-[160px]" }}
    >
      <div className="inline-block cursor-pointer">
        {React.cloneElement(children, {
          className: `${children.props.className || ""} ${isSubItemActive ? "!text-[var(--color-brand-600)]" : ""}`,
          variant: isSubItemActive ? "primary" : children.props.variant,
        })}
      </div>
    </Dropdown>
  );
}