import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    // Add to professional.model.js
withdrawalDetails: {
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  upiId: String,
  preferredMethod: {
    type: String,
    enum: ["bank", "upi"],
    default: "bank"
  }
},
    pricing: {
      type: Number,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  { timestamps: true },
);

professionalSchema.pre(/^find/, function (next) {
  this.populate("user", "name email");
});
export const Professional = mongoose.model("Professional", professionalSchema);
