import { z } from "zod";
import { USER_ROLES } from "../models/User.js";

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  job_title: z.string().trim().max(120).optional(),
  organization_name: z.string().trim().max(200).optional(),
  org_id: z.string().trim().max(120).optional(),
  role: z.enum(USER_ROLES).optional(),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
});
