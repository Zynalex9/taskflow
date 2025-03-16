import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controller/user.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "profilePicture", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT,logOutUser);
export { userRouter };
