import { Router } from "express";
import {
  downloadComplianceDocument,
  getComplianceDocuments,
  patchComplianceDocument,
  postComplianceDocument,
} from "../controllers/compliance.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createComplianceSchema, reviewComplianceSchema } from "../validators/compliance.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getComplianceDocuments));
router.post("/", upload.single("file"), validate(createComplianceSchema), asyncHandler(postComplianceDocument));
router.patch("/:id", requireRole("admin", "compliance"), validate(reviewComplianceSchema), asyncHandler(patchComplianceDocument));
router.get("/:id/download", asyncHandler(downloadComplianceDocument));

export default router;
