import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    prediction: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    explanation: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending_confirmation", "correct", "incorrect"],
      default: "pending_confirmation",
    },
    userConfirmed: { type: Boolean, default: false },
    userMarkedCorrect: { type: Boolean, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
