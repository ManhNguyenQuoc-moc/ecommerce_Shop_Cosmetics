import { get, post } from "../../@core/utils/api";
import axios from "axios";

export const getUploadSignature = (folder: string = "products") => {
  return get<{
    timestamp: number;
    signature: string;
    folder: string;
    cloudName: string;
    apiKey: string;
  }>(`/upload/signature?folder=${folder}`);
};

export const uploadFileToCloudinary = async (file: File | Blob, folder: string = "products"): Promise<string> => {
  try {
    const signatureData = await getUploadSignature(folder);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;
    const response = await axios.post(uploadUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    throw new Error("Tải ảnh lên hệ thống thất bại");
  }
};

export const deleteUploads = async (urls: string[]) => {
  const publicIds = urls
    .filter((url) => url.startsWith("http"))
    .map((url) => {
      const parts = url.split('/');
      const filename = parts.pop();
      const folder = parts.pop();
      if (!filename || !folder) return null;
      const id = filename.split('.')[0];
      return `${folder}/${id}`;
    })
    .filter(Boolean);

  if (publicIds.length > 0) {
    return post("/upload/delete", { publicIds });
  }
};
