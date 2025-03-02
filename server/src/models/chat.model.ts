import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamSpace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamSpace",
      required: true,
    },
    receivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    file: {
      type: String,
      enum: ["image", "video", "audio", "document"],
    },
    task: {
      description: {
        type: String,
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      dueDate: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("Chat", chatSchema);