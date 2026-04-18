import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repositories/order.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { InventoryRepository } from "../repositories/inventory.repository";
import { MailService } from "../services/mail.service";
import { SettingRepository } from "../repositories/setting.repository";
import { SettingService } from "../services/setting.service";

import { authenticate } from "../middlewares/auth.middleware";

import { NotificationService } from "../services/notification.service";
import { NotificationRepository } from "../repositories/notification.repository";

const router = Router();

const orderRepository = new OrderRepository();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const inventoryRepository = new InventoryRepository();
const mailService = new MailService();
const settingRepository = new SettingRepository();
const settingService = new SettingService(settingRepository);

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);

const orderService = new OrderService(
  orderRepository, 
  userService, 
  inventoryRepository, 
  mailService,
  settingService,
  notificationService
);

const orderController = new OrderController(orderService);
router.post("/checkout", orderController.createOrder); 

router.use(authenticate);

router.get("/me", orderController.getMyOrders);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);

router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;
