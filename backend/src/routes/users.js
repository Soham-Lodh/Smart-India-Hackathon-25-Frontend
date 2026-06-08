import express from "express";
import multer from "multer";
import { requireUser } from "../middleware/requireUser.js";
import { createActivity } from "../services/activity.js";
import { uploadImageBuffer } from "../services/cloudinary.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

function isValidAdultDob(dob) {
  if (!dob) return true;

  const date = new Date(`${dob}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - date.getUTCMonth();
  const dayDiff = today.getUTCDate() - date.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 18 && age <= 100;
}

router.get("/me", requireUser, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/me", requireUser, async (req, res, next) => {
  try {
    const allowedFields = [
      "fullName",
      "phone",
      "dob",
      "country",
      "role",
      "experienceLevel",
      "favoriteBreeds",
      "farmType",
      "equipment",
      "preferredLanguage",
      "cityOrRegion",
      "availability",
      "tags",
      "avatarUrl",
    ];

    const profile = req.user.profile?.toObject?.() || {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body.profile || {}, field)) {
        profile[field] = req.body.profile[field] || "";
      }
    }

    if (!isValidAdultDob(profile.dob)) {
      return res.status(400).json({ message: "Age must be between 18 and 100 years" });
    }

    req.user.profile = profile;
    await req.user.save();

    await createActivity(
      req.user._id,
      "profile",
      "Profile updated",
      "Updated editable profile details"
    );

    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

router.post("/me/avatar", requireUser, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image uploads are allowed" });
    }

    const uploaded = await uploadImageBuffer(
      req.file.buffer,
      req.file.originalname,
      "agriscan/profiles"
    );

    const profile = req.user.profile?.toObject?.() || {};
    profile.avatarUrl = uploaded.secure_url;
    req.user.profile = profile;
    await req.user.save();

    await createActivity(
      req.user._id,
      "profile",
      "Profile image updated",
      "Uploaded a new profile image"
    );

    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

export default router;
