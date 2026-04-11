import { Request, Response } from "express";
import { IWishlistService } from "../interfaces/IWishlistService";
import { AddToWishlistSchema } from "../DTO/customer/wishlist.dto";

export class WishlistController {
  constructor(private readonly wishlistService: IWishlistService) {}

  async getMyWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const wishlist = await this.wishlistService.getUserWishlist(userId);
      res.status(200).json({
        success: true,
        data: wishlist
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async toggleWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validation = AddToWishlistSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          success: false,
          errors: validation.error.issues
        });
        return;
      }

      const result = await this.wishlistService.toggleWishlist(userId, validation.data.variantId);
      
      res.status(200).json({
        success: true,
        message: result.added ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích",
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }
}
