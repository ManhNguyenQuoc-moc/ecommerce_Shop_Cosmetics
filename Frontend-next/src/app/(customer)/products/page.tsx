"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import type { BreadcrumbProps } from "antd";
import { Checkbox, Radio } from "antd";
import ProductListSection from "./components/ProductListSection";
import RecommendedProductsList from "./components/RecommendedProductsList";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { customerCategories } from "@/src/@core/http/routes/customer-categories";
import {getProducts} from "@/src/service/customer/mockProducts";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);

   useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const res = await getProducts(page, pageSize);
      setProducts(res.data);
      setTotal(res.total);

      setLoading(false);
    }
    fetchProducts();
  }, [page, pageSize]);

  // URL lấy theo slug
  const categorySlug = searchParams.get("category");

  // Tìm danh mục cha (nếu slug trên URL là của danh mục cha)
  const parentCategory = customerCategories.find(
    (c) => c.slug === categorySlug
  );

  // Tìm danh mục cha của danh mục con hiện tại
  const parentOfChild = customerCategories.find((c) =>
    c.children?.some((child) => child.slug === categorySlug)
  );

  // Tìm danh mục con hiện tại
  const childCategory = parentOfChild?.children?.find(
    (child) => child.slug === categorySlug
  );

  // Xác định danh mục hiện tại đang được chọn (cha hoặc con)
  const currentCategory = parentCategory || childCategory;

  // Cấu hình Breadcrumb
  const breadcrumbItems: BreadcrumbProps["items"] = [
    { title: "Trang chủ", href: "/" },
    { title: "Sản phẩm", href: "/products" },
  ];

  if (parentOfChild) {
    breadcrumbItems.push({
      title: parentOfChild.name,
      href: `/products?category=${parentOfChild.slug}`,
    });
  }

  if (currentCategory) {
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
        {/* Sidebar: Danh mục & Bộ lọc */}
        <aside className="col-span-12 md:col-span-3 border rounded-xl p-4 bg-white h-fit">
          {/* Block 1: Danh mục */}
          <div className="mb-6">
          <h3 className="font-semibold mb-3">Danh mục</h3>
          <div className="flex flex-col gap-2">
            {!categorySlug &&
              customerCategories
                .filter((cat) => cat.name !== "Trang chủ" && cat.name !== "Sản phẩm")
                .map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => router.push(`/products?category=${cat.slug}`)}
                    className="text-left hover:text-brand-600 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              {parentCategory &&
                parentCategory.children?.map((child) => (
                  <button
                    key={child.slug}
                    onClick={() => router.push(`/products?category=${child.slug}`)}
                    className="text-left hover:text-brand-600 transition-colors"
                  >
                    {child.name}
                  </button>
                ))}
              {parentOfChild &&
                parentOfChild.children?.map((sibling) => (
                  <button
                    key={sibling.slug}
                    onClick={() => router.push(`/products?category=${sibling.slug}`)}
                    className={`text-left hover:text-brand-600 transition-colors ${
                      sibling.slug === categorySlug
                        ? "text-brand-600 font-medium"
                        : ""
                    }`}
                  >
                    {sibling.name}
                  </button>
                ))}
            </div>
          </div>
          {/* Block 2: Lọc theo giá */}
          <div className="mb-6 border-t pt-4">
            <h3 className="font-semibold mb-3">Mức giá</h3>
            <Radio.Group className="flex flex-col gap-2">
              <Radio value="under_500">Dưới 500.000đ</Radio>
              <Radio value="500_to_1000">500.000đ - 1.000.000đ</Radio>
              <Radio value="1000_to_2000">1.000.000đ - 2.000.000đ</Radio>
              <Radio value="above_2000">Trên 2.000.000đ</Radio>
            </Radio.Group>
          </div>
          {/* Block 3: Lọc theo thương hiệu */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Thương hiệu</h3>
            <Checkbox.Group className="flex flex-col gap-2">
              <Checkbox value="apple">Apple</Checkbox>
              <Checkbox value="samsung">Samsung</Checkbox>
              <Checkbox value="xiaomi">Xiaomi</Checkbox>
              <Checkbox value="sony">Sony</Checkbox>
              <Checkbox value="lg">LG</Checkbox>
            </Checkbox.Group>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Thương hiệu</h3>
            <Checkbox.Group className="flex flex-col gap-2">
              <Checkbox value="apple">Apple</Checkbox>
              <Checkbox value="samsung">Samsung</Checkbox>
              <Checkbox value="xiaomi">Xiaomi</Checkbox>
              <Checkbox value="sony">Sony</Checkbox>
              <Checkbox value="lg">LG</Checkbox>
            </Checkbox.Group>
          </div>
            <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Đánh giá</h3>
            <Checkbox.Group className="flex flex-col gap-2">
              <Checkbox value="apple">1 sao</Checkbox>
              <Checkbox value="samsung">2 sao</Checkbox>
              <Checkbox value="xiaomi">3 sao</Checkbox>
              <Checkbox value="sony">4 sao</Checkbox>
              <Checkbox value="lg">5 sao</Checkbox>
            </Checkbox.Group>
          </div>
        </aside>
        {/* Product List Section */}
        <ProductListSection
        products={products}
        total={total}
        loading={loading}
          />
      </div>
      <div className ="mt-3.5">
        <h3>Sản phẩm dành cho bạn</h3>
         <ProductListSection
        products={products}
        total={total}
        loading={loading}
          />
      </div>
     
    </div>
  );
}