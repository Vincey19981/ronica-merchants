import { PublicSubmission } from "../models/PublicSubmission.js";
import { persistUploadedFile } from "./file.service.js";

export const createPublicSubmission = async ({ type, contact, payload, file }) => {
  const stored = await persistUploadedFile(file, { scope: "quote" });
  const submission = await PublicSubmission.create({
    type,
    ...contact,
    payload,
    file: stored?.id,
  });

  if (stored) {
    stored.entityId = submission.id;
    await stored.save();
  }

  return submission;
};
