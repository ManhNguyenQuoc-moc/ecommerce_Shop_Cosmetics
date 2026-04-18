import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { CreateCategoryGroupDto, UpdateCategoryGroupDto, CategoryGroupQueryFilters } from "@/src/services/models/category-group/input.dto";
import { CategoryGroupResponseDto } from "@/src/services/models/category-group/output.dto";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { get, post, put, del } from "@/src/@core/utils/api";

const CATEGORY_GROUP_API_ENDPOINT = "/category-groups";

export const useCategoryGroups = (page: number | null = null, pageSize: number | null = null, filters: CategoryGroupQueryFilters = {}) => {
  const query = new URLSearchParams();
  if (page) query.append("page", page.toString());
  if (pageSize) query.append("pageSize", pageSize.toString());

  if (filters.search) query.append("search", filters.search);

  const url = `${CATEGORY_GROUP_API_ENDPOINT}?${query.toString()}`;

  const { data, isLoading, error, mutate } = useFetchSWR<PaginationResponse<CategoryGroupResponseDto> | CategoryGroupResponseDto[]>(
    url,
    () => get(url)
  );

  const categoryGroups: CategoryGroupResponseDto[] = Array.isArray(data) ? data : (data as PaginationResponse<CategoryGroupResponseDto>)?.data || [];
  const total: number = Array.isArray(data) ? data.length : (data as PaginationResponse<CategoryGroupResponseDto>)?.total || 0;

  return {
    categoryGroups: categoryGroups as CategoryGroupResponseDto[],
    total,
    isLoading,
    isError: error,
    mutate
  };
};

export const useCreateCategoryGroup = () => {
  return useSWRMutation(CATEGORY_GROUP_API_ENDPOINT, (_, { arg }: { arg: CreateCategoryGroupDto }) => post(CATEGORY_GROUP_API_ENDPOINT, arg));
};

export const useUpdateCategoryGroup = () => {
  return useSWRMutation(
    CATEGORY_GROUP_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; data: UpdateCategoryGroupDto } }) => put(`${CATEGORY_GROUP_API_ENDPOINT}/${arg.id}`, arg.data)
  );
};

export const useDeleteCategoryGroup = () => {
  return useSWRMutation(
    CATEGORY_GROUP_API_ENDPOINT,
    (_, { arg }: { arg: string }) => del(`${CATEGORY_GROUP_API_ENDPOINT}/${arg}`)
  );
};
