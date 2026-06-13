import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import Activity from "../models/Activity.js";
import Scan from "../models/Scan.js";

const router = express.Router();

router.get("/", requireUser, async (req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalScans, confirmedScans, correctScans, monthlyScans, recentActivities] = await Promise.all([
      Scan.countDocuments({}),
      Scan.countDocuments({ userConfirmed: true }),
      Scan.countDocuments({ status: "correct" }),
      Scan.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    ]);

    const accuracy = confirmedScans ? Math.round((correctScans / confirmedScans) * 1000) / 10 : 0;

    res.json({
      stats: {
        totalScans,
        confirmedScans,
        correctScans,
        accuracy,
        monthlyScans,
      },
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
