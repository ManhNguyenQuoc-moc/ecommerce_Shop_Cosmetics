export type Product = {
  id: string;
  variantId?: string;
  name: string;
  brand: { id: string; name: string } | string;
  category: { id: string; name: string } | string;
  price: number;
  salePrice?: number;
  image: string;
  rating?: number;
  sold?: number;
};

export type ProductPagination = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
};

export type ProductVariant = {
  id: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  brand: { id: string; name: string } | string;
  category: { id: string; name: string } | string;
  long_description: string;
  short_description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  commentCount: number;
  sold: number;
  priceRange: {
    min: number;
    max: number;
  };
  totalStock: number;
  variants: ProductVariant[];
  specifications: {
    label: string;
    value: string;
  }[];
};