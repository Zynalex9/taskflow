import { Router } from "express";
import {
  changePassword,
  changeProfilePicture,
  loginUser,
  logOutUser,
  registerUser,
} from "../controller/user.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import { verify } from "crypto";
import { createBoard, createList, createWorkSpace } from "../controller/workspace.controller";

const userRouter = Router();
const workSpaceRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "profilePicture", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logOutUser);
userRouter.route("/change-password").patch(verifyJWT, changePassword);
userRouter
  .route("/change-profile-picture")
  .patch(
    verifyJWT,
    upload.fields([{ name: "newPicture", maxCount: 1 }]),
    changeProfilePicture
  );
export { userRouter };

workSpaceRouter.route("/create-workspace").post(verifyJWT, createWorkSpace);
workSpaceRouter.route("/create-board").post(verifyJWT, createBoard);
workSpaceRouter.route("/create-list").post(verifyJWT, createList);
export {workSpaceRouter}