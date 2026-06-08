import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import Activity from "../models/Activity.js";
import ChatMessage from "../models/ChatMessage.js";
import Scan from "../models/Scan.js";

const router = express.Router();

router.get("/", requireUser, async (req, res, next) => {
  try {
    const [activities, totalActivities, identifications, voiceQueries, chatMessages] = await Promise.all([
      Activity.find({ user: req.user._id }).sort({ createdAt: -1 }),
      Activity.countDocuments({ user: req.user._id }),
      Scan.countDocuments({ user: req.user._id }),
      Activity.countDocuments({ user: req.user._id, type: "voice" }),
      ChatMessage.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      stats: {
        totalActivities,
        identifications,
        voiceQueries,
        chatMessages,
      },
      activities,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/export", requireUser, async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 });
    const lines = [
      `AgriScan history export`,
      `User: ${req.user.username} <${req.user.email}>`,
      `Generated: ${new Date().toISOString()}`,
      "",
      ...activities.map((activity) => {
        const when = activity.createdAt.toLocaleString();
        return `[${when}] ${activity.type.toUpperCase()} - ${activity.title}\n${activity.description}`;
      }),
    ];

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=agriscan-history.txt");
    res.send(lines.join("\n\n"));
  } catch (error) {
    next(error);
  }
});

export default router;
