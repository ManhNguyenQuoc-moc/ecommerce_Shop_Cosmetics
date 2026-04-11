import { z } from "zod";

export const InventoryQueryFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  mfgDateFrom: z.string().optional(),
  mfgDateTo: z.string().optional(),
  expiryDateFrom: z.string().optional(),
  expiryDateTo: z.string().optional(),
  status: z.enum(['EXPIRED', 'NEAR_EXPIRY', 'OUT_OF_STOCK', 'GOOD', 'all']).optional(),
  sortBy: z.enum(['expiry_asc', 'expiry_desc', 'qty_asc', 'qty_desc']).optional(),
});

export type InventoryQueryFiltersDTO = z.infer<typeof InventoryQueryFiltersSchema>;
