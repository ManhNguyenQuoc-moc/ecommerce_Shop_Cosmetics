import { Request, Response } from "express";
import { IOrderService } from "../interfaces/IOrderService";
import { createMomoPaymentUrl } from "../services/momo.service";
import { createZaloPayOrder } from "../services/zalopay.service";
import { CreateOrderSchema, OrderQueryFiltersSchema, UpdateOrderSchema } from "../DTO/order/order.dto";
import { handleControllerError } from "../utils/errorHandler";
import { createSepayCheckoutPayload } from "../services/sepay.service";

export class OrderController {
  private readonly orderService: IOrderService;

  constructor(orderService: IOrderService) {
    this.orderService = orderService;
  }

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const query = OrderQueryFiltersSchema.parse({
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : (req.query.limit ? parseInt(req.query.limit as string) : undefined),
        userId: user.id, // Strictly filter by logged-in user
      });

      const { items, total } = await this.orderService.getOrders(query.page || 1, query.pageSize || 10, query);

      res.status(200).json({
        success: true,
        message: "Get my orders successfully",
        data: {
          data: items,
          total,
          page: query.page || 1,
          pageSize: query.pageSize || 10
        },
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const isCustomer = user.accountType === "CUSTOMER";
      const query = OrderQueryFiltersSchema.parse({
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : (req.query.limit ? parseInt(req.query.limit as string) : undefined),
        // Customers can only see their own orders. Internal accounts can filter any user.
        userId: isCustomer ? user.id : (req.query.userId as string || undefined),
      });

      const { items, total } = await this.orderService.getOrders(query.page || 1, query.pageSize || 10, query);

      res.status(200).json({
        success: true,
        message: "Get orders successfully",
        data: {
          data: items,
          total,
          page: query.page || 1,
          pageSize: query.pageSize || 10
        },
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };
 
  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const id = req.params.id as string;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }

      if (user.accountType === "CUSTOMER" && order.userId !== user.id) {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get order successfully",
        data: order,
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const gatewayFromRequest = req.body?.paymentMethod === "SEPAY" ? "SEPAY" : req.body?.paymentMethod;

      // 1. Validate with Zod
      const validatedData = CreateOrderSchema.parse({
        ...req.body,
        userId: (req as any).user?.id
      });

      // 2. Pre-validate payment URL generation BEFORE creating order
      // This prevents address duplication if payment generation fails
      let paymentUrl: string | undefined;
      let sepayCheckout:
        | {
            checkoutUrl: string;
            checkoutFields: Record<string, string | number | undefined>;
          }
        | undefined;
      const paymentGateway = gatewayFromRequest || validatedData.paymentMethod;

      if (paymentGateway === "SEPAY" || validatedData.paymentMethod === "MOMO" || validatedData.paymentMethod === "ZALOPAY") {
        try {
          // Generate payment URL first to catch errors early
          const tempOrderId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const tempAmount = validatedData.total || 0;

          if (paymentGateway === "SEPAY") {
            sepayCheckout = createSepayCheckoutPayload({
              amount: tempAmount,
              orderId: tempOrderId,
            });
            paymentUrl = sepayCheckout.checkoutUrl;
          } else if (validatedData.paymentMethod === "MOMO") {
            const momoData = await createMomoPaymentUrl({
              amount: tempAmount,
              orderId: tempOrderId,
              orderInfo: `Thanh toan don hang ${tempOrderId}`
            });
            paymentUrl = momoData.payUrl;
          } else if (validatedData.paymentMethod === "ZALOPAY") {
            const zaloData = await createZaloPayOrder({
              amount: tempAmount,
              orderId: tempOrderId,
            });
            paymentUrl = zaloData.order_url;
          }

          if (!paymentUrl) {
            throw new Error("Không thể tạo liên kết thanh toán.");
          }
        } catch (paymentError: any) {
          // Payment generation failed - DON'T create order, just return error
          console.error(`${paymentGateway} payment creation error:`, paymentError);
          res.status(400).json({
            success: false,
            message: "Không thể khởi tạo thanh toán. Vui lòng kiểm tra lại thông tin hoặc thử lại sau."
          });
          return;
        }
      }

      // 3. NOW create order (only if payment validation passed or no payment needed)
      const order = await this.orderService.createOrder(validatedData);
      
      // 4. If payment URL was pre-generated, return it with the real order ID
      if (paymentUrl) {
        // Re-generate with real order ID
        let finalPaymentUrl: string | undefined;
        let finalSepayCheckout:
          | {
              checkoutUrl: string;
              checkoutFields: Record<string, string | number | undefined>;
            }
          | undefined;

        if (paymentGateway === "SEPAY") {
          finalSepayCheckout = createSepayCheckoutPayload({
            amount: validatedData.total || (order as any).total_amount,
            orderId: order.id,
          });
          finalPaymentUrl = finalSepayCheckout.checkoutUrl;
        } else if (validatedData.paymentMethod === "MOMO") {
          const momoData = await createMomoPaymentUrl({
            amount: validatedData.total || (order as any).total_amount,
            orderId: order.id,
            orderInfo: `Thanh toan don hang ${order.id}`
          });
          finalPaymentUrl = momoData.payUrl;
        } else if (validatedData.paymentMethod === "ZALOPAY") {
          const zaloData = await createZaloPayOrder({
            amount: validatedData.total || (order as any).total_amount,
            orderId: order.id,
          });
          finalPaymentUrl = zaloData.order_url;
        }

        if (finalPaymentUrl) {
          res.status(200).json({
            success: true,
            message: `Redirect to ${paymentGateway}`,
            paymentUrl: finalPaymentUrl,
            sepayCheckout: finalSepayCheckout,
          });
          return;
        }
      }

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

  cancelUnpaidOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const id = req.params.id as string;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }

      if (user.accountType === "CUSTOMER" && order.userId !== user.id) {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }

      if (order.payment_status === "PAID") {
        res.status(400).json({ success: false, message: "Order already paid" });
        return;
      }

      if (order.current_status === "CANCELLED") {
        res.status(200).json({ success: true, message: "Order already cancelled", data: order });
        return;
      }

      await this.orderService.deleteUnpaidOrder(id);
      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const validatedData = UpdateOrderSchema.parse(req.body);
      
      const order = await this.orderService.updateOrder(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

  refundPaidOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.refundPaidOrder(id);

      res.status(200).json({
        success: true,
        message: "Refund approved successfully",
        data: order,
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.orderService.deleteOrder(id);
      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error: any) {
      handleControllerError(res, error, "OrderController");
    }
  };

}
