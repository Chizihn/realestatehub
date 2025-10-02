import cloudinary from "../config/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
    resource_type?: "image" | "video" | "raw" | "auto";
  } = {}
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "realestatehub/properties",
      resource_type: options.resource_type || "image",
      public_id: options.public_id,
      transformation: options.transformation || [
        { width: 1200, height: 800, crop: "limit", quality: "auto:good" },
        { fetch_format: "auto" },
      ],
      ...options,
    };

    cloudinary.uploader
      .upload_stream(
        uploadOptions,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type,
              bytes: result.bytes,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      )
      .end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

export const uploadMultipleToCloudinary = async (
  files: Array<{ buffer: Buffer; originalname: string }>,
  folder: string = "realestatehub/properties"
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map((file, index) => {
    const publicId = `${Date.now()}_${index}_${
      file.originalname.split(".")[0]
    }`;
    return uploadToCloudinary(file.buffer, {
      folder,
      public_id: publicId,
    });
  });

  return Promise.all(uploadPromises);
};

export const generateCloudinaryUrl = (
  publicId: string,
  transformations?: any
): string => {
  return cloudinary.url(publicId, {
    transformation: transformations || [
      { width: 800, height: 600, crop: "fill", quality: "auto:good" },
      { fetch_format: "auto" },
    ],
    secure: true,
  });
};
