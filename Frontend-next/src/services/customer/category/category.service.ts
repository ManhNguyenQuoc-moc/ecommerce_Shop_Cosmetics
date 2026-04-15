import { get } from "../../../@core/utils/api";
import { CategoryResponseDto } from "../../models/category/output.dto";

export const CUSTOMER_CATEGORY_API_ENDPOINT = "/categories";

export const getCustomerCategories = () => {
  return get<CategoryResponseDto[]>(CUSTOMER_CATEGORY_API_ENDPOINT);
};
