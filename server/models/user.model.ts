import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    workspace: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Workspace",
      },
    ],
    teamspace: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Teamspace",
      },
    ],
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
