import { get, post, put } from "../../../@core/utils/api";
import { CreatePOInput, UpdatePOInput, POQueryParams, ReceiveStockInput } from "../../models/purchase/input.dto";
import { PODetailDto, POListItemDto, POItemDto, POReceiptItemDto } from "../../models/purchase/output.dto";
import { PaginationResponse } from "../../../@core/http/models/PaginationResponse";
import { buildQueryString } from "../../../@core/utils/query.util";

export const PURCHASE_API_ENDPOINT = "/purchases";

// Pure API functions - safe for Server Components
export const getPurchaseOrders = (params?: POQueryParams) => {
  const query = params ? buildQueryString(params) : "";
  return get<PaginationResponse<POListItemDto>>(`${PURCHASE_API_ENDPOINT}${query}`);
};

export const getPurchaseOrderById = (id: string) =>
  get<PODetailDto>(`${PURCHASE_API_ENDPOINT}/${id}`);

export const getPurchaseOrderItems = (id: string, page: number, limit: number) => {
  const query = buildQueryString({ page, limit });
  return get<PaginationResponse<POItemDto>>(`${PURCHASE_API_ENDPOINT}/${id}/items${query}`);
};

export const getPurchaseOrderReceipts = (id: string, page: number, limit: number) => {
  const query = buildQueryString({ page, limit });
  return get<PaginationResponse<POReceiptItemDto>>(`${PURCHASE_API_ENDPOINT}/${id}/receipts${query}`);
};

export const createPurchaseOrder = (data: CreatePOInput) => post<PODetailDto>(PURCHASE_API_ENDPOINT, data);

export const updatePurchaseOrder = (id: string, data: UpdatePOInput) =>
  put<PODetailDto>(`${PURCHASE_API_ENDPOINT}/${id}`, data);

export const confirmPurchaseOrder = (id: string) =>
  post(`${PURCHASE_API_ENDPOINT}/${id}/confirm`, {});

export const cancelPurchaseOrder = (id: string) =>
  post(`${PURCHASE_API_ENDPOINT}/${id}/cancel`, {});

export const receiveStock = (payload: ReceiveStockInput) =>
  post(`${PURCHASE_API_ENDPOINT}/receive-stock`, payload);
