import { Request, Response } from "express";
import { IOrderService } from "../interfaces/IOrderService";
import { createPaymentUrl } from "../services/vnpay.service";

export class OrderController {
  private readonly orderService: IOrderService;

  constructor(orderService: IOrderService) {
    this.orderService = orderService;
  }

  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || "1");
      const pageSize = parseInt(req.query.pageSize as string || req.query.limit as string || "10");
      
      const { items, total } = await this.orderService.getOrders(page, pageSize);

      res.status(200).json({
        success: true,
        message: "Get orders successfully",
        data: {
          data: items,
          total,
          page,
          pageSize
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
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
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentMethod, total, ...orderData } = req.body;
      const order = await this.orderService.createOrder({ total, ...orderData });
      
      if (paymentMethod === "vnpay") {
        const paymentUrl = createPaymentUrl({
          amount: total || (order as any).total_amount,
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
        message: "Order created successfully (COD)",
        data: order,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.updateOrder(id, req.body);
      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
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
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}
