import { z } from "zod";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export const CreateOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.COD),
  total: z.number().min(0).optional(), // Frontend might send total, but we should re-calculate
  shipping_fee: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  shipping_method: z.string().optional(),
  shippingMethod: z.string().optional(),
  
  customer: z.object({
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(10),
    name: z.string().min(2),
  }).optional(),

  address: z.object({
    addressId: z.string().uuid().optional(),
    address: z.string().optional(),
    lat: z.number().optional().nullable(),
    lon: z.number().optional().nullable(),
  }).optional(),

  items: z.array(z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().min(0).optional(),
  })).min(1),
  
  userId: z.string().uuid().optional(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderSchema = z.object({
  current_status: z.nativeEnum(OrderStatus).optional(),
  payment_status: z.nativeEnum(PaymentStatus).optional(),
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  shipping_fee: z.number().min(0).optional(),
  shipping_method: z.string().optional(),
  total_amount: z.number().min(0).optional(),
  final_amount: z.number().min(0).optional(),
});

export type UpdateOrderDTO = z.infer<typeof UpdateOrderSchema>;

export const OrderQueryFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  userId: z.string().uuid().optional(),
});

export type OrderQueryFiltersDTO = z.infer<typeof OrderQueryFiltersSchema>;
