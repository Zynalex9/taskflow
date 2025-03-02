import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
interface ParamsI {
  localFilePath: string;
  folderName?: string;
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function UploadOnCloudinary({
  localFilePath,
  folderName = "taskflow/profilepicture",
}: ParamsI) {
  try {
    if (!localFilePath) {
      console.log("No Local file path or folder recieved in cloudinary ");
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error in uploading on cloudinary", error);
    return null;
  }
}
