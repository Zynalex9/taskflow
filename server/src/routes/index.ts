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
import {
  createBoard,
  createCard,
  createList,
  createWorkSpace,
} from "../controller/workspace.controller";
import {
  addAttachment,
  addChecklist,
  addComment,
  addLabel,
  joinCard,
  leaveCard,
} from "../controller/card.controller";

const userRouter = Router();
const workSpaceRouter = Router();
const cardRouter = Router();

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
workSpaceRouter.route("/create-card").post(verifyJWT, createCard);
export { workSpaceRouter };

cardRouter.route("/join-card").post(verifyJWT, joinCard);
cardRouter.route("/leave-card").post(verifyJWT, leaveCard);
cardRouter.route("/add-label").post(verifyJWT, addLabel);
cardRouter.route("/add-comment").post(verifyJWT, addComment);
cardRouter
  .route("/add-attachment")
  .post(
    verifyJWT,
    upload.fields([{ name: "uploadedFile", maxCount: 1 }]),
    addAttachment
  );
cardRouter.route("/add-checklist").post(verifyJWT, addChecklist);

export { cardRouter };
