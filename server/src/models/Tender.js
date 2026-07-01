import mongoose from "mongoose";

const tenderStatus = ["draft", "submitted", "under_review", "clarification_requested", "awarded", "declined", "closed"];

const tenderItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    uom: { type: String, trim: true, default: "each" },
    unitPriceCents: { type: Number, min: 0 },
  },
  { _id: true, timestamps: true },
);

const tenderDocumentSchema = new mongoose.Schema(
  {
    file: { type: mongoose.Schema.Types.ObjectId, ref: "StoredFile", required: true },
    docType: { type: String, trim: true, default: "specification" },
    fileName: { type: String, required: true },
    storagePath: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: true, timestamps: true },
);

const statusHistorySchema = new mongoose.Schema(
  {
    fromStatus: { type: String, enum: tenderStatus },
    toStatus: { type: String, enum: tenderStatus, required: true },
    note: { type: String, trim: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: true, timestamps: true },
);

const tenderSchema = new mongoose.Schema(
  {
    orgId: { type: String, required: true, index: true },
    reference: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    buyerName: { type: String, trim: true },
    description: { type: String, trim: true },
    submissionDeadline: { type: Date },
    valueCents: { type: Number, min: 0 },
    status: { type: String, enum: tenderStatus, default: "draft", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [tenderItemSchema],
    documents: [tenderDocumentSchema],
    history: [statusHistorySchema],
  },
  { timestamps: true },
);

export const TENDER_STATUSES = tenderStatus;
export const Tender = mongoose.model("Tender", tenderSchema);
