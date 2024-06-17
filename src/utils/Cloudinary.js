import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const uploadFile = async (fileName) => {
  try {
    if (!fileName) return null;
    //upload the file in the cloudinary
    const response = await cloudinary.uploader.upload(fileName, {
      resource_type: "auto",
    });
    console.log(response);
    console.log("File is uploaded success fully", response.url);
    fs.unlinkSync(fileName);
    return response;
  } catch (error) {
    //remove the locally saved temporary file as the upload operation got
    fs.unlinkSync(fileName);
  }
};

export { uploadFile };
