import { Router } from "express";
import {
  downloadTenderDocument,
  getTenderById,
  getTenders,
  patchTender,
  patchTenderStatus,
  postTender,
  postTenderDocuments,
  removeTender,
} from "../controllers/tender.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTenderSchema, tenderStatusSchema, updateTenderSchema } from "../validators/tender.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getTenders));
router.post("/", requireRole("procurement_officer"), validate(createTenderSchema), asyncHandler(postTender));
router.get("/:id", asyncHandler(getTenderById));
router.patch("/:id", requireRole("procurement_officer"), validate(updateTenderSchema), asyncHandler(patchTender));
router.patch(
  "/:id/status",
  requireRole("procurement_officer", "compliance"),
  validate(tenderStatusSchema),
  asyncHandler(patchTenderStatus),
);
router.delete("/:id", requireRole("admin"), asyncHandler(removeTender));
router.post(
  "/:id/documents",
  requireRole("procurement_officer"),
  upload.array("documents", 10),
  asyncHandler(postTenderDocuments),
);
router.get("/:id/documents/:docId/download", asyncHandler(downloadTenderDocument));

export default router;
