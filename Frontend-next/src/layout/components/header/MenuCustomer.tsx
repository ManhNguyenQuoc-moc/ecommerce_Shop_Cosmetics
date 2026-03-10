"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import AntDropDown from "@/src/@core/component/AntD/AntDropDown";
import { Category } from "@/src/@core/type/category";

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
    !flex !items-center !gap-1 !font-semibold !text-sm
    !h-10 !px-4 !border-none !shadow-none
    !outline-none focus:!outline-none active:!outline-none
    focus:!ring-0 active:!ring-0
    focus:!shadow-none active:!shadow-none
    transition-all
  `;
  
  return (
    <nav className="flex items-center justify-center gap-4">
      {categories.map((category) => {
        const active = isActive(category);

        const button = (
          <SWTButton
            variant={active ? "primary" : "outline"}
            className={`${buttonBaseClass} ${
              active
                ? "!text-brand-600" 
                : "!text-gray-700 hover:!text-brand-600"
            }`}
            onClick={() => router.push(category.path)}
          >
            <span className="relative">
              {category.name}
              {active && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-500 rounded-full" />
              )}
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
                })),
              }}
            >
              {button}
            </AntDropDown>
          </div>
        );
      })}
    </nav>
  );
}