import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { ProductSmallItemDto } from "@/src/services/models/product/output.dto";
import { getRelatedProducts, getBrandProducts } from "@/src/services/customer/product/product.service";

/**
 * Hook to fetch related products for a product
 */
export const useRelatedProducts = (productId: string, limit: number = 4) => {
  const { data, isLoading, error, mutate } = useFetchSWR<ProductSmallItemDto[]>(
    productId ? [`products/${productId}/related`, limit] : null,
    () => getRelatedProducts(productId, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    relatedProducts: data || [],
    isLoading,
    error,
    mutate
  };
};

/**
 * Hook to fetch brand products
 */
export const useBrandProducts = (brandId: string, excludeProductId?: string, limit: number = 4) => {
  const { data, isLoading, error, mutate } = useFetchSWR<ProductSmallItemDto[]>(
    brandId ? [`products/brand/${brandId}`, excludeProductId, limit] : null,
    () => getBrandProducts(brandId, excludeProductId, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    brandProducts: data || [],
    isLoading,
    error,
    mutate
  };
};
