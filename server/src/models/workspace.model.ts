import mongoose, { Mongoose, Schema } from "mongoose";

const workspaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  admin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  calender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calender",
  },
  boards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  }],
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },
    },
  ],
}, { timestamps: true });


export const workSpaceModel = mongoose.model("Workspace", workspaceSchema);