import {UpdateUserProfileDTO} from "./models/input.model.dto";

import {UserProfileDTO} from "./models/output.model.dto";

import { get, put } from "../../../@core/utils/api";
import { PaginationResponse } from "../../../@core/http/models/PaginationResponse";

export const USER_API_ENDPOINT = "/users";

export const getUsers = (filters?: any) => {
  return get<PaginationResponse<UserProfileDTO>>(`${USER_API_ENDPOINT}`, filters);
};

export const fetchAllUsers = async (filters?: any) => {
    const response = await getUsers({ ...filters, page: 1, pageSize: 9999 });
    return response.data;
  };

export const getUserById = (id: string) => {
  return get<UserProfileDTO>(`${USER_API_ENDPOINT}/${id}`);
};

export const getUserProfile = () => {
  return get<UserProfileDTO>(`${USER_API_ENDPOINT}/profile`);
};

export const updateUser = (id: string, data: UpdateUserProfileDTO) => {
  return put<UpdateUserProfileDTO>(`${USER_API_ENDPOINT}/${id}`, data);
};

export const updateUserStatus = (id: string, is_banned: boolean) => {
  return put(`${USER_API_ENDPOINT}/${id}/status`, { is_banned });
};

export const updateUserRole = (id: string, role: string) => {
  return put(`${USER_API_ENDPOINT}/${id}/role`, { roleId: role });
};

export const updateUserAccountType = (id: string, accountType: "CUSTOMER" | "INTERNAL") => {
  return put(`${USER_API_ENDPOINT}/${id}/account-type`, { accountType });
};
