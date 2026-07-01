import { ApiError } from "../utils/apiError.js";

export const requireRole = (...roles) => (req, _res, next) => {
  const currentRoles = req.user?.roles ?? [];
  if (currentRoles.includes("admin") || roles.some((role) => currentRoles.includes(role))) {
    return next();
  }
  next(new ApiError(403, "You do not have permission to perform this action"));
};
