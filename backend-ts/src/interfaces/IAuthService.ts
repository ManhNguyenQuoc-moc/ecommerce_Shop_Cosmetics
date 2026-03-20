export interface IAuthService {
  register(data: any): Promise<any>;
  login(email: string, password: string): Promise<{ user: any; token: string }>;
}
