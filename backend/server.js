import "./src/config/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { connectDb } from "./src/config/db.js";
import aiRoutes from "./src/routes/ai.js";
import authRoutes from "./src/routes/auth.js";
import dashboardRoutes from "./src/routes/dashboard.js";
import historyRoutes from "./src/routes/history.js";
import scanRoutes from "./src/routes/scans.js";
import userRoutes from "./src/routes/users.js";
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [`${process.env.CLIENT_ORIGIN}`, "http://localhost:5173", "https://smart-india-hackathon-25-frontend-n.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/history", historyRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`AgriScan backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });

  app.get("/",(req,res)=>{
    res.send("AgriScan backend")
  })