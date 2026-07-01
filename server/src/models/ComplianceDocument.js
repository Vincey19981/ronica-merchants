import mongoose from "mongoose";

const complianceStatuses = ["valid", "expired", "pending_review", "rejected"];

const complianceDocumentSchema = new mongoose.Schema(
  {
    orgId: { type: String, required: true, index: true },
    docType: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "StoredFile", required: true },
    storagePath: { type: String, required: true },
    issuedAt: { type: Date },
    expiresAt: { type: Date },
    status: { type: String, enum: complianceStatuses, default: "pending_review", index: true },
    notes: { type: String, trim: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const COMPLIANCE_STATUSES = complianceStatuses;
export const ComplianceDocument = mongoose.model("ComplianceDocument", complianceDocumentSchema);
