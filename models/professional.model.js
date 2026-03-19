// models/professional.model.js
import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },

    categoryName: {
      type: String,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  { timestamps: true }
);

export const Professional = mongoose.model(
  "Professional",
  professionalSchema
);