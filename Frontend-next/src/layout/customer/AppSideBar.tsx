"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Category } from "@/src/@core/type/category";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
};

export default function AppSideBar({ open, onClose, categories }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 h-full w-[260px]
        bg-white dark:bg-gray-900
        shadow-lg z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:hidden
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col p-4 gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.path}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}