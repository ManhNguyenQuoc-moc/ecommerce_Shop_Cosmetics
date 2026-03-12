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