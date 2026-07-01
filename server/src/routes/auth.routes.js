import { Router } from "express";
import { z } from "zod";
import { User, USER_ROLES } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMessage, sendSuccess } from "../utils/apiResponse.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/tokens.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  job_title: z.string().trim().max(120).optional(),
  organization_name: z.string().trim().max(200).optional(),
  org_id: z.string().trim().max(120).optional(),
  role: z.enum(USER_ROLES).optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
});

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) throw new ApiError(409, "An account with that email already exists");

    const userCount = await User.estimatedDocumentCount();
    const requestedRole = req.body.role;
    const roles = userCount === 0 ? ["admin"] : [requestedRole || "procurement_officer"];

    const user = await User.create({
      email: req.body.email,
      passwordHash: await User.hashPassword(req.body.password),
      fullName: req.body.full_name,
      phone: req.body.phone || "",
      jobTitle: req.body.job_title || "",
      organization: {
        name: req.body.organization_name || "",
        id: req.body.org_id || req.body.organization_name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
      },
      roles,
    });

    const token = signToken(user);
    setAuthCookie(res, token);
    sendSuccess(res, { user: user.toSession(), token }, 201);
  }),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+passwordHash");
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    setAuthCookie(res, token);
    sendSuccess(res, { user: user.toSession(), token });
  }),
);

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  sendMessage(res, "Logged out");
});

router.get("/me", requireAuth, (req, res) => {
  sendSuccess(res, { user: req.user.toSession() });
});

export default router;
