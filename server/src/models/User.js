import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["admin", "procurement_officer", "finance", "it_manager", "compliance", "executive"];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    jobTitle: { type: String, trim: true, default: "" },
    organization: {
      name: { type: String, trim: true, default: "" },
      id: { type: String, trim: true, default: "" },
    },
    roles: { type: [String], enum: roles, default: ["procurement_officer"] },
    mfaEnrolled: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = (password) => bcrypt.hash(password, 12);

userSchema.methods.toSession = function toSession() {
  return {
    id: this.id,
    email: this.email,
    full_name: this.fullName,
    phone: this.phone,
    job_title: this.jobTitle,
    org_id: this.organization?.id || null,
    organization_name: this.organization?.name || null,
    roles: this.roles,
    mfa_enrolled: this.mfaEnrolled,
  };
};

export const USER_ROLES = roles;
export const User = mongoose.model("User", userSchema);
