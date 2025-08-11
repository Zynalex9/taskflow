import { Request, Response } from "express";
import { UserModel } from "../../models/user.model";
import bcryptjs from "bcryptjs";
import { UploadOnCloudinary } from "../../utils/cloudinary";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  checkRequiredBody,
  deleteIfExists,
  findData,
  generateOTP,
  notFound,
} from "../../utils/helpers";
import ApiResponse from "../../utils/ApiResponse";
import { forgetPasswordEmail, welcomeEmail } from "../../utils/mailer";
import mongoose from "mongoose";
import { workSpaceModel } from "../../models/workspace.model";
import { ListModel } from "../../models/list.models";
import { boardModel } from "../../models/board.models";
import { CardModel } from "../../models/card.model";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CheckListModel } from "../../models/card.checklist.model";
import jwt from "jsonwebtoken";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../..";
import { getIO } from "../../socket";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, firstName, secondName } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Please provide all the details" });
      return;
    }

    if (!req.files) {
      res.status(400).json({ message: "Please provide a profile picture" });
      return;
    }
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    const existingUser = await UserModel.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const localPath = files?.profilePicture?.[0]?.path;

    if (!localPath) {
      res
        .status(400)
        .json({ message: "Profile picture file missing", success: false });
      return;
    }

    const uploadedPfp = await UploadOnCloudinary({ localFilePath: localPath });

    if (!uploadedPfp) {
      res.status(500).json({
        message: "Error in uploading profile picture",
        success: false,
      });
      return;
    }

    const newUser = await UserModel.create({
      firstName,
      secondName,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      profilePicture: uploadedPfp.url,
    });
    welcomeEmail(email, username);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      res
        .status(404)
        .json({ message: "Please enter all details", success: false });
      return;
    }
    const normalizedLogin = login.toLowerCase();
    const user = await UserModel.findOne({
      $or: [{ username: normalizedLogin }, { email: login.normalizedLogin }],
    });
    if (!user) {
      res
        .status(404)
        .json({ message: "Incorrect username or email", success: false });
      return;
    }
    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword) {
      res.status(401).json({ message: "Incorrect password", success: false });
      return;
    }
    const accessToken = user.GenerateAccessToken();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    };
    await redisClient.lpush(`user:${user._id}`, "You logged in");
    await redisClient.expire(`user:${user._id}`, 86400);

    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json({ message: "User logged in", user, success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  } finally {
    console.log("req received for login");
  }
};
export const logOutUser = async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  await redisClient.lpush(`user:${req.user._id}`, "You logged out");
  await redisClient.expire(`user:${req.user._id}`, 86400);
  res
    .status(201)
    .clearCookie("accessToken", options)
    .json({ message: "User logged Out" });
};
export const changeDetails = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    if (username) {
      const alreadyTaken = await UserModel.findOne({ username });
      if (alreadyTaken) {
        res
          .status(400)
          .json({ message: "Username is taken choose another one" });
        return;
      }
      user.username = username;
    }
    if (password) {
      user.password = await bcryptjs.hash(password, 10);
    }
    if (email) {
      user.email = email;
    }
    await user.save();
    res.status(200).json({
      message: "User details updated  successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const changeProfilePicture = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const localFilePath = files?.newPicture?.[0].path;
    if (!localFilePath) {
      res
        .status(400)
        .json({ message: "Profile picture file missing", success: false });
      return;
    }
    const updatedPfp = await UploadOnCloudinary({ localFilePath });
    if (!updatedPfp) {
      res.status(500).json({
        message: "Error in updating profile picture",
        success: false,
      });
      return;
    }
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        profilePicture: updatedPfp.url,
      },
      {
        new: true,
      }
    );
    res.status(201).json(new ApiResponse(200, user, "Profile Picture Changed"));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
};
export const GetUserDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user, success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const required = ["oldPassword", "newPassword"];
    if (!checkRequiredBody(req, res, required)) return;
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      notFound(user, "User", res);
      return;
    }
    const isValidOldPassword = await bcryptjs.compare(
      oldPassword,
      user.password
    );
    if (!isValidOldPassword) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid old password"));
      return;
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await redisClient.lpush(`user:${user._id}`, "You reset your password");
    await redisClient.expire(`user:${req.user._id}`, 86400);

    res.status(200).json(new ApiResponse(200, user, "Password changed"));
  }
);
export const sendForgetPasswordOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const otpRequestLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "otp-req",
      points: 5,
      duration: 300,
    });
    const required = ["login"];
    if (!checkRequiredBody(req, res, required)) return;
    const { login } = req.body;
    await otpRequestLimiter.consume(login);
    try {
      await otpRequestLimiter.consume(login);
    } catch (rejRes) {
      res
        .status(429)
        .json(
          new ApiResponse(
            429,
            {},
            "Too many OTP requests. Please wait 5 minutes before trying again."
          )
        );
      return;
    }
    const user = await UserModel.findOne({
      $or: [
        {
          email: login,
        },
        {
          username: login,
        },
      ],
    });
    if (!user) {
      notFound(user, "User", res);
      return;
    }
    const OTP = generateOTP();
    await redisClient.del(`OTP:${login}`);
    await redisClient.set(`OTP:${login}`, OTP, "EX", 600);
    forgetPasswordEmail(user.email, user.username, OTP);
    res
      .status(200)
      .json(new ApiResponse(200, { user }, "OTP sent to your email !!"));
  }
);
export const verifyOTP = asyncHandler(async (req, res) => {
  const otpVerificationLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    duration: 300,
    points: 5,
    keyPrefix: "otp-verify",
  });
  const required = ["login", "OTP"];
  if (!checkRequiredBody(req, res, required)) return;

  const { login, OTP } = req.body;

  try {
    await otpVerificationLimiter.consume(login);
  } catch (rejRes) {
    res
      .status(429)
      .json(
        new ApiResponse(
          429,
          {},
          "Too many OTP requests. Please wait 5 minutes before trying again."
        )
      );
    return;
  }

  const cachedOTP = await redisClient.get(`OTP:${login}`);

  if (OTP !== cachedOTP) {
    res.status(401).json(new ApiResponse(401, {}, "Invalid OTP"));
    return;
  }

  const user = await UserModel.findOne({
    $or: [{ email: login }, { username: login }],
  });

  if (!user) {
    notFound(user, "User", res);
    return;
  }

  const tokenData = { userId: user._id, login };
  const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "5m",
  });

  await redisClient.set(`TOKEN:${login}`, token, "EX", 300);
  await otpVerificationLimiter.delete(login);

  res
    .status(200)
    .json(
      new ApiResponse(200, token, "OTP is valid you can change your password")
    );
});
export const forgetPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const required = ["login", "token", "newPassword"];
    if (!checkRequiredBody(req, res, required)) return;
    const { login, token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as {
      login: string;
      userId: string;
    };
    console.log("decoded", decoded);
    console.log("token", token);
    const savedToken = await redisClient.get(`TOKEN:${decoded.login}`);
    if (savedToken !== token) {
      res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid or expired reset token"));
      return;
    }
    const user = await UserModel.findOne({
      $or: [
        {
          email: login,
        },
        {
          username: login,
        },
      ],
    });
    if (!user) {
      notFound(user, "User", res);
      return;
    }
    const userNewPassword = await bcryptjs.hash(newPassword, 10);
    user.password = userNewPassword;
    user.resetOTP = "";
    user.resetOTPExpiry = undefined;
    await user.save();
    await redisClient.del(`OTP:${user.email}`);
    res.status(200).json(new ApiResponse(200, {}, "Password Changed"));
  }
);

export const deleteUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    session.startTransaction();
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      session.abortTransaction();
      res.status(404).json(new ApiResponse(404, {}, "No user found"));
      return;
    }
    const workspaces = await workSpaceModel
      .find({ admin: user._id })
      .session(session);
    for (const workspace of workspaces) {
      const boards = await boardModel
        .find({ workspace: workspace._id })
        .session(session);
      if (boards.length === 0) {
        await workSpaceModel.deleteOne({ _id: workspace._id }).session(session);
        continue;
      }
      const boardIds = boards.flatMap((b) => b._id);
      const lists = await ListModel.find({ board: { $in: boardIds } }).session(
        session
      );
      if (lists.length === 0) {
        await boardModel
          .deleteMany({ _id: { $in: boardIds } })
          .session(session);
        await workSpaceModel.deleteOne({ _id: workspace._id }).session(session);
        continue;
      }
      const listIds = lists.flatMap((l) => l._id);
      const cards = await CardModel.find({ list: { $in: listIds } }).session(
        session
      );
      if (cards.length === 0) {
        await ListModel.deleteMany({ _id: { $in: listIds } }).session(session);
        await boardModel
          .deleteMany({ _id: { $in: boardIds } })
          .session(session);
        await workSpaceModel.deleteOne({ _id: workspace._id }).session(session);
        continue;
      }
      const cardIds = cards.flatMap((c) => c._id);
      const allCommentsIds = findData(cards, "comments");
      const allLabelsIds = findData(cards, "labels");
      const allAttachmentsId = findData(cards, "attachments");
      const allChecklistIDs = findData(cards, "checklist");
      await deleteIfExists(commentsModel, allCommentsIds, session);
      await deleteIfExists(CardLabelModel, allLabelsIds, session);
      await deleteIfExists(CardAttachmentModel, allAttachmentsId, session);
      await deleteIfExists(CheckListModel, allChecklistIDs, session);
      await CardModel.deleteMany({ _id: { $in: cardIds } }).session(session);
      await ListModel.deleteMany({ _id: { $in: listIds } }).session(session);
      await boardModel.deleteMany({ _id: { $in: boardIds } }).session(session);
      await workSpaceModel.deleteOne({ _id: workspace._id }).session(session);
    }
    await UserModel.deleteOne({ _id: user._id }).session(session);

    await session.commitTransaction();

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      await session.abortTransaction();

      console.log(error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};
export const activityLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const logs = await redisClient.lrange(`user:${userId}`, 0, 4);
    res.status(200).json(new ApiResponse(200, logs));
  }
);
export const findByIdentifier = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier } = req.params;
    if (!identifier) {
      res.status(400).json(new ApiResponse(400, {}, "identifier is required"));
      return;
    }
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("-password");
    if (!user) {
      res.status(404).json(new ApiResponse(404, {}, "User not found"));
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(200, user, "User found by identifier"));
  }
);
export const inviteLinkGenerate = asyncHandler(async (req, res) => {
  const { entityId, entityType } = req.body;

  if (!entityId || !entityType) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "entityId and entityType are required"));
    return;
  }

  // Validate that the type is one of the allowed values
  const allowedTypes = ["workspace", "board", "card", "list"];
  if (!allowedTypes.includes(entityType)) {
    res.status(400).json(new ApiResponse(400, {}, "Invalid entity type"));
    return;
  }

  const payload = {
    entityId,
    entityType,
    createdAt: Date.now(),
  };

  const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "1h",
  });

  res.json(
    new ApiResponse(200, {
      inviteLink: token,
    })
  );
});

export const joinEntityViaInvite = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json(new ApiResponse(400, {}, "Token is required"));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as {
      entityId: string;
      entityType: string;
      createdAt: number;
    };
  } catch (err) {
    res.status(400).json(new ApiResponse(400, {}, "Invalid or expired token"));
    return;
  }
  const io = getIO();

  switch (payload.entityType) {
    case "workspace":
      await workSpaceModel.updateOne(
        { _id: payload.entityId, "members.user": { $ne: req.user.id } },
        { $push: { members: { user: req.user.id, role: "member" } } }
      );
      io.to(payload.entityId.toString()).emit("workspaceAdminUpdated", null);

      break;

    case "board": {
      const boardDoc = await boardModel.findById(payload.entityId);
      if (!boardDoc) {
        res.status(404).json(new ApiResponse(404, {}, "Board not found"));
        return;
      }

      await boardModel.updateOne(
        { _id: payload.entityId, "members.user": { $ne: req.user.id } },
        { $push: { members: { user: req.user.id, role: "member" } } }
      );

      if (boardDoc.workspace) {
        await workSpaceModel.updateOne(
          { _id: boardDoc.workspace, "members.user": { $ne: req.user.id } },
          { $push: { members: { user: req.user.id, role: "member" } } }
        );
      }
      io.to(boardDoc.workspace.toString()).emit("boardUpdated", boardDoc);
      io.to(boardDoc.workspace.toString()).emit("workspaceAdminUpdated", boardDoc);
      break;
    }

    default:
      res.status(400).json(new ApiResponse(400, {}, "Invalid type"));
      return;
  }

  res.json(new ApiResponse(200, {}, "Joined successfully"));
});
