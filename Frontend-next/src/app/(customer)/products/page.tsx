
import ProductsClient from "./ProductsClient/page";
import { getProducts } from "@/src/services/customer/product.service";

export const revalidate = 60;

type Props = {
  searchParams: {
    page?: string;
    pageSize?: string;
    category?: string;
    brandId?: string;
  };
};

export default async function ProductsPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.pageSize ?? 9);
  
  const params: any = { page, pageSize };
  if (searchParams.category) params.category = searchParams.category;
  if (searchParams.brandId) params.brandId = searchParams.brandId;

  const initialData = await getProducts(params);

  return <ProductsClient initialData={initialData} />;
}