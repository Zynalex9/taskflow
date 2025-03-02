import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcryptjs from "bcryptjs";
import { UploadOnCloudinary } from "../utils/cloudinary";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
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
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const localPath = files?.profilePicture?.[0]?.path;

    if (!localPath) {
      res.status(400).json({ message: "Profile picture file missing" });
      return;
    }

    const uploadedPfp = await UploadOnCloudinary({ localFilePath: localPath });
    
    if (!uploadedPfp) {
      res.status(500).json({ message: "Error in uploading profile picture" });
      return;
    }

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: uploadedPfp.url
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};