import { z } from "zod";
import { DiscountType } from "@prisma/client";

export const ValidVoucherCodeRegex = /^[A-Za-z0-9_-]{3,20}$/;

export const CreateVoucherBaseSchema = z.object({
  code: z.string().regex(ValidVoucherCodeRegex, "Mã Voucher không hợp lệ"),
  program_name: z.string().min(3, "Tên chương trình quá ngắn"),
  description: z.string().optional(),
  discount: z.number().min(0, "Mức giảm phải >= 0"),
  type: z.nativeEnum(DiscountType),
  min_order_value: z.number().min(0).default(0),
  max_discount: z.number().optional().nullable(),
  point_cost: z.number().int().min(0).default(0),
  valid_from: z.string().transform(str => new Date(str)),
  valid_until: z.string().transform(str => new Date(str)),
  usage_limit: z.number().int().min(1).default(100),
  isActive: z.boolean().default(true),
});

export const CreateVoucherSchema = CreateVoucherBaseSchema.superRefine((data, ctx) => {
  if (data.type === 'PERCENTAGE' && (data.discount <= 0 || data.discount > 100)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phần trăm giảm phải từ 1-100", path: ['discount']});
  }
  if (data.valid_until <= data.valid_from) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ngày kết thúc phải lớn hơn ngày bắt đầu", path: ['valid_until']});
  }
});

export type CreateVoucherDTO = z.infer<typeof CreateVoucherSchema>;

export const UpdateVoucherSchema = CreateVoucherBaseSchema.partial();

export type UpdateVoucherDTO = z.infer<typeof UpdateVoucherSchema>;

export const VoucherResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  program_name: z.string().nullable(),
  description: z.string().nullable(),
  discount: z.number(),
  type: z.nativeEnum(DiscountType),
  min_order_value: z.number().nullable(),
  max_discount: z.number().nullable(),
  valid_from: z.date(),
  valid_until: z.date(),
  usage_limit: z.number(),
  used_count: z.number(),
  point_cost: z.number(),
  isActive: z.boolean(),
  is_used_by_user: z.boolean().optional(),
});

export type VoucherResponseDTO = z.infer<typeof VoucherResponseSchema>;
