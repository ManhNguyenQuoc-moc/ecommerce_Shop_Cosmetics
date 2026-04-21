import { z } from "zod";
import { Gender } from "@prisma/client";

export const AccountTypeSchema = z.enum(["CUSTOMER", "INTERNAL"]);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const CreateUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  full_name: z.string().min(2),
  password: z.string().min(6).optional(),
  gender: z.nativeEnum(Gender).optional(),
  birthday: z.string().optional().nullable(),
  accountType: AccountTypeSchema.optional().default("CUSTOMER"),
  roleId: z.string().uuid().optional().nullable(),
  avatar: z.string().optional().nullable(),
  is_verified: z.boolean().optional().default(false),
});

export type CreateUserDTO = z.input<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().omit({
  accountType: true,
  is_verified: true,
}).extend({
  accountType: AccountTypeSchema.optional(),
  is_verified: z.boolean().optional(),
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
  roleId: z.string().optional(),
  accountType: AccountTypeSchema.optional(),
  memberRank: z.enum(["Bronze", "Silver", "Gold", "Diamond"]).optional(),
  status: z.enum(["ACTIVE", "BANNED"]).optional(),
  wallet_status: z.enum(["active", "locked"]).optional(),
  sortBy: z.enum(["newest", "oldest", "name_asc", "name_desc", "points_desc", "points_asc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(6),
  limit: z.number().optional(),
});

export type UserQueryFiltersDTO = z.infer<typeof UserQueryFiltersSchema>;

export const UpdateUserStatusSchema = z.object({
  is_banned: z.boolean(),
});

export type UpdateUserStatusDTO = z.infer<typeof UpdateUserStatusSchema>;

export const UpdateUserRoleSchema = z.object({
  roleId: z.string().uuid(),
});

export type UpdateUserRoleDTO = z.infer<typeof UpdateUserRoleSchema>;
