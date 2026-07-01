import multer from "multer";

export const errorHandler = (err, _req, res, _next) => {
  const isMulter = err instanceof multer.MulterError;
  const statusCode = err.statusCode || (isMulter ? 400 : 500);
  const message = isMulter ? err.message : err.message || "Unexpected server error";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: err.details,
    },
  });
};
