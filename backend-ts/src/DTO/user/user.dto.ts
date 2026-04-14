import { z } from "zod";
import { Gender, Role } from "@prisma/client";

export const CreateUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  full_name: z.string().min(2),
  password: z.string().min(6).optional(),
  gender: z.nativeEnum(Gender).optional(),
  birthday: z.string().optional().nullable(),
  role: z.nativeEnum(Role).optional().default(Role.CUSTOMER),
  avatar: z.string().optional().nullable(),
  is_verified: z.boolean().optional().default(false),
});

export type CreateUserDTO = z.input<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  addresses: z.array(z.object({
    address: z.string(),
    lat: z.number().optional().nullable(),
    lon: z.number().optional().nullable(),
    isDefault: z.boolean().default(false),
  })).optional(),
  is_point_wallet_locked: z.boolean().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export const UserQueryFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
});

export type UserQueryFiltersDTO = z.infer<typeof UserQueryFiltersSchema>;

export const UpdateUserStatusSchema = z.object({
  is_banned: z.boolean(),
});

export type UpdateUserStatusDTO = z.infer<typeof UpdateUserStatusSchema>;

export const UpdateUserRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export type UpdateUserRoleDTO = z.infer<typeof UpdateUserRoleSchema>;
