import { authenticateUser, registerUser } from "../services/auth.service.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/tokens.js";
import { sendMessage, sendSuccess } from "../utils/apiResponse.js";

export const register = async (req, res) => {
  const user = await registerUser(req.body);
  const token = signToken(user);
  setAuthCookie(res, token);
  sendSuccess(res, { user: user.toSession(), token }, 201);
};

export const login = async (req, res) => {
  const user = await authenticateUser(req.body);
  const token = signToken(user);
  setAuthCookie(res, token);
  sendSuccess(res, { user: user.toSession(), token });
};

export const logout = (_req, res) => {
  clearAuthCookie(res);
  sendMessage(res, "Logged out");
};

export const getCurrentUser = (req, res) => {
  sendSuccess(res, { user: req.user.toSession() });
};
