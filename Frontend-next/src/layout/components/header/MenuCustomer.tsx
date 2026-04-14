"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import AntDropDown from "@/src/@core/component/AntD/AntDropDown";
import { Category } from "@/src/services/models/category/category";

type Props = {
  categories: Category[];
};

export default function MenuCustomer({ categories }: Props) {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const router = useRouter();

  const categoryParam = searchParams.get("category");

  const currentPath = categoryParam
    ? `${pathname}?category=${categoryParam}`
    : pathname;

  const isActive = (category: Category) => {
    if (currentPath === category.path) return true;
    return category.children?.some((child) => child.path === currentPath);
  };

  const buttonBaseClass = `
    !flex !items-center !gap-1 !font-bold !text-sm
    !h-10 !px-4 !border-none !shadow-none
    !bg-transparent !outline-none
    transition-all duration-300
  `;
  return (
    <nav className="flex items-center justify-center gap-6">


      {categories.filter(c => c.name.toLowerCase() !== 'thương hiệu').map((category) => {
        const active = isActive(category);
        const button = (
          <SWTButton
            type="text"
            className={`${buttonBaseClass} ${active
              ? "!text-brand-500"
              : "!text-brand-900 hover:!text-brand-600"
              }`}
            onClick={() => router.push(category.path)}
          >
            <span className="relative py-1">
              {category.name}
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-brand-500 rounded-full transition-all duration-300 transform origin-left ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 opacity-50"}`} />
            </span>
          </SWTButton>
        );

        if (!category.children) {
          return <div key={category.slug}>{button}</div>;
        }

        return (
          <div key={category.slug} className="group relative">
            <AntDropDown
              item={{
                subItems: category.children.map((child) => ({
                  name: child.name,
                  path: child.path,
                  onClick: () => router.push(child.path),
                })),
              }}
            >
              {button}
            </AntDropDown>
          </div>
        );
      })}
      <div key="all-brands" className="group relative">
        <SWTButton
          type="text"
          className={`${buttonBaseClass} ${pathname === '/brands'
            ? "!text-brand-500"
            : "!text-brand-900 hover:!text-brand-600"
            }`}
          onClick={() => router.push('/brands')}
        >
          <span className="relative py-1">
            Thương hiệu
            <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-brand-500 rounded-full transition-all duration-300 transform origin-left ${pathname === '/brands' ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 opacity-50"}`} />
          </span>
        </SWTButton>
      </div>
    </nav>
  );
}