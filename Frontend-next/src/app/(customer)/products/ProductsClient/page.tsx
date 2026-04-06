"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Checkbox, Radio } from "antd";
import type { BreadcrumbProps } from "antd";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import ProductListSection from "../components/ProductListSection";

import { PaginationResponse } from "@/src/services/models/common/PaginationResponse";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { customerCategories, getDynamicCategories, Category } from "@/src/@core/http/routes/customer-categories";
import { getProducts } from "@/src/services/customer/product.service";
import { useCustomerCategories } from "@/src/services/customer/category.service";
import { useCustomerBrands } from "@/src/services/customer/brand.service";
import SWTCheckboxGroup from "@/src/@core/component/AntD/SWTCheckboxGroup";

type Props = {
  initialData: PaginationResponse<ProductListItemDto>;
};

export default function ProductsClient({ initialData }: Props) {

  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get("category");
  const brandId = searchParams.get("brandId");

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);

  // Fetch dynamic categories to use in filtering logic
  const { categories: apiCategories } = useCustomerCategories();
  const dynamicCategories = apiCategories && apiCategories.length > 0 
    ? getDynamicCategories(apiCategories) 
    : customerCategories;

  // Fetch brands for sidebar
  const { brands: apiBrands } = useCustomerBrands(1, 50);

  const { data, isLoading, isValidating } = useFetchSWR<PaginationResponse<ProductListItemDto>>(
    ["products", page, pageSize, categorySlug, brandId],
    () => {
      const params: any = { page, pageSize };
      if (categorySlug) params.category = categorySlug;
      if (brandId) params.brandId = brandId;
      return getProducts(params);
    },
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const loading = isLoading;
  const isFetching = isValidating;

  const productsdata = data?.data ?? [];
  const total = data?.total ?? 0;

  // Resolve breadcrumbs and selected category from dynamic tree
  const findCategory = (cats: Category[], slug: string | null): { current: Category, parent?: Category } | null => {
    if (!slug) return null;
    for (const cat of cats) {
      if (cat.slug === slug) return { current: cat };
      if (cat.children) {
        const child = cat.children.find(c => c.slug === slug);
        if (child) return { current: child, parent: cat };
      }
    }
    return null;
  };

  const resolved = findCategory(dynamicCategories, categorySlug);
  const currentCategory = resolved?.current;
  const parentOfChild = resolved?.parent;

  const breadcrumbItems: BreadcrumbProps["items"] = [
    { title: "Trang chủ", href: "/" },
    { title: "Sản phẩm", href: "/products" },
  ];

  if (parentOfChild && parentOfChild.slug !== 'san-pham') {
    breadcrumbItems.push({
      title: parentOfChild.name,
      href: parentOfChild.path,
    });
  }

  if (currentCategory && currentCategory.slug !== 'san-pham') {
    breadcrumbItems.push({
      title: currentCategory.name,
    });
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <SWTBreadcrumb items={breadcrumbItems} />

      <h1 className="text-2xl font-bold">
        {currentCategory ? currentCategory.name : "Danh sách sản phẩm"}
      </h1>

      <div className="grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 border rounded-xl p-4 bg-white h-fit">

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Danh mục</h3>

            <div className="flex flex-col gap-4">
              {dynamicCategories
                .filter(cat => cat.slug !== 'home' && cat.slug !== 'thuong-hieu')
                .map((cat: Category) => (
                  <div key={cat.slug}>
                    <button
                      onClick={() => router.push(cat.path)}
                      className={`font-semibold mb-2 block hover:text-brand-600 transition-colors ${categorySlug === cat.slug ? 'text-brand-600' : 'text-gray-900'}`}
                    >
                      {cat.name}
                    </button>
                    {cat.children && (
                      <div className="flex flex-col gap-1.5 ml-3">
                        {cat.children.map((child: Category) => (
                          <button
                            key={child.slug}
                            onClick={() => router.push(child.path)}
                            className={`text-sm text-left hover:text-brand-500 transition-colors ${categorySlug === child.slug ? 'text-brand-500 font-medium' : 'text-gray-600'}`}
                          >
                            • {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          {/* Price filter */}
          <div className="mb-6 border-t pt-4">
            <h3 className="font-semibold mb-3">Mức giá</h3>
            <Radio.Group className="flex flex-col gap-2">
              <Radio value="under_500">Dưới 500.000đ</Radio>
              <Radio value="500_to_1000">500.000đ - 1.000.000đ</Radio>
              <Radio value="1000_to_2000">1.000.000đ - 2.000.000đ</Radio>
              <Radio value="above_2000">Trên 2.000.000đ</Radio>
            </Radio.Group>
          </div>
          {/* Brand */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Thương hiệu</h3>
            <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              <SWTCheckboxGroup
                options={apiBrands.map((b: any) => ({ label: b.name, value: b.id }))}
                value={brandId ? brandId.split(",") : []}
                onChange={(values) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (values.length > 0) {
                    params.set("brandId", values.join(","));
                  } else {
                    params.delete("brandId");
                  }
                  router.push(`/products?${params.toString()}`);
                }}
              />
            </div>
          </div>
        </aside>
        {/* Product list */}
        <ProductListSection
          products={productsdata}
          total={total}
          loading={loading}
          isFetching={isFetching}
        />
      </div>
      {/* <div className="mt-3.5"> <h3 className="text-lg font-semibold mb-4">Sản phẩm dành cho bạn</h3> <ProductListSection products={productsdata} total={total} loading={loading} isFetching={isFetching} /> </div> */}
    </div>
  );
}