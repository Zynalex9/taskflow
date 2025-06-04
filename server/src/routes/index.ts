import { Router } from "express";
import {
  activityLogs,
  changeDetails,
  changeProfilePicture,
  deleteUser,
  forgetPasswordReset,
  GetUserDetail,
  loginUser,
  logOutUser,
  registerUser,
  resetPassword,
  sendForgetPasswordOTP,
  verifyOTP,
} from "../controller/user/user.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  addAdmin,
  allWorkspaces,
  createWorkSpace,
  deleteWorkSpace,
  getCalendarData,
  getWorkspace,
  getWorkspaceTableData,
  removeAdmin,
} from "../controller/workspace/workspace.controller";
import {
  allBoards,
  createBoard,
  deleteBoard,
  demoteAdmin,
  makeBoardAdmin,
  addMember,
  removeMember,
  editBoard,
  getSingleBoard,
  toggleFavourite,
} from "../controller/board/board";
import {
  createList,
  deleteList,
  getAllLists,
  copyList,
  moveList,
} from "../controller/list/list";
import {
  addDate,
  addDescription,
  addEndDate,
  addStartDate,
  copyCard,
  createCard,
  deleteCard,
  editCardDetails,
  getCardActivities,
  getCardsByList,
  getCardsByUser,
  getSingleCard,
  joinCard,
  leaveCard,
  moveCard,
} from "../controller/card/card";
import { addLabel, deleteLabel } from "../controller/card/label";
import { addComment, deleteComment } from "../controller/card/comment";
import { addAttachment, deleteAttachment } from "../controller/card/attachment";
import {
  addChecklist,
  addItemToCheckList,
  deleteCheckList,
  editItem,
  toggleCheckListItem,
} from "../controller/card/checklist";

const userRouter = Router();
const workSpaceRouter = Router();
const boardRouter = Router();
const listRouter = Router();
const cardRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "profilePicture", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(verifyJWT, logOutUser);
userRouter.route("/change-details").patch(verifyJWT, changeDetails);
userRouter
  .route("/change-profile-picture")
  .patch(
    verifyJWT,
    upload.fields([{ name: "newPicture", maxCount: 1 }]),
    changeProfilePicture
  );
userRouter.route("/get-user-details").get(verifyJWT, GetUserDetail);
userRouter.route("/delete-user").delete(verifyJWT, deleteUser);
userRouter.route("/reset-password").patch(verifyJWT, resetPassword);
userRouter.route("/send-otp").post(sendForgetPasswordOTP);
userRouter.route("/forget-password").patch(forgetPasswordReset);
userRouter.route("/activity-log").get(verifyJWT, activityLogs);
userRouter.route("/verify-otp").post(verifyJWT, verifyOTP);
export { userRouter };

workSpaceRouter
  .route("/create-workspace")
  .post(verifyJWT, upload.single("workspace-cover"), createWorkSpace);
workSpaceRouter.route("/create-card").post(verifyJWT, createCard);
workSpaceRouter
  .route("/:workspaceId/get-table-data")
  .get(verifyJWT, getWorkspaceTableData);
workSpaceRouter
  .route("/:workspaceId/get-calendar-data")
  .get(verifyJWT, getCalendarData);
workSpaceRouter.route("/get-workspaces").get(verifyJWT, allWorkspaces);
workSpaceRouter.route("/get-workspace").get(verifyJWT, getWorkspace);
workSpaceRouter.route("/delete-workspace").delete(verifyJWT, deleteWorkSpace);
workSpaceRouter.route("/add-admin").patch(verifyJWT, addAdmin);
workSpaceRouter.route("/remove-admin").patch(verifyJWT, removeAdmin);

export { workSpaceRouter };
boardRouter
  .route("/create-board")
  .post(verifyJWT, upload.single("cover-image"), createBoard);
boardRouter.route("/:workspaceId/get-boards").get(verifyJWT, allBoards);
boardRouter.route("/single/:boardId").get(verifyJWT, getSingleBoard);
boardRouter.route("/:boardId/delete-board").delete(verifyJWT, deleteBoard);
boardRouter.route("/add-admin").patch(verifyJWT, makeBoardAdmin);
boardRouter.route("/remove-admin").patch(verifyJWT, demoteAdmin);
boardRouter.route("/add-member").patch(verifyJWT, addMember);
boardRouter.route("/remove-member").patch(verifyJWT, removeMember);
boardRouter.route("/edit-board").patch(verifyJWT, editBoard);
boardRouter.route("/toggle-favourite").patch(verifyJWT, toggleFavourite);
export { boardRouter };
listRouter.route("/create-list").post(verifyJWT, createList);
listRouter.route("/copy-list").patch(verifyJWT, copyList);
listRouter.route("/move-list").patch(verifyJWT, moveList);
listRouter
  .route("/:workspaceId/:listId/delete-list")
  .delete(verifyJWT, deleteList);
listRouter.route("/:boardId/get-lists").get(verifyJWT, getAllLists);
export { listRouter };
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
cardRouter
  .route("/checklist/:checkListId/add-items")
  .post(verifyJWT, addItemToCheckList);
cardRouter
  .route("/checklist/toggle/:checklistId/:itemId")
  .post(verifyJWT, toggleCheckListItem);
cardRouter
  .route("/checklist/edit/:checklistId/:itemId")
  .patch(verifyJWT, editItem);
cardRouter.route("/edit/:listId/:cardId").patch(verifyJWT, editCardDetails);
cardRouter.route("/get-all-cards").get(verifyJWT, getCardsByUser);
cardRouter.route("/:listId/get-list-cards").get(verifyJWT, getCardsByList);
cardRouter
  .route("/:workspaceId/:cardId/delete-card")
  .delete(verifyJWT, deleteCard);
cardRouter.route("/delete-label").delete(verifyJWT, deleteLabel);
cardRouter.route("/:commentId/delete-comment").delete(verifyJWT, deleteComment);
cardRouter.route("/delete-attachment").delete(verifyJWT, deleteAttachment);
cardRouter
  .route("/:commentId/delete-checklist")
  .delete(verifyJWT, deleteCheckList);
cardRouter.route("/delete-checklist").delete(verifyJWT, deleteCheckList);
cardRouter.route("/move-card").patch(verifyJWT, moveCard);
cardRouter.route("/copy-card").patch(verifyJWT, copyCard);
cardRouter.route("/single-card/:cardId").get(verifyJWT, getSingleCard);
cardRouter.route("/card-activities/:cardId").get(verifyJWT, getCardActivities);
cardRouter.route("/add-description").post(verifyJWT, addDescription);
cardRouter.route("/add-start-date").post(verifyJWT, addEndDate);
cardRouter.route("/add-end-date").post(verifyJWT, addStartDate);
cardRouter.route("/add-date").patch(verifyJWT, addDate);
export { cardRouter };
