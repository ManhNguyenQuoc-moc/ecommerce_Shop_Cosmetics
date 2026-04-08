import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { CartService } from "../services/cart.service";
import { CartRepository } from "../repositories/cart.repository";

const router = Router();

const cartRepository = new CartRepository();
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

router.get("/:userId", cartController.getCart);
router.post("/:userId/items", cartController.addItem);
router.put("/:userId/items/:cartItemId", cartController.updateQuantity);
router.delete("/:userId/items/:cartItemId", cartController.removeItem);
router.delete("/:userId", cartController.clearCart);
router.post("/:userId/sync", cartController.syncCart);

export default router;
