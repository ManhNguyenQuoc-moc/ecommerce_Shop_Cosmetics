import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadFiles = async (files: Express.Multer.File[], folder: string, prefix: string = "") => {
  const uploadPromises = files.map((file, index) => {
    return new Promise<{ public_id: string; url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `${prefix}_${Date.now()}_${index}`,
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve({ public_id: result!.public_id, url: result!.secure_url });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  });

  return Promise.all(uploadPromises);
};

export const uploadBase64Files = async (base64Array: string[], folder: string, prefix: string = "") => {
  const validArray = (base64Array || []).filter(Boolean);
  
  const uploadPromises = validArray.map((base64String, index) => {
    return new Promise<{ public_id: string; url: string }>((resolve, reject) => {
      // If it's already an http url, just return it
      if (typeof base64String === "string" && base64String.startsWith("http")) {
         return resolve({ public_id: "existing_url", url: base64String });
      }
      cloudinary.uploader.upload(
        base64String,
        {
          folder,
          public_id: `${prefix}_${Date.now()}_${index}`,
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve({ public_id: result.public_id, url: result.secure_url });
        }
      );
    });
  });

  return Promise.all(uploadPromises);
};

export const deleteFiles = async (public_ids: string[]) => {
  const deletePromises = public_ids.map(id => cloudinary.uploader.destroy(id));
  return Promise.all(deletePromises);
};

export const generateCloudinarySignature = (folder: string = "products") => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = cloudinary.config().api_secret;
  
  if (!apiSecret) {
    throw new Error('Cloudinary API Secret is missing from environment variables');
  }

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    apiSecret
  );

  return {
    timestamp,
    signature,
    folder,
    cloudName: cloudinary.config().cloud_name,
    apiKey: cloudinary.config().api_key,
  };
};
