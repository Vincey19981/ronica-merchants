import mongoose from "mongoose";

const storedFileSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    scope: { type: String, enum: ["tender", "compliance", "quote", "general"], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, default: "application/octet-stream" },
    sizeBytes: { type: Number, required: true },
    storagePath: { type: String, required: true },
  },
  { timestamps: true },
);

export const StoredFile = mongoose.model("StoredFile", storedFileSchema);
