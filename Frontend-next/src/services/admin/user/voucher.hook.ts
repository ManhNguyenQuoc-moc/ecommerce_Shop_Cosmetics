import { get, post, patch, del } from "@/src/@core/utils/api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const VOUCHER_API_ENDPOINT = "/vouchers";

export const useGetVouchers = () => {
  const { data, isLoading, error, mutate } = useFetchSWR<any>(
    `${VOUCHER_API_ENDPOINT}?all=true`,
    () => get(`${VOUCHER_API_ENDPOINT}?all=true`)
  );
  return { vouchers: data || [], isLoading, isError: error, mutate };
};

export const useCreateVoucher = () => {
  return useSWRMutation(
    VOUCHER_API_ENDPOINT,
    (_, { arg }: { arg: any }) => post(VOUCHER_API_ENDPOINT, arg)
  );
};

export const useUpdateVoucher = () => {
  return useSWRMutation(
    VOUCHER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; data: any } }) =>
      patch(`${VOUCHER_API_ENDPOINT}/${arg.id}`, arg.data)
  );
};

export const useDeleteVoucher = () => {
  return useSWRMutation(
    VOUCHER_API_ENDPOINT,
    (_, { arg }: { arg: string }) => del(`${VOUCHER_API_ENDPOINT}/${arg}`)
  );
};
