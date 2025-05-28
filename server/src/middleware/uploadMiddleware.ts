import axios from "axios";
import { File } from "multer";

export const uploadImageToBunny = async (file: File): Promise<string> => {
  // تنظيف اسم الملف من الأحرف الغريبة
  const safeFileName = file.originalname
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_');

  const filePath = `events/${Date.now()}-${safeFileName}`;
  const uploadUrl = `${process.env.BUNNY_STORAGE_ENDPOINT}/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`;

  console.log("⏳ Starting image upload...");
  console.log("🔑 Using AccessKey:", process.env.BUNNY_STORAGE_ACCESS_KEY);
  console.log("🔗 Upload URL:", uploadUrl);
  console.log("🚀 Uploading image to BunnyCDN:");
  console.log(" - Upload URL:", uploadUrl);
  console.log(" - API Key Present:", !!process.env.BUNNY_STORAGE_ACCESS_KEY);
  console.log(" - File mimetype:", file.mimetype);
  console.log(" - File originalname:", file.originalname);
  console.log(" - File size (bytes):", file.size);

  try {
    await axios.put(uploadUrl, file.buffer, {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY!,
        "Content-Type": file.mimetype,
      },
    });

    const cdnBaseUrl = `https://${process.env.BUNNY_STORAGE_ZONE}.b-cdn.net`;
    return `${cdnBaseUrl}/${filePath}`;
  } catch (error: any) {
    console.error("❌ BunnyCDN Upload Axios Error response:", error.response?.data || error.message);
    throw new Error(`فشل رفع الصورة إلى BunnyCDN: ${error.message}`);
  }
};
