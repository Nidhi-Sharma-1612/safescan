import textract from "textract";
import path from "path";
import { dequeueJob } from "../queues/jobQueue";
import File from "../models/File";

const DANGEROUS_KEYWORDS = ["rm -rf", "eval", "bitcoin"];

const extractText = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error: any, text: string | null) => {
      if (error) reject(error);
      else resolve(text || "");
    });
  });
};

const simulateScan = async () => {
  const job = dequeueJob();
  if (!job) return;

  console.log(`🧪 Scanning file ID: ${job.fileId}`);

  const file = await File.findById(job.fileId);
  if (!file) {
    console.log("⚠️ File not found in DB");
    return;
  }

  const delay = Math.floor(Math.random() * 3000) + 2000;
  await new Promise((res) => setTimeout(res, delay));

  const filePath = path.resolve(file.path);
  let content = "";

  try {
    content = await extractText(filePath);
  } catch (err) {
    console.error("Error extracting file text:", err);
  }

  const isInfected = DANGEROUS_KEYWORDS.some((kw) =>
    content.toLowerCase().includes(kw)
  );

  file.status = "scanned";
  file.result = isInfected ? "infected" : "clean";
  file.scannedAt = new Date();
  await file.save();

  console.log(
    `✅ Scan complete. Result: ${file.result.toUpperCase()} (${file.filename})`
  );
};

export const startScanWorker = () => {
  setInterval(simulateScan, 1000);
};
