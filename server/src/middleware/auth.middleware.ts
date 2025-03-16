// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(404).json({ message: "No token found" });
      return;
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET!
    ) as ITokenPayload;
    const user = await UserModel.findById(decodedToken.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next()
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
