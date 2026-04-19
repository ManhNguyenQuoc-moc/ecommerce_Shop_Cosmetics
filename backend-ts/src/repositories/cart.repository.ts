import { Cart, CartItem } from "@prisma/client";
import { ICartRepository } from "../interfaces/ICartRepository";
import { prisma } from "../config/prisma";

export class CartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                    include: {
                        productImages: { include: { image: true }, orderBy: { order: 'asc' } }
                    }
                },
                image: true
              },
            },
          },
        },
      },
    });
  }

  async create(userId: string): Promise<Cart> {
    return prisma.cart.create({
      data: { userId },
      include: { 
        items: {
          include: {
            variant: {
                include: {
                    product: true,
                    image: true
                }
            }
          }
        } 
      },
    });
  }

  async addItem(cartId: string, variantId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId, variantId } },
      create: {
        cartId,
        variantId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
    });
  }

  async removeItem(cartItemId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
