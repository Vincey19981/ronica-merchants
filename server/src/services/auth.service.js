import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

const normalizeOrganizationId = (body) =>
  body.org_id || body.organization_name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";

export const registerUser = async (body) => {
  const existing = await User.findOne({ email: body.email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with that email already exists");

  const userCount = await User.estimatedDocumentCount();
  const roles = userCount === 0 ? ["admin"] : [body.role || "procurement_officer"];

  return User.create({
    email: body.email,
    passwordHash: await User.hashPassword(body.password),
    fullName: body.full_name,
    phone: body.phone || "",
    jobTitle: body.job_title || "",
    organization: {
      name: body.organization_name || "",
      id: normalizeOrganizationId(body),
    },
    roles,
  });
};

export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();
  return user;
};
