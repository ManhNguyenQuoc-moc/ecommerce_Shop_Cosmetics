import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repositories/order.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { InventoryRepository } from "../repositories/inventory.repository";
import { MailService } from "../services/mail.service";

const router = Router();

// Dependency Injection Assembly
const orderRepository = new OrderRepository();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const inventoryRepository = new InventoryRepository();
const mailService = new MailService();

const orderService = new OrderService(
  orderRepository, 
  userService, 
  inventoryRepository, 
  mailService
);

const orderController = new OrderController(orderService);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.post("/checkout", orderController.createOrder); 
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;
