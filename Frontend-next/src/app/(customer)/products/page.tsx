import ProductsClient from "./ProductsClient";
import { getProducts } from "@/src/services/customer/product/product.service";
import { getServerBrands, getServerCategories } from "@/src/services/customer/home/customer.service";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    category?: string;
    brandId?: string;
  }>;
};

async function ProductsDataWrapper({ params }: { params: any }) {
  const [initialData, initialCategories, initialBrands] = await Promise.all([
    getProducts(params),
    getServerCategories(),
    getServerBrands(1, 1000),
  ]);

  return (
    <ProductsClient 
      initialData={initialData} 
      initialCategories={initialCategories}
      initialBrands={initialBrands}
    />
  );
}

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const pageSize = Number(resolvedSearchParams.pageSize ?? 9);
  
  const params: any = { page, pageSize };
  if (resolvedSearchParams.category) params.category = resolvedSearchParams.category;
  if (resolvedSearchParams.brandId) params.brandId = resolvedSearchParams.brandId;

  return (
    <ProductsDataWrapper params={params} />
  );
}