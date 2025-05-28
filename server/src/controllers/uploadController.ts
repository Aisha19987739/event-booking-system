import { Request, Response } from "express";
import axios from "axios";


export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filePath = `images/${Date.now()}-${file.originalname}`;
    
    const storageZoneName = process.env.BUNNY_STORAGE_NAME;
    const storageApiKey = process.env.BUNNY_STORAGE_PASSWORD;
    const cdnBaseUrl = process.env.BUNNY_CDN_BASE_URL;
    
    if (!storageZoneName || !storageApiKey || !cdnBaseUrl) {
      res.status(500).json({ error: "BunnyCDN config is missing in environment variables" });
      return;
    }

    const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${filePath}`;

    await axios.put(uploadUrl, file.buffer, {
      headers: {
        AccessKey: storageApiKey,
        "Content-Type": file.mimetype,
      },
    });

    const publicUrl = `${cdnBaseUrl}/${filePath}`;
    res.status(200).json({ url: publicUrl });
  } catch (err: any) {
    console.error("BunnyCDN upload error:", err?.message || err);
    res.status(500).json({
      error: "Upload failed",
      message: err?.response?.data || err.message || "Unknown error",
    });
  }
};
