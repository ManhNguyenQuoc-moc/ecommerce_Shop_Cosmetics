import { get, post, put } from "../api";

export const USER_API_ENDPOINT = "/users";

// Pure API functions - safe for Server Components
export const getUsers = (filters?: any) => {
  return get<any>(`${USER_API_ENDPOINT}`, filters);
};

export const getUserById = (id: string) => {
  return get<any>(`${USER_API_ENDPOINT}/${id}`);
};

export const getUserProfile = () => {
  return get<any>(`${USER_API_ENDPOINT}/profile`);
};

export const updateUser = (id: string, data: any) => {
  return put<any>(`${USER_API_ENDPOINT}/${id}`, data);
};

export const updateUserStatus = (id: string, status: string) => {
  return put(`${USER_API_ENDPOINT}/${id}/status`, { status });
};
