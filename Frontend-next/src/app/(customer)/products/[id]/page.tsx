import { getProductDetail } from "@/src/services/customer/product.service";
import ProductDetailUI from "./ProductDetailUI";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function ProductDataWrapper({ id }: { id: string }) {
  const product = await getProductDetail(id);
  return <ProductDetailUI product={product} />;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDataWrapper id={id} />;
}