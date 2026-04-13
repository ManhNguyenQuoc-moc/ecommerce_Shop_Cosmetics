import { SystemSetting } from "@prisma/client";
import { prisma } from "../config/prisma";

export class SettingRepository {
  async getSetting(key: string): Promise<SystemSetting | null> {
    return prisma.systemSetting.findUnique({ where: { key } });
  }

  async setSetting(key: string, value: string, description?: string): Promise<SystemSetting> {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  async getAllSettings(): Promise<SystemSetting[]> {
    return prisma.systemSetting.findMany();
  }
}
