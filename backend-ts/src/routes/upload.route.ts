import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";

const router = Router();
const uploadController = new UploadController();

router.get("/signature", uploadController.getSignature);
router.post("/delete", uploadController.deleteFiles);

export default router;
