import { Router } from "express";
import { registerUser } from "../controller/user.controller";
import { upload } from "../middleware/multer.middleware";

const userRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "profilePicture", maxCount: 1 }]), registerUser);

export { userRouter };