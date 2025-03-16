import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcryptjs from "bcryptjs";
import { UploadOnCloudinary } from "../utils/cloudinary";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Please provide all the details" });
      return;
    }

    if (!req.files) {
      res.status(400).json({ message: "Please provide a profile picture" });
      return;
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
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
      username,
      email,
      password: hashedPassword,
      profilePicture: uploadedPfp.url,
    });

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
    }
    const user = await UserModel.findOne({
      $or: [{ username: login }, { email: login }],
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
      secure: true,
    };
    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json({ message: "User logged in", success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const logOutUser = async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(201)
    .clearCookie("accessToken", options)
    .json({ message: "User logged Out" });
};
