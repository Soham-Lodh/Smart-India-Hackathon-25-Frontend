import express from "express";
import bcrypt from "bcryptjs";
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

function normalizePassword(password) {
  return String(password || "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendUserSession(res, user) {
  setAuthCookie(res, signAuthToken(user));
  res.json({ user });
}

router.post("/signup", async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = normalizePassword(req.body.password);

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (await User.exists({ username })) {
      return res.status(409).json({ message: "Username already taken" });
    }

    if (await User.exists({ email })) {
      return res.status(409).json({ message: "User with email is already logged in" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      passwordHash,
      profile: { fullName: username },
    });

    await Activity.create({
      user: user._id,
      type: "signup",
      title: "Account created",
      description: `${user.username} created an account`,
    });

    sendUserSession(res, user);
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.message = error.keyPattern?.username
        ? "Username already taken"
        : "User with email is already logged in";
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const identifier = String(req.body.identifier || "").trim();
    const password = normalizePassword(req.body.password);

    if (!identifier) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const query = identifier.includes("@")
      ? { email: normalizeEmail(identifier) }
      : { username: normalizeUsername(identifier) };
    const user = await User.findOne(query).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    await Activity.create({
      user: user._id,
      type: "login",
      title: "Logged in",
      description: `${user.username} opened the dashboard`,
    });

    sendUserSession(res, user);
  } catch (error) {
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
