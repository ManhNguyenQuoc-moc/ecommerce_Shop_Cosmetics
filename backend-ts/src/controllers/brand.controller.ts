import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  getAllBrands = async (req: Request, res: Response): Promise<void> => {
    try {
      const brands = await this.brandService.getAllBrands();
      res.status(200).json({
        success: true,
        message: "Get all brands successfully",
        data: brands,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}
