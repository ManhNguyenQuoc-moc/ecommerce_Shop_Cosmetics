import { get, post, patch, del } from "@/src/@core/utils/api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";
import { CreateVoucherDto, UpdateVoucherDto } from "@/src/services/models/voucher/input.dto";

export const VOUCHER_API_ENDPOINT = "/vouchers";

export interface VoucherQueryFilters {
  search?: string;
  status?: string;
  type?: string;
  redeemType?: string;
  sortBy?: string;
  includeExpired?: string;
  [key: string]: string | number | undefined;
}

export const useGetVouchers = (page: number = 1, pageSize: number = 6, filters: VoucherQueryFilters = {}) => {
  const query = buildQueryString({
    page,
    pageSize,
    ...filters
  });

  const { data, isLoading, error, mutate } = useFetchSWR<PaginationResponse<VoucherResponseDto>>(
    `${VOUCHER_API_ENDPOINT}${query}`,
    () => get(`${VOUCHER_API_ENDPOINT}${query}`)
  );

  const vouchers: VoucherResponseDto[] = (data as PaginationResponse<VoucherResponseDto>)?.data || [];
  const total: number = data?.total || 0;
  
  return { vouchers, total, isLoading, isError: error, mutate };
};

export const useCreateVoucher = () => {
  return useSWRMutation(
    VOUCHER_API_ENDPOINT,
    (_, { arg }: { arg: CreateVoucherDto }) => post(VOUCHER_API_ENDPOINT, arg)
  );
};

export const useUpdateVoucher = () => {
  return useSWRMutation(
    VOUCHER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; data: UpdateVoucherDto } }) =>
      patch(`${VOUCHER_API_ENDPOINT}/${arg.id}`, arg.data)
  );
};

export const useDeleteVoucher = () => {
  return useSWRMutation(
    VOUCHER_API_ENDPOINT,
    (_, { arg }: { arg: string }) => del(`${VOUCHER_API_ENDPOINT}/${arg}`)
  );
};
