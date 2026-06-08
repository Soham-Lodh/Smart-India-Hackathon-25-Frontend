import express from "express";
import multer from "multer";
import { requireUser } from "../middleware/requireUser.js";
import Scan from "../models/Scan.js";
import { createActivity } from "../services/activity.js";
import { uploadImageBuffer } from "../services/cloudinary.js";
import { identifyCattleBreed } from "../services/openrouter.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", requireUser, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image uploads are allowed" });
    }

    const uploaded = await uploadImageBuffer(req.file.buffer, req.file.originalname);
    const prediction = await identifyCattleBreed(uploaded.secure_url);

    const scan = await Scan.create({
      user: req.user._id,
      imageUrl: uploaded.secure_url,
      cloudinaryPublicId: uploaded.public_id,
      prediction: prediction.breed,
      confidence: prediction.confidence,
      explanation: prediction.explanation,
    });

    await createActivity(
      req.user._id,
      "identification",
      `${scan.prediction} identified`,
      `Breed identified with ${scan.confidence}% confidence`,
      { scanId: scan._id, prediction: scan.prediction, confidence: scan.confidence }
    );

    res.status(201).json({ scan });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/confirm", requireUser, async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user._id });
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    const isCorrect = Boolean(req.body.isCorrect);
    scan.userConfirmed = true;
    scan.userMarkedCorrect = isCorrect;
    scan.status = isCorrect ? "correct" : "incorrect";
    await scan.save();

    await createActivity(
      req.user._id,
      "confirmation",
      `Prediction marked ${scan.status}`,
      `${scan.prediction} identification was marked ${scan.status}`,
      { scanId: scan._id, status: scan.status }
    );

    res.json({ scan });
  } catch (error) {
    next(error);
  }
});

export default router;
