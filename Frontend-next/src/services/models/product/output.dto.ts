// product.output.dto.ts
export interface ProductListItemDto {
  id: string;
  slug: string;
  name: string;
  brand: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  image: string | null;

  price: number;
  salePrice: number | null;

  minPrice?: number;
  maxPrice?: number;

  sold: number;
  stock: number;

  status: string;
  createdAt: string;
  variantId?: string;
}

export interface ProductListResponseDto {
  products: ProductListItemDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;

  brand?: { id: string; name: string; slug?: string } | null;
  category?: { id: string; name: string; slug?: string } | null;

  brandId: string;
  categoryId: string;

  status: string;
  statusRaw: "ACTIVE" | "HIDDEN" | "STOPPED";
  price: number;
  salePrice: number | null;

  description?: string;
  short_description?: string;
  long_description?: string;

  images: string[];

  productImages: {
    id: string;
    productId: string;
    imageId: string;
    order: number;
    image: {
      id: string;
      url: string;
    };
  }[];

  rating: number;
  reviewCount: number;
  commentCount: number;

  sold: number;
  totalStock: number;

  priceRange: {
    min: number;
    max: number;
  };

  variants: {
    id: string;
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number | null;
    costPrice?: number;
    stock: number;
    image?: string | null;
    imageId?: string | null;
    soldCount: number;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
  }[];

  specifications: {
    label: string;
    value: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      id: string;
      full_name: string;
    };
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantDto {
  id: string;
  productId: string;
  productName?: string;
  name: string;
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
  brand: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  status: string;
  productStatus?: string;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
  costPrice?: number;
  createdAt: string;
}
export interface VariantListResponseDto {
  variants: ProductVariantDto[];
  total: number;
  page: number;
  pageSize: number;
}
export interface VariantDetailDto {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number;
  stock: number;
  image?: string | null;
  imageId?: string | null;
  statusName: string;
  status: string;
  statusRaw: string;
  
  batches: {
    id: string;
    batchNumber: string;
    expiryDate: string;
    manufacturingDate?: string | null;
    quantity: number;
    costPrice: number;
    totalIn: number;
    totalOut: number;
    createdAt: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
}
