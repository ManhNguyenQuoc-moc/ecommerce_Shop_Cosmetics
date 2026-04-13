import { SettingRepository } from "../repositories/setting.repository";

export class SettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  async getPointPercentage(): Promise<number> {
    const setting = await this.settingRepository.getSetting("point_percentage");
    return setting ? parseFloat(setting.value) : 0; // default to 0% if not set
  }

  async updatePointPercentage(percentage: number): Promise<void> {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Tỉ lệ phần trăm tích điểm phải từ 0 đến 100");
    }
    await this.settingRepository.setSetting("point_percentage", percentage.toString(), "Tỉ lệ % điểm thưởng tích lũy khi mua hàng");
  }

  async getAllSettings() {
    return this.settingRepository.getAllSettings();
  }
}
