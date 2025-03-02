import mongoose from "mongoose";

const teamSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  admin:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });
export const TeamSpaceModel = mongoose.model("TeamSpace", teamSpaceSchema);