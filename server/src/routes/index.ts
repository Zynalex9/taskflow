import { Router } from "express";
import {
  changeDetails,
  changeProfilePicture,
  deleteUser,
  GetUserDetail,
  loginUser,
  logOutUser,
  registerUser,
} from "../controller/user.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  allBoards,
  allWorkspaces,
  createBoard,
  createCard,
  createList,
  createWorkSpace,
  deleteBoard,
  deleteWorkSpace,
  getAllLists,
  getCalendarData,
  getWorkspaceTableData,
} from "../controller/workspace.controller";
import {
  addAttachment,
  addChecklist,
  addComment,
  addItemToCheckList,
  addLabel,
  editCardDetails,
  editItem,
  getCardsByList,
  getCardsByUser,
  joinCard,
  leaveCard,
  toggleCheckListItem,
} from "../controller/card.controller";

const userRouter = Router();
const workSpaceRouter = Router();
const cardRouter = Router();

userRouter
  .route("/register")
  .post(upload.fields([{ name: "profilePicture", maxCount: 1 }]), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logOutUser);
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
export { userRouter };

workSpaceRouter.route("/create-workspace").post(verifyJWT, createWorkSpace);
workSpaceRouter.route("/create-board").post(verifyJWT, createBoard);
workSpaceRouter.route("/create-list").post(verifyJWT, createList);
workSpaceRouter.route("/create-card").post(verifyJWT, createCard);
workSpaceRouter
  .route("/:workspaceId/get-table-data")
  .get(verifyJWT, getWorkspaceTableData);
workSpaceRouter
  .route("/:workspaceId/get-calendar-data")
  .get(verifyJWT, getCalendarData);
workSpaceRouter.route("/:boardId/get-lists").get(verifyJWT, getAllLists);
workSpaceRouter.route("/get-workspaces").get(verifyJWT, allWorkspaces);
workSpaceRouter.route("/:workspaceId/get-boards").get(verifyJWT, allBoards);
workSpaceRouter.route("/delete-workspace").delete(verifyJWT, deleteWorkSpace);
workSpaceRouter.route("/:boardId/delete-board").delete(verifyJWT, deleteBoard);
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
export { cardRouter };
