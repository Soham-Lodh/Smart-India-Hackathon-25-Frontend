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

    const messageIds = activities
      .map((activity) => activity.metadata?.messageId)
      .filter(Boolean);
    const scanIds = activities
      .map((activity) => activity.metadata?.scanId)
      .filter(Boolean);

    const [messages, scans] = await Promise.all([
      ChatMessage.find({ _id: { $in: messageIds }, user: req.user._id }),
      Scan.find({ _id: { $in: scanIds }, user: req.user._id }),
    ]);

    const messagesById = new Map(messages.map((message) => [message._id.toString(), message]));
    const scansById = new Map(scans.map((scan) => [scan._id.toString(), scan]));
    const enrichedActivities = activities.map((activity) => {
      const item = activity.toObject();
      const message = item.metadata?.messageId
        ? messagesById.get(item.metadata.messageId.toString())
        : null;
      const scan = item.metadata?.scanId
        ? scansById.get(item.metadata.scanId.toString())
        : null;

      return {
        ...item,
        result: {
          message: message
            ? {
                question: message.question,
                answer: message.answer,
              }
            : null,
          scan: scan
            ? {
                imageUrl: scan.imageUrl,
                prediction: scan.prediction,
                confidence: scan.confidence,
                explanation: scan.explanation,
                status: scan.status,
              }
            : null,
        },
      };
    });

    res.json({
      stats: {
        totalActivities,
        identifications,
        voiceQueries,
        chatMessages,
      },
      activities: enrichedActivities,
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
