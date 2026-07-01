import mongoose from "mongoose";

const publicSubmissionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["enquiry", "quote_request"], required: true, index: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    organization: { type: String, trim: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "StoredFile" },
  },
  { timestamps: true },
);

export const PublicSubmission = mongoose.model("PublicSubmission", publicSubmissionSchema);
