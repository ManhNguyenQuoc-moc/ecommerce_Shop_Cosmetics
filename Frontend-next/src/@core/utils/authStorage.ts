import Cookies from "js-cookie";

const TOKEN_KEY = "access_token";
const USER_KEY = "user_info";

export type AuthUser = {
  id: string;
  name: string;
  full_name?: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  accountType?: "CUSTOMER" | "INTERNAL";
  is_banned?: boolean;
};

export const authStorage = {

  login: (token: string, user: AuthUser): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: "/" });
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, path: "/" });
  },

  logout: (): void => {
    Cookies.remove(TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_KEY, { path: "/" });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  getUser: (): AuthUser | null => {
  const user = Cookies.get(USER_KEY);
  if (!user || user === "undefined") return null;
  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
},

  setUser: (user: AuthUser): void => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, path: "/" });
  },

  setToken: (token: string): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: "/" });
  }
}