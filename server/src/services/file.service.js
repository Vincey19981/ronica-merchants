import { StoredFile } from "../models/StoredFile.js";

export const persistUploadedFile = (file, { owner, scope, entityId } = {}) => {
  if (!file) return null;

  return StoredFile.create({
    owner,
    scope,
    entityId,
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storagePath: file.path,
  });
};
