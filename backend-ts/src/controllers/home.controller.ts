import { Request, Response } from "express";
import { IHomeService } from "../interfaces/IHomeService";

export class HomeController {
  private readonly homeService: IHomeService;

  constructor(homeService: IHomeService) {
    this.homeService = homeService;
  }

  getHomeData = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.homeService.getHomeData();
      res.status(200).json({
        success: true,
        message: "Get home data successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}
