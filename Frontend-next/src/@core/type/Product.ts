export type Product = {
  id: string;
  name: string;
  brand: string;
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

export type ProductDetail = {
  id: string;
  name: string;
  brand: string;
  description: string;

  price: number;
  salePrice?: number;

  images: string[];

  rating: number;
  reviewCount: number;
  sold: number;

  stock: number;

  variants?: {
    color?: string;
    size?: string;
  }[];

  specifications?: {
    label: string;
    value: string;
  }[];
};