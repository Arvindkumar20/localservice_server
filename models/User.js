// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
    address: {
      type: String,
    },
    role: {
  type: String,
  enum: ["customer", "admin", "professional"],
  default: "customer",
},
    profilePicture: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
