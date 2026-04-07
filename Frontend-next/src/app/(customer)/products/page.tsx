import ProductsClient from "./ProductsClient/page";
import { getProducts } from "@/src/services/customer/product.service";
import { getServerBrands, getServerCategories } from "@/src/services/customer/server-data";

export const revalidate = 60;

type Props = {
  searchParams: {
    page?: string;
    pageSize?: string;
    category?: string;
    brandId?: string;
  };
};

async function ProductsDataWrapper({ params }: { params: any }) {
  const [initialData, initialCategories, initialBrands] = await Promise.all([
    getProducts(params),
    getServerCategories(),
    getServerBrands(1, 100),
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
  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.pageSize ?? 9);
  
  const params: any = { page, pageSize };
  if (searchParams.category) params.category = searchParams.category;
  if (searchParams.brandId) params.brandId = searchParams.brandId;

  return (
    <ProductsDataWrapper params={params} />
  );
}