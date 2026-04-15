import { getProductDetail, getRelatedProducts, getBrandProducts } from "@/src/services/customer/product/product.service";
import ProductDetailUI from "./components/ProductDetailUI";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function ProductDataWrapper({ id }: { id: string }) {
  const product = await getProductDetail(id);
  
  const [relatedProducts, brandProducts] = await Promise.all([
    getRelatedProducts(id, 6),
    product?.brand?.id ? getBrandProducts(product.brand.id, id, 6) : Promise.resolve([])
  ]);
  
  return <ProductDetailUI product={product} relatedProducts={relatedProducts} brandProducts={brandProducts} />;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDataWrapper id={id} />;
}
