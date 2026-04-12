import { Request, Response } from "express";
import { IOrderService } from "../interfaces/IOrderService";
import { createPaymentUrl } from "../services/vnpay.service";
import { CreateOrderSchema, OrderQueryFiltersSchema, UpdateOrderSchema } from "../DTO/order/order.dto";
import { z } from "zod";

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
      this.handleError(res, error);
    }
  };

  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      const query = OrderQueryFiltersSchema.parse({
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : (req.query.limit ? parseInt(req.query.limit as string) : undefined),
        // If not admin, restrict to own orders. If admin, allow full view or filter by userId.
        userId: user?.role === 'CUSTOMER' ? user.id : (req.query.userId as string || undefined),
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
      this.handleError(res, error);
    }
  };
 
  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get order successfully",
        data: order,
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate with Zod
      const validatedData = CreateOrderSchema.parse({
        ...req.body,
        userId: (req as any).user?.id
      });

      // 2. Call Service
      const order = await this.orderService.createOrder(validatedData);
      
      // 3. Handle Payment Redirect if needed
      if (validatedData.paymentMethod === "VNPAY") {
        const paymentUrl = createPaymentUrl({
          amount: validatedData.total || (order as any).total_amount,
          orderId: order.id,
        });
        res.status(200).json({
          success: true,
          message: "Redirect to VNPAY",
          paymentUrl,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error: any) {
      this.handleError(res, error);
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
      this.handleError(res, error);
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
      this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    console.error("OrderController Error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}
