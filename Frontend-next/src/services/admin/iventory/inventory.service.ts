import { get } from "../../../@core/utils/api";
import { InventoryBatchDto } from "../../models/inventory/output.dto";
import { InventoryQueryParams } from "../../models/inventory/input.dto";
import { buildQueryString } from "../../../@core/utils/query.util";
import { PaginationResponse } from "../../../@core/http/models/PaginationResponse";

export const INVENTORY_API_ENDPOINT = "/inventory";

// Pure API functions - safe for Server Components
export function getInventoryBatches(page: number, pageSize: number, filters?: InventoryQueryParams) {
  const query = buildQueryString({
    page,
    pageSize,
    ...filters
  });

  const url = `${INVENTORY_API_ENDPOINT}/batches${query}`;
  return get<PaginationResponse<InventoryBatchDto>>(url);
}
