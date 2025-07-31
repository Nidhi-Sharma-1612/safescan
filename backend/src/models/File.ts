import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFile {
  filename: string;
  path: string;
  status: "pending" | "scanned";
  result: "clean" | "infected" | null;
  uploadedAt: Date;
  scannedAt: Date | null;
}

const FileSchema: Schema = new Schema<IFile>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  status: { type: String, enum: ["pending", "scanned"], default: "pending" },
  result: { type: String, enum: ["clean", "infected", null], default: null },
  uploadedAt: { type: Date, default: Date.now },
  scannedAt: { type: Date, default: null },
});

export type FileDocument = IFile & Document<Types.ObjectId>;

export default mongoose.model<FileDocument>("File", FileSchema);
