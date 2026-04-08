import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IAuthService } from "../interfaces/IAuthService";
import { prisma } from "../config/prisma";

export class AuthService implements IAuthService {
  async register(data: any): Promise<any> {
    const { email, password, full_name, phone } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      throw new Error("Email or Phone already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name,
        phone,
      }
    });

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar: user.avatar,
    };
  }

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.password_hash) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn("WARNING: JWT_SECRET is not defined in environment variables. Using default secret is not recommended for production.");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret || "default_secret",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar: user.avatar,
        role: user.role,
      },
      token
    };
  }
}
