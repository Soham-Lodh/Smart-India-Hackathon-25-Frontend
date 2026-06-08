import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "../services/auth.js";

const router = express.Router();

function normalizeUsername(username) {
  return String(username || "").trim();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.post("/login", async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body.username);
    const email = normalizeEmail(req.body.email);

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const existingByUsername = await User.findOne({ username });
    const existingByEmail = await User.findOne({ email });

    if (existingByUsername && existingByUsername.email !== email) {
      return res.status(409).json({ message: "Username is already used by another email" });
    }

    if (existingByEmail && existingByEmail.username !== username) {
      return res.status(409).json({ message: "Email is already used by another username" });
    }

    const user =
      existingByUsername ||
      (await User.create({
        username,
        email,
        profile: { fullName: username },
      }));

    await Activity.create({
      user: user._id,
      type: "login",
      title: "Logged in",
      description: `${user.username} opened the dashboard`,
    });

    setAuthCookie(res, signAuthToken(user));

    res.json({ user });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.message = "Username or email already exists";
    }
    next(error);
  }
});

router.get("/me", requireUser, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

export default router;
