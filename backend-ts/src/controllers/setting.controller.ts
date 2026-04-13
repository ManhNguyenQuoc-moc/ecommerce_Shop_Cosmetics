import { Request, Response } from "express";
import { SettingService } from "../services/setting.service";
import { z } from "zod";

export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const pointPercentage = await this.settingService.getPointPercentage();
      res.status(200).json({ success: true, data: { point_percentage: pointPercentage } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const schema = z.object({
        point_percentage: z.number().min(0).max(100),
      });
      const data = schema.parse(req.body);
      await this.settingService.updatePointPercentage(data.point_percentage);
      res.status(200).json({ success: true, message: "Cập nhật cài đặt thành công" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dữ liệu không hợp lệ", 
          errors: error.issues.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
