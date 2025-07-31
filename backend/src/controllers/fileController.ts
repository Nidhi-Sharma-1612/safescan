import { Request, Response } from "express";
import File from "../models/File";

export const getAllFiles = async (_req: Request, res: Response) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("Failed to fetch files:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};
