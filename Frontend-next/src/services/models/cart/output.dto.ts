export interface CartItemOutputDto {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  price: number;
  originalPrice: number | null;
  salePrice: number | null;
  quantity: number;
  subTotal: number;
  image: string | null;
  brandName: string | null;
  stock: number;
  availableStock: number;
}

export interface CartOutputDto {
  id: string;
  userId: string;
  items: CartItemOutputDto[];
  totalAmount: number;
  totalItems: number;
  updatedAt: string;
}
