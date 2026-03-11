import Cookies from "js-cookie";

const TOKEN_KEY = "access_token";
const USER_KEY = "user_info";

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  role?:string;
};

export const authStorage = {

  login: (token: string, user: AuthUser): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 });
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 1 });
  },

  logout: (): void => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
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
}
};