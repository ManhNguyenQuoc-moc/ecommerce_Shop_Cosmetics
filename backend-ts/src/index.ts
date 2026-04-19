

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { socketService } from "./services/socket.service";
import paymentRoute from "./routes/payment.route";
import questionRoutes from "./routes/question.route";
import productRoute from "./routes/product.route";
import userRoute from "./routes/user.route";
import categoryRoute from "./routes/category.route";
import categoryGroupRoute from "./routes/category-group.routes";
import orderRoute from "./routes/order.route";
import cartRoute from "./routes/cart.route";
import homeRoute from "./routes/home.route";
import authRoute from "./routes/auth.route";
import uploadRoute from "./routes/upload.route";
import brandRoute from "./routes/brand.route";
import purchaseRoute from "./routes/purchase.route";
import inventoryRoute from "./routes/inventory.route";
import wishlistRoute from "./routes/wishlist.route";
import voucherRoute from "./routes/voucher.route";
import settingRoute from "./routes/setting.route";
import dashboardRoute from "./routes/dashboard.route";
import reviewRoute from "./routes/review.route";
import notificationRoute from "./routes/notification.routes";
import rbacRouter from "./routes/rbac.routes";

const app = express();
const server = createServer(app);

// Initialize Socket.io
socketService.initialize(server);

// Fix for BigInt serialization issue
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-shop-cosmetics.vercel.app", // Removed trailing slash
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/category-groups", categoryGroupRoute);
app.use("/orders", orderRoute);
app.use("/carts", cartRoute);
app.use("/payment", paymentRoute);
app.use("/home", homeRoute);
app.use("/auth", authRoute);
app.use("/upload", uploadRoute);
app.use("/brands", brandRoute);
app.use("/purchases", purchaseRoute);
app.use("/inventory", inventoryRoute);
app.use("/wishlist", wishlistRoute);
app.use("/vouchers", voucherRoute);
app.use("/settings", settingRoute);
app.use("/admin/dashboard", dashboardRoute);
app.use("/admin/rbac", rbacRouter);
app.use("/reviews", reviewRoute);
app.use("/notifications", notificationRoute);
app.use("/questions", questionRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running at", PORT);
});