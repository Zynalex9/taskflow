import { Router } from "express";
import {
  activityLogs,
  changeDetails,
  changeProfilePicture,
  deleteUser,
  findByIdentifier,
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
  addWorkspaceMember,
  allWorkspaces,
  createWorkSpace,
  deleteWorkSpace,
  getCalendarData,
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaceTableData,
  leaveWorkspace,
  removeAdmin,
  removeWorkspaceMember,
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
  updateVisibility,
  updateBoardCover,
  addBoardDescription,
  copyBoard,
  pdfBoardData,
} from "../controller/board/board";
import {
  createList,
  deleteList,
  getAllLists,
  copyList,
  moveList,
  copyIntoNewList,
} from "../controller/list/list";
import {
  addCover,
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
  toggleComplete,
} from "../controller/card/card";
import { addLabel, deleteLabel } from "../controller/card/label";
import {
  addComment,
  deleteComment,
  editComment,
} from "../controller/card/comment";
import { addAttachment, deleteAttachment } from "../controller/card/attachment";
import {
  addChecklist,
  addItemToCheckList,
  deleteCheckList,
  deleteItem,
  editItem,
  toggleCheckListItem,
} from "../controller/card/checklist";
import { requirePermission } from "../middleware/permission.middleware";
import { PERMISSIONS } from "../RBAC/Permissions";
import { ERROR_MESSAGES } from "../RBAC/ErrorMessage";

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
userRouter.route("/verify-otp").post(verifyOTP);
userRouter.route("/:identifier/find-by-identifier").get(findByIdentifier);
export { userRouter };

workSpaceRouter
  .route("/create-workspace")
  .post(verifyJWT, upload.single("workspace-cover"), createWorkSpace);

workSpaceRouter
  .route("/create-card")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.LIST_CREATE_CARD,
      "board",
      "boardId",
      ERROR_MESSAGES.LIST_CREATE_CARD
    ),
    createCard
  );

workSpaceRouter
  .route("/:workspaceId/get-table-data")
  .get(verifyJWT, getWorkspaceTableData);

workSpaceRouter.route("/:workspaceId/get-calendar-data").get(
  verifyJWT,

  getCalendarData
);

workSpaceRouter.route("/get-workspaces").get(verifyJWT, allWorkspaces);

workSpaceRouter.route("/get-workspace").get(verifyJWT, getWorkspace);

workSpaceRouter
  .route("/delete-workspace")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.WORKSPACE_DELETE,
      "workspace",
      "workspaceId",
      ERROR_MESSAGES.WORKSPACE_DELETE
    ),
    deleteWorkSpace
  );

workSpaceRouter
  .route("/add-admin")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.WORKSPACE_MANAGE_ADMINS,
      "workspace",
      "workspaceId",
      ERROR_MESSAGES.WORKSPACE_MANAGE_ADMINS_ADD
    ),
    addAdmin
  );

workSpaceRouter
  .route("/remove-admin")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.WORKSPACE_MANAGE_ADMINS,
      "workspace",
      "workspaceId",
      ERROR_MESSAGES.WORKSPACE_MANAGE_ADMINS_REMOVE
    ),
    removeAdmin
  );

workSpaceRouter
  .route("/add-member")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.WORKSPACE_MANAGE_MEMBERS,
      "workspace",
      "workspaceId",
      ERROR_MESSAGES.WORKSPACE_MANAGE_MEMBERS_ADD
    ),
    addWorkspaceMember
  );

workSpaceRouter
  .route("/remove-member")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.WORKSPACE_MANAGE_MEMBERS,
      "workspace",
      "workspaceId",
      ERROR_MESSAGES.WORKSPACE_MANAGE_MEMBERS_REMOVE
    ),
    removeWorkspaceMember
  );

workSpaceRouter
  .route("/get-members/:workspaceId")
  .get(verifyJWT, getWorkspaceMembers);
workSpaceRouter
  .route("/leave-workspace/:workspaceId")
  .post(verifyJWT, leaveWorkspace);
export { workSpaceRouter };
boardRouter
  .route("/create-board")
  .post(
    verifyJWT,
    upload.single("cover-image"),
    requirePermission(
      PERMISSIONS.WORKSPACE_CREATE_BOARD,
      "workspace",
      "workspaceId",
      ERROR_MESSAGES.BOARD_CREATE
    ),
    createBoard
  );

boardRouter.route("/:workspaceId/get-boards").get(verifyJWT, allBoards);

boardRouter
  .route("/single/:boardId")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_VIEW,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_VIEW
    ),
    getSingleBoard
  );

boardRouter
  .route("/:boardId/delete-board")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_DELETE,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_DELETE
    ),
    deleteBoard
  );

boardRouter
  .route("/add-admin")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_MANAGE_ADMINS_ADD,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_MANAGE_ADMINS_ADD
    ),
    makeBoardAdmin
  );

boardRouter
  .route("/remove-admin")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_MANAGE_ADMINS_REMOVE,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_MANAGE_ADMINS_REMOVE
    ),
    demoteAdmin
  );

boardRouter
  .route("/add-member")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_MANAGE_MEMBERS,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_MANAGE_MEMBERS_ADD
    ),
    addMember
  );

boardRouter
  .route("/remove-member")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_MANAGE_MEMBERS,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_MANAGE_MEMBERS_REMOVE
    ),
    removeMember
  );

boardRouter
  .route("/edit-board")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_EDIT,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_EDIT
    ),
    editBoard
  );

boardRouter
  .route("/toggle-favourite")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_FAVOURITE,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_FAVOURITE
    ),
    toggleFavourite
  );

boardRouter
  .route("/add-description")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_DESCRIPTION,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_DESCRIPTION
    ),
    addBoardDescription
  );

boardRouter
  .route("/copy-board")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_COPY,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_COPY
    ),
    copyBoard
  );

boardRouter
  .route("/full-details/:boardId")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_DETAILS,
      "board",
      "boardId",
      ERROR_MESSAGES.BOARD_DETAILS
    ),
    pdfBoardData
  );

boardRouter
  .route("/update-cover/:boardId")
  .patch(verifyJWT, upload.single("image"), updateBoardCover);
boardRouter
  .route("/update-visibility/:boardId")
  .patch(verifyJWT, updateVisibility);
export { boardRouter };

listRouter
  .route("/create-list")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.BOARD_CREATE_LIST,
      "board",
      "boardId",
      ERROR_MESSAGES.LIST_CREATE
    ),
    createList
  );

listRouter
  .route("/copy-list")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.LIST_COPY,
      "list",
      "listId",
      ERROR_MESSAGES.LIST_COPY
    ),
    copyList
  );

listRouter
  .route("/move-list")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.LIST_MOVE,
      "list",
      "listId",
      ERROR_MESSAGES.LIST_MOVE
    ),
    moveList
  );

listRouter
  .route("/:workspaceId/:listId/delete-list")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.LIST_DELETE,
      "list",
      "listId",
      ERROR_MESSAGES.LIST_DELETE
    ),
    deleteList
  );

listRouter
  .route("/:boardId/get-lists")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.LIST_VIEW,
      "board",
      "boardId",
      ERROR_MESSAGES.LIST_VIEW
    ),
    getAllLists
  );

listRouter
  .route("/copy-list-new")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.LIST_COPY,
      "list",
      "listId",
      ERROR_MESSAGES.LIST_COPY
    ),
    copyIntoNewList
  );

export { listRouter };
cardRouter
  .route("/join-card")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_JOIN,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_JOIN
    ),
    joinCard
  );

cardRouter
  .route("/leave-card")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_VIEW,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_VIEW
    ),
    leaveCard
  );

cardRouter
  .route("/add-label")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_LABEL,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_LABEL
    ),
    addLabel
  );

cardRouter
  .route("/add-comment")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_COMMENT,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_COMMENT
    ),
    addComment
  );

cardRouter
  .route("/add-attachment")
  .post(
    verifyJWT,
    upload.fields([{ name: "uploadedFile", maxCount: 1 }]),
    requirePermission(
      PERMISSIONS.CARD_ATTACHMENT,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_ATTACHMENT
    ),
    addAttachment
  );

cardRouter
  .route("/add-checklist")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    addChecklist
  );

cardRouter
  .route("/checklist/:checkListId/add-items")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    addItemToCheckList
  );

cardRouter
  .route("/checklist/toggle/:checklistId/:itemId")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    toggleCheckListItem
  );

cardRouter
  .route("/checklist/edit/:checklistId/:itemId")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    editItem
  );

cardRouter
  .route("/edit/:listId/:cardId")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_EDIT,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_EDIT
    ),
    editCardDetails
  );

cardRouter
  .route("/get-all-cards")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_VIEW,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_VIEW
    ),
    getCardsByUser
  );

cardRouter
  .route("/:listId/get-list-cards")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_VIEW,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_VIEW
    ),
    getCardsByList
  );

cardRouter
  .route("/:workspaceId/:cardId/delete-card")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_DELETE,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_DELETE
    ),
    deleteCard
  );

cardRouter
  .route("/delete-label")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_LABEL,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_LABEL
    ),
    deleteLabel
  );

cardRouter.route("/:commentId/delete-comment").delete(verifyJWT, deleteComment);

cardRouter
  .route("/delete-attachment")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_ATTACHMENT,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_ATTACHMENT
    ),
    deleteAttachment
  );

cardRouter
  .route("/:commentId/delete-checklist")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    deleteCheckList
  );

cardRouter
  .route("/delete-checklist")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    deleteCheckList
  );

cardRouter
  .route("/move-card")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_MOVE,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_MOVE
    ),
    moveCard
  );

cardRouter
  .route("/copy-card")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_COPY,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_COPY
    ),
    copyCard
  );

cardRouter
  .route("/single-card/:cardId")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_VIEW,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_VIEW
    ),
    getSingleCard
  );

cardRouter
  .route("/card-activities/:cardId")
  .get(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_VIEW,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_VIEW
    ),
    getCardActivities
  );

cardRouter
  .route("/add-description")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_EDIT,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_EDIT
    ),
    addDescription
  );

cardRouter
  .route("/add-start-date")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_DATE,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_DATE
    ),
    addEndDate
  );

cardRouter
  .route("/add-end-date")
  .post(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_DATE,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_DATE
    ),
    addStartDate
  );

cardRouter
  .route("/add-date")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_DATE,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_DATE
    ),
    addDate
  );

cardRouter
  .route("/toggle-complete")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_TOGGLE,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_TOGGLE
    ),
    toggleComplete
  );

cardRouter
  .route("/delete-checklist-item")
  .delete(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_CHECKLIST,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_CHECKLIST
    ),
    deleteItem
  );

cardRouter
  .route("/edit-comment")
  .patch(
    verifyJWT,
    requirePermission(
      PERMISSIONS.CARD_COMMENT,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_COMMENT
    ),
    editComment
  );

cardRouter
  .route("/add-cover")
  .post(
    verifyJWT,
    upload.single("cardCover"),
    requirePermission(
      PERMISSIONS.CARD_COVER,
      "card",
      "cardId",
      ERROR_MESSAGES.CARD_ATTACHMENT
    ),
    addCover
  );

export { cardRouter };
