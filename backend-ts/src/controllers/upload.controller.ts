import { Request, Response } from "express";
import { generateCloudinarySignature } from "../utils/fileHandler";
import cloudinary from "../config/cloudinary";

export class UploadController {
  getSignature = (req: Request, res: Response): void => {
    try {
      const folder = req.query.folder as string || "products";
      const signatureData = generateCloudinarySignature(folder);
      
      res.status(200).json({
        success: true,
        message: "Signature generated successfully",
        data: signatureData,
      });
    } catch (error: any) {
      console.error("Signature generation error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to generate signature" });
    }
  };

  deleteFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { publicIds } = req.body;
      if (!publicIds || !Array.isArray(publicIds)) {
        res.status(400).json({ success: false, message: "Invalid publicIds array" });
        return;
      }

      const deletePromises = publicIds.map((id: string) => cloudinary.uploader.destroy(id));
      await Promise.all(deletePromises);

      res.status(200).json({
        success: true,
        message: "Files deleted successfully",
      });
    } catch (error: any) {
      console.error("Cloudinary delete error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete files" });
    }
  };
}
