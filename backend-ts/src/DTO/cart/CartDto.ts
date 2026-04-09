import { CartItemDto } from "./CartItemDto";

export interface CartDto {
  id: string;
  userId: string;
  items: CartItemDto[];
  totalAmount: number;
  totalItems: number;
  updatedAt: Date;
}
