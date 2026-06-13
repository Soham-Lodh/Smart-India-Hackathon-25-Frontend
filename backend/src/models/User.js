import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    country: { type: String, default: "" },
    role: { type: String, default: "" },
    experienceLevel: { type: String, default: "" },
    favoriteBreeds: { type: String, default: "" },
    farmType: { type: String, default: "" },
    equipment: { type: String, default: "" },
    preferredLanguage: { type: String, default: "" },
    cityOrRegion: { type: String, default: "" },
    availability: { type: String, default: "" },
    tags: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    profile: { type: profileSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);
