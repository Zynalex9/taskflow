import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  GenerateAccessToken: () => string;
  GenerateRefreshToken: () => string;
  profilePicture: string;
  workspace?: mongoose.Schema.Types.ObjectId[];
  teamspace?: mongoose.Schema.Types.ObjectId[];
  accessToken?: string;
  refreshToken?: string;
  resetOTP?: string;
  resetOTPExpiry?:Date;
}
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
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
  },

  { timestamps: true }
);

userSchema.methods.GenerateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "3d",
  });
};

userSchema.methods.GenerateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "15d",
  });
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
