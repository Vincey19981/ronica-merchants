import { ApiError } from "../utils/apiError.js";

export const validate = (schema, source = "body") => (req, _res, next) => {
  const parsed = schema.safeParse(req[source]);
  if (!parsed.success) {
    return next(new ApiError(400, "Validation failed", parsed.error.flatten()));
  }
  req[source] = parsed.data;
  next();
};
