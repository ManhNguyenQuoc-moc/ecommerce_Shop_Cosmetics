import { Request, Response } from "express";
import { ICartService } from "../interfaces/ICartService";

export class CartController {
  private readonly cartService: ICartService;

  constructor(cartService: ICartService) {
    this.cartService = cartService;
  }

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const cart = await this.cartService.getCartByUserId(userId);

      res.status(200).json({
        success: true,
        message: "Get cart successfully",
        data: cart,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const { variantId, quantity } = req.body;
      const cart = await this.cartService.addItemToCart(userId, variantId, quantity);
      
      res.status(201).json({ success: true, message: "Item added to cart", data: cart });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, cartItemId } = req.params;
      const { quantity } = req.body;
      const cart = await this.cartService.updateItemQuantity(userId as string, cartItemId as string, quantity);
      res.status(200).json({ success: true, message: "Quantity updated", data: cart });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, cartItemId } = req.params;
      const cart = await this.cartService.removeItemFromCart(userId as string, cartItemId as string);
      res.status(200).json({ success: true, message: "Item removed", data: cart });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      await this.cartService.clearCart(userId);
      res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  syncCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const { items } = req.body; // Array of { variantId, quantity }
      const cart = await this.cartService.syncCart(userId, items);
      res.status(200).json({ success: true, message: "Cart synced successfully", data: cart });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
