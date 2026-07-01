import { Router } from "express";
import { postEnquiry, postQuoteRequest } from "../controllers/public.controller.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { enquirySchema, quoteSchema } from "../validators/public.validator.js";

const router = Router();

router.post("/enquiries", upload.single("file"), validate(enquirySchema), asyncHandler(postEnquiry));
router.post("/quote-requests", upload.single("file"), validate(quoteSchema), asyncHandler(postQuoteRequest));

export default router;
