import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import File from "../models/File";
import { enqueueJob } from "../queues/jobQueue";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = [".pdf", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowedExtensions.includes(ext)
      ? cb(null, true)
      : cb(new Error("Only PDF, DOCX, JPG, and PNG files are allowed."));
  },
}).single("file");

// Controller: Upload File
export const uploadFile = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const newFile = await File.create({
        filename: req.file.originalname,
        path: req.file.path,
        status: "pending",
        result: null,
        uploadedAt: new Date(),
        scannedAt: null,
      });

      enqueueJob({ fileId: newFile._id.toString() });
      console.log(`📥 Job enqueued for file ID: ${newFile._id}`);

      return res.status(201).json({ message: "File uploaded", file: newFile });
    } catch (error) {
      console.error("❌ Upload failed:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};
