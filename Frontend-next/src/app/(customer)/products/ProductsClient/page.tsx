"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Checkbox, Radio } from "antd";
import type { BreadcrumbProps } from "antd";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import ProductListSection from "../components/ProductListSection";

import { PaginationResponse } from "@/src/services/models/common/PaginationResponse";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import { BrandResponseDto } from "@/src/services/customer/server-data";
import { customerCategories, getDynamicCategories, Category } from "@/src/@core/http/routes/customer-categories";
import { getProducts } from "@/src/services/customer/product.service";
import { useCustomerCategories } from "@/src/services/customer/category.service";
import { useCustomerBrands } from "@/src/services/customer/brand.service";
import SWTCheckboxGroup from "@/src/@core/component/AntD/SWTCheckboxGroup";

type Props = {
  initialData: PaginationResponse<ProductListItemDto>;
  initialCategories: CategoryResponseDto[];
  initialBrands: BrandResponseDto[];
};

export default function ProductsClient({ initialData, initialCategories, initialBrands }: Props) {

  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get("category");
  const brandId = searchParams.get("brandId");

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);
  
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const sortBy = searchParams.get("sortBy") ?? "newest";
  const isSale = searchParams.get("isSale") === "true";
  const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined;

  // Fetch dynamic categories with server-side fallback - Optimized for ISR
  const { categories: apiCategories } = useCustomerCategories({
    fallbackData: initialCategories,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  // Use categories for rendering dynamic tree - Memoized to prevent recalculation
  const dynamicCategories = React.useMemo(() => {
    return apiCategories && apiCategories.length > 0 
      ? getDynamicCategories(apiCategories) 
      : customerCategories;
  }, [apiCategories]);

  // Fetch brands with server-side fallback - Optimized for ISR
  const { brands: apiBrands } = useCustomerBrands(1, 100, {
    fallbackData: initialBrands,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  const { data, isLoading, isValidating } = useFetchSWR<PaginationResponse<ProductListItemDto>>(
    ["products", page, pageSize, categorySlug, brandId, minPrice, maxPrice, sortBy, isSale, rating],
    () => {
      const params: any = { page, pageSize, sortBy, flatten: true };
      if (categorySlug) params.category = categorySlug;
      if (brandId) params.brandId = brandId;
      if (minPrice !== undefined) params.minPrice = minPrice;
      if (maxPrice !== undefined) params.maxPrice = maxPrice;
      if (isSale) params.isSale = true;
      if (rating !== undefined) params.rating = rating;
      
      return getProducts(params);
    },
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const loading = !data && isLoading;
  const isFetching = isValidating;

  const productsdata = data?.data ?? [];
  const total = data?.total ?? 0;

  // Resolve dynamic category info - Memoized
  const resolved = React.useMemo(() => {
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
    return findCategory(dynamicCategories, categorySlug);
  }, [dynamicCategories, categorySlug]);

  const currentCategory = resolved?.current;
  const parentOfChild = resolved?.parent;

  // Memoize Breadcrumb Items to avoid re-renders
  const breadcrumbItems = React.useMemo(() => {
    const items: BreadcrumbProps["items"] = [
      { title: "Trang chủ", href: "/" },
      { title: "Sản phẩm", href: "/products" },
    ];

    if (parentOfChild && parentOfChild.slug !== 'san-pham') {
      items.push({
        title: parentOfChild.name,
        href: parentOfChild.path,
      });
    }

    if (currentCategory && currentCategory.slug !== 'san-pham') {
      items.push({
        title: currentCategory.name,
      });
    }

    return items;
  }, [parentOfChild, currentCategory]);
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
            <div className="flex flex-col gap-2">
              {[
                { label: "Tất cả", min: undefined, max: undefined, value: "all" },
                { label: "Dưới 500.000đ", min: 0, max: 500000, value: "0_500" },
                { label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000, value: "500_1000" },
                { label: "1.000.000đ - 2.000.000đ", min: 1000000, max: 2000000, value: "1000_2000" },
                { label: "Trên 2.000.000đ", min: 2000000, max: undefined, value: "2000_plus" },
              ].map((range) => {
                const isActive = range.value === "all" 
                  ? (minPrice === undefined && maxPrice === undefined)
                  : (minPrice === range.min && maxPrice === range.max);
                
                return (
                  <button
                    key={range.value}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (range.min !== undefined) params.set("minPrice", range.min.toString());
                      else params.delete("minPrice");
                      if (range.max !== undefined) params.set("maxPrice", range.max.toString());
                      else params.delete("maxPrice");
                      params.set("page", "1");
                      router.push(`${window.location.pathname}?${params.toString()}`);
                    }}
                    className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                      isActive ? "bg-brand-50 text-brand-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Sale Filter */}
          <div className="mb-6 border-t pt-4">
             <div className="flex items-center justify-between">
                <h3 className="font-semibold">Đang giảm giá</h3>
                <Checkbox 
                  checked={isSale}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.checked) params.set("isSale", "true");
                    else params.delete("isSale");
                    params.set("page", "1");
                    router.push(`${window.location.pathname}?${params.toString()}`);
                  }}
                />
             </div>
          </div>
          {/* Rating Filter */}
          <div className="mb-6 border-t pt-4">
             <h3 className="font-semibold mb-3">Đánh giá</h3>
             <div className="flex flex-col gap-1">
                {[5, 4, 3].map((star) => (
                   <button
                    key={star}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      if (rating === star) params.delete("rating");
                      else params.set("rating", star.toString());
                      params.set("page", "1");
                      router.push(`${window.location.pathname}?${params.toString()}`);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      rating === star ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                   >
                     <div className="flex text-yellow-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < star ? "★" : "☆"}</span>
                        ))}
                     </div>
                     <span className="text-xs">{star === 5 ? "" : "trở lên"}</span>
                   </button>
                ))}
             </div>
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
          sortBy={sortBy}
        />
      </div>
      {/* <div className="mt-3.5"> <h3 className="text-lg font-semibold mb-4">Sản phẩm dành cho bạn</h3> <ProductListSection products={productsdata} total={total} loading={loading} isFetching={isFetching} /> </div> */}
    </div>
  );
}