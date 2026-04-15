import { get, post, put, del } from "../../../@core/utils/api";
import { AddToCartInputDto, SyncCartItemInputDto } from "../../models/cart/input.dto";
import { CartOutputDto } from "../../models/cart/output.dto";

const path = "/carts";

const getCartAsync = (userId: string): Promise<CartOutputDto> => {
  return get<CartOutputDto>(`${path}/${userId}`);
};

const addItemAsync = (userId: string, variantId: string, quantity: number): Promise<CartOutputDto> => {
  const body: AddToCartInputDto = { variantId, quantity };
  return post<CartOutputDto>(`${path}/${userId}/items`, body);
};

const updateQuantityAsync = (userId: string, cartItemId: string, quantity: number): Promise<CartOutputDto> => {
  return put<CartOutputDto>(`${path}/${userId}/items/${cartItemId}`, { quantity });
};

const removeItemAsync = (userId: string, cartItemId: string): Promise<CartOutputDto> => {
  return del<CartOutputDto>(`${path}/${userId}/items/${cartItemId}`);
};

const syncCartAsync = (userId: string, items: SyncCartItemInputDto[]): Promise<CartOutputDto> => {
  return post<CartOutputDto>(`${path}/${userId}/sync`, { items });
};

const clearCartAsync = (userId: string): Promise<void> => {
  return del<void>(`${path}/${userId}`);
};

export const cartService = {
  getCartAsync,
  addItemAsync,
  updateQuantityAsync,
  removeItemAsync,
  syncCartAsync,
  clearCartAsync,
};
