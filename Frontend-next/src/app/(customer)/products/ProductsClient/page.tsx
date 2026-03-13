"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Checkbox, Radio } from "antd";
import type { BreadcrumbProps } from "antd";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import ProductListSection from "../components/ProductListSection";

import { ProductPagination } from "@/src/@core/type/Product";
import { customerCategories } from "@/src/@core/http/routes/customer-categories";
import { getProducts } from "@/src/services/customer/product.service";

type Props = {
  initialData: ProductPagination;
};

export default function ProductsClient({ initialData }: Props) {

  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get("category");

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);

  const { data, isLoading, isValidating } = useFetchSWR<ProductPagination>(
    ["products", page, pageSize],
    () => getProducts({ page, pageSize }),
    {
      fallbackData: initialData
    }
  );

  const loading = isLoading || isValidating;

  const productsdata = data?.products ?? [];
  const total = data?.total ?? 0;

  const parentCategory = customerCategories.find(
    (c) => c.slug === categorySlug
  );

  const parentOfChild = customerCategories.find((c) =>
    c.children?.some((child) => child.slug === categorySlug)
  );

  const childCategory = parentOfChild?.children?.find(
    (child) => child.slug === categorySlug
  );

  const currentCategory = parentCategory || childCategory;

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

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 border rounded-xl p-4 bg-white h-fit">

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Danh mục</h3>

            <div className="flex flex-col gap-2">
              {!categorySlug &&
                customerCategories
                  .filter(
                    (cat) =>
                      cat.name !== "Trang chủ" && cat.name !== "Sản phẩm"
                  )
                  .map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() =>
                        router.push(`/products?category=${cat.slug}`)
                      }
                      className="text-left hover:text-brand-600"
                    >
                      {cat.name}
                    </button>
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
            {/* Brand */} <div className="border-t pt-4"> <h3 className="font-semibold mb-3">Thương hiệu</h3> <Checkbox.Group className="flex flex-col gap-2"> <Checkbox value="apple">Apple</Checkbox> <Checkbox value="samsung">Samsung</Checkbox> <Checkbox value="xiaomi">Xiaomi</Checkbox> <Checkbox value="sony">Sony</Checkbox> <Checkbox value="lg">LG</Checkbox> </Checkbox.Group> </div> {/* Rating */} <div className="border-t pt-4"> <h3 className="font-semibold mb-3">Đánh giá</h3> <Checkbox.Group className="flex flex-col gap-2"> <Checkbox value="1">1 sao</Checkbox> <Checkbox value="2">2 sao</Checkbox> <Checkbox value="3">3 sao</Checkbox> <Checkbox value="4">4 sao</Checkbox> <Checkbox value="5">5 sao</Checkbox> </Checkbox.Group> </div>    
        </aside>
        {/* Product list */}
        <ProductListSection
          products={productsdata}
          total={total}
          loading={loading}
        />
      </div>
      {/* Recommended */} <div className="mt-3.5"> <h3 className="text-lg font-semibold mb-4">Sản phẩm dành cho bạn</h3> <ProductListSection products={productsdata} total={total} loading={loading} /> </div>
    </div>
  );
}