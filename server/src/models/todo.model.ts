import mongoose, { Schema } from "mongoose";
const TodoSchema = new Schema({
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
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    files: [String],
    cover: {
      type: String,
      default: "#000000",
    },
    label: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["Highest", "High", "Medium", "Low", "Lowest", "Not Sure"],
    },
    checklist: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true, // Every todo must belong to a list
    },
  });
  
  export const TodoModel = mongoose.model("Todo", TodoSchema);
