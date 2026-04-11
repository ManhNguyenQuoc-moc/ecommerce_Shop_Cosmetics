import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { WishlistService } from "../services/wishlist.service";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// DI Container (simplified)
const wishlistRepo = new WishlistRepository();
const wishlistService = new WishlistService(wishlistRepo);
const wishlistController = new WishlistController(wishlistService);

router.get("/", authenticate, (req, res) => wishlistController.getMyWishlist(req, res));
router.post("/toggle", authenticate, (req, res) => wishlistController.toggleWishlist(req, res));

export default router;
