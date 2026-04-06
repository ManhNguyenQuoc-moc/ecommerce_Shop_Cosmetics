export interface VariantListItemDto {
  id: string;
  slug: string;
  productId: string;
  productName: string;
  name: string;
  brand: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  price: number;
  salePrice: number | null;
  costPrice: number | null;
  sku: string;
  color: string;
  size: string;
  soldCount: number;
  stock: number;
  image: string | null;
  status: string;        // e.g. "ACTIVE"
  productStatus: string; // e.g. "ACTIVE"
  statusName: string;    // e.g. "NEW"
  createdAt: Date;
  updatedAt: Date;
}
