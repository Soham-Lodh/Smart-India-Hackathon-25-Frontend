import User from "../models/User.js";
import { clearAuthCookie, cookieName, verifyAuthToken } from "../services/auth.js";

export async function requireUser(req, res, next) {
  try {
    const token = req.cookies?.[cookieName];

    if (!token) {
      const error = new Error("Authentication token is required");
      error.status = 401;
      throw error;
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    clearAuthCookie(res);
    next(error);
  }
}
