import { createPublicSubmission } from "../services/public.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const postEnquiry = async (req, res) => {
  const submission = await createPublicSubmission({
    type: "enquiry",
    contact: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      organization: req.body.organization,
    },
    payload: req.body,
    file: req.file,
  });
  sendSuccess(res, { id: submission.id }, 201);
};

export const postQuoteRequest = async (req, res) => {
  const submission = await createPublicSubmission({
    type: "quote_request",
    contact: {
      name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      organization: req.body.company_name,
    },
    payload: req.body,
    file: req.file,
  });
  sendSuccess(res, { id: submission.id }, 201);
};
