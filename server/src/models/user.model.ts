import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

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
    accessToken:{
      type: String,
    },
    refreshToken:{
      type: String,
    }
  },
  { timestamps: true }
);

userSchema.methods.GenerateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET!,{
    expiresIn: "3d",
  });
};

userSchema.methods.GenerateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET!,{
    expiresIn: "15d",
  });
};


export const UserModel = mongoose.model("User", userSchema);
