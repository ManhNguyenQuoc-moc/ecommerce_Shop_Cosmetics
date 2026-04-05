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
      const item = await this.cartService.addItemToCart(userId, variantId, quantity);
      
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;
      const item = await this.cartService.updateItemQuantity(cartItemId as string, quantity);
      res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cartItemId } = req.params;
      await this.cartService.removeItemFromCart(cartItemId as string);
      res.status(200).json({ success: true, message: "Item removed" });
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
}
