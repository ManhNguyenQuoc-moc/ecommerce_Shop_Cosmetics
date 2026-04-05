
import ProductsClient from "./ProductsClient/page";
import { getProducts } from "@/src/services/customer/product.service";

export const revalidate = 60;

type Props = {
  searchParams: {
    page?: string;
    pageSize?: string;
    category?: string;
  };
};

export default async function ProductsPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.pageSize ?? 9);

  const initialData = await getProducts({ page, pageSize });

  return <ProductsClient initialData={initialData} />;
}