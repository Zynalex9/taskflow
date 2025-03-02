import mongoose, { Mongoose, Schema } from "mongoose";
const TeamTask = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["not started", "doing", "completed"],
    default: "not started",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });   
export const TaskModel = mongoose.model("Task", TeamTask);
