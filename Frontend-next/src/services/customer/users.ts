export type MockUser = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

export const mockUsers: MockUser[] = [
  {
    id: "1",
    username: "admin",
    password: "123456",
    name: "Admin Demo",
    email: "admin@gmail.com",
    role: "admin",
  },
  {
    id: "2",
    username: "user",
    password: "123456",
    name: "User Demo",
    email: "user@gmail.com",
    role: "customer",
  },
];