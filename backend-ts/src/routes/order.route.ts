import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repositories/order.repository";

const router = Router();

// Dependency Injection
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.post("/checkout", orderController.createOrder); // API thay cho post /checkout cũ
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;
