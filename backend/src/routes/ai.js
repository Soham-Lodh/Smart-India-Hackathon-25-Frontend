import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import ChatMessage from "../models/ChatMessage.js";
import { createActivity } from "../services/activity.js";
import { askAssistant } from "../services/openrouter.js";

const router = express.Router();

router.post("/chat", requireUser, async (req, res, next) => {
  try {
    const question = String(req.body.question || "").trim();
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const answer = await askAssistant(question);
    const message = await ChatMessage.create({
      user: req.user._id,
      question,
      answer,
    });

    await createActivity(
      req.user._id,
      "chat",
      "AI question answered",
      question,
      { messageId: message._id }
    );

    res.json({ message });
  } catch (error) {
    next(error);
  }
});

router.post("/voice", requireUser, async (req, res, next) => {
  try {
    const question = String(req.body.question || "").trim();
    if (!question) {
      return res.status(400).json({ message: "Recognized voice text is required" });
    }

    const answer = await askAssistant(question);
    const message = await ChatMessage.create({
      user: req.user._id,
      question,
      answer,
    });

    await createActivity(
      req.user._id,
      "voice",
      "Voice question answered",
      question,
      { messageId: message._id }
    );

    res.json({ message });
  } catch (error) {
    next(error);
  }
});

router.get("/chat", requireUser, async (req, res, next) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(50);

    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

export default router;
