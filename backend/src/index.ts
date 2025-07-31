import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { uploadFile } from "./controllers/uploadController";
import { startScanWorker } from "./workers/scanWorker";
import { getAllFiles } from "./controllers/fileController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SafeScan API is running 🚀");
});
app.post("/upload", uploadFile);
app.get("/files", getAllFiles);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
  });
  startScanWorker();
  console.log("🌀 Scan worker started...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
