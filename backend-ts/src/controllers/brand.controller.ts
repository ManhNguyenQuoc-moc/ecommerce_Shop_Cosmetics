import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  getAllBrands = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : null;
      const limit = (req.query.limit || req.query.pageSize) ? parseInt((req.query.limit || req.query.pageSize) as string) : null;
      const filters = {
        searchTerm: (req.query.searchTerm || req.query.search) as string,
        minimal: req.query.minimal === 'true',
        sortBy: req.query.sortBy as string | undefined,
        mediaStatus: req.query.mediaStatus as string | undefined,
      };
      
      const { items, total } = await this.brandService.getAllBrands(page || undefined, limit || undefined, filters);
      
      res.status(200).json({ 
        success: true, 
        data: {
          data: items,
          total,
          page: page || 1,
          pageSize: limit || total
        } 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getBrandById = async (req: Request, res: Response): Promise<void> => {
    try {
      const brand = await this.brandService.getBrandById(req.params.id as string);
      if (!brand) {
        res.status(404).json({ success: false, message: "Brand not found" });
        return;
      }
      res.status(200).json({ success: true, data: brand });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const brand = await this.brandService.createBrand(req.body);
      res.status(201).json({ success: true, data: brand });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const brand = await this.brandService.updateBrand(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: brand });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.brandService.deleteBrand(req.params.id as string);
      res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

