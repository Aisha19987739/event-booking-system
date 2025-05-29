import axios from "axios";
import { File } from "multer";

export const uploadImageToBunny = async (file: File): Promise<string> => {
  // تنظيف اسم الملف
  const safeFileName = file.originalname
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_");

  const filePath = `events/${Date.now()}-${safeFileName}`;
  const uploadUrl = `${process.env.BUNNY_STORAGE_ENDPOINT}/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`;

  try {
    await axios.put(uploadUrl, file.buffer, {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY!,
        "Content-Type": file.mimetype,
      },
    });

    // ❗ بدل إرجاع رابط CDN كامل، نرجع فقط اسم الملف
    return filePath; // مثل: events/1748460121392-my_image.jpg
  } catch (error: any) {
    console.error("❌ خطأ أثناء رفع الصورة:", error.response?.data || error.message);
    throw new Error(`فشل رفع الصورة إلى BunnyCDN: ${error.message}`);
  }
};
