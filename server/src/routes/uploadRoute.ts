import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController";

const router = express.Router();
const upload = multer(); // يمكن تهيئته لمسار مؤقت أو memory storage

router.post("/upload", upload.single("image"), uploadImage);

export default router;
