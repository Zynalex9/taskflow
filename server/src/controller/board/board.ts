import mongoose, { Mongoose, Types } from "mongoose";
import { boardModel } from "../../models/board.models";
import { workSpaceModel } from "../../models/workspace.model";
import { Request, Response } from "express";
import { ListModel } from "../../models/list.models";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CardModel } from "../../models/card.model";
import { UserModel } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { checkRequiredBody, notFound } from "../../utils/helpers";
import ApiResponse from "../../utils/ApiResponse";
import { UploadOnCloudinary } from "../../utils/cloudinary";
export interface IBoardMember {
  user: string | Types.ObjectId;
  role: "member" | "admin";
}
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, visibility, backgroundOptions, workspaceId, memberId } =
      req.body;
    const userId = req.user._id;
    if (!Array.isArray(memberId)) {
      res.status(400).json({ message: "memberId must be an array" });
      return;
    }
    if (!title) {
      res
        .status(409)
        .json({ message: "Please enter a title for board", success: false });
      return;
    }
    const alreadyExisting = await boardModel.findOne({
      title,
      createdBy: userId,
      workspace: workspaceId,
    });
    if (alreadyExisting) {
      res.status(409).json({
        message: "You already have a board with this name",
      });
      return;
    }
    let visibilityStatus = visibility ? visibility : "workspace";
    let backgroundStatus = backgroundOptions ? backgroundOptions : "#000000";

    const workspace = await workSpaceModel.findById(workspaceId);
    if (!workspace) {
      res.status(404).json({
        message: "Workspace not found",
        success: false,
      });
      return;
    }
    if (!workspace.admin.includes(userId)) {
      res.status(403).json({
        message: "You are not authorized to create a board in this workspace",
        success: false,
      });
      return;
    }

    const users = await UserModel.find({ _id: { $in: memberId } });
    const boardMembers: IBoardMember[] = users.map((user) => ({
      user: user._id,
      role: "member",
    }));

    const newBoard = await boardModel.create({
      title,
      visibility: visibilityStatus,
      backgroundOptions: backgroundStatus,
      createdBy: userId,
      members: boardMembers,
      workspace: workspaceId,
    });
    await workSpaceModel.findByIdAndUpdate(
      workspaceId,
      { $push: { boards: newBoard._id } },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "New board created", sucess: true, newBoard });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error in creating board",
      success: false,
    });
  }
};
export const allBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user;
    const { workspaceId } = req.params;

    if (!workspaceId) {
      res.status(400).json({ message: "workspace ID is required" });
      return;
    }
    const allBoards = await boardModel
      .find({ createdBy: userId, workspace: workspaceId })
      .lean();
    if (allBoards.length === 0) {
      res.status(404).json({ message: "boards not found" });
      return;
    }

    res.status(201).json({ message: "board(s) Found", allBoards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteBoard = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { boardId } = req.params;
    const user = req.user._id;

    if (!boardId) {
      res.status(407).json({ message: "Board Id is required" });
      return;
    }

    const board = await boardModel.findById(boardId).session(session);
    if (!board) {
      res.status(404).json({ message: "No Board found" });
      return;
    }

    const workspace = await workSpaceModel
      .findById(board.workspace)
      .session(session);
    if (!workspace?.admin.includes(user)) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete the board" });
      return;
    }

    const lists = await ListModel.find({ board }).session(session);
    if (lists.length === 0) {
      await boardModel.findByIdAndDelete(boardId).session(session);
      await session.commitTransaction();
      res.status(200).json({ message: "Board Deleted.." });
      return;
    }

    const listIds = lists.map((l) => l._id);
    const cards = await CardModel.find({ list: { $in: listIds } }).session(
      session
    );

    if (cards.length === 0) {
      await ListModel.deleteMany({ _id: { $in: listIds } }).session(session);
      await boardModel.findByIdAndDelete(boardId).session(session);
      await session.commitTransaction();
      res.status(200).json({ message: "Board and list(s) deleted" });
      return;
    }

    const cardIds = cards.map((c) => c._id);
    const allCommentsIds = cards.flatMap((c) => c.comments);
    const allLabelsIds = cards.flatMap((c) => c.labels);
    const allChecklistIDs = cards.flatMap((c) => c.checklist);
    const allAttachmentsId = cards.flatMap((c) => c.attachments);

    if (allCommentsIds.length > 0) {
      await commentsModel
        .deleteMany({ _id: { $in: allCommentsIds } })
        .session(session);
    }
    if (allLabelsIds.length > 0) {
      await CardLabelModel.deleteMany({ _id: { $in: allLabelsIds } }).session(
        session
      );
    }
    if (allChecklistIDs.length > 0) {
      await CheckListModel.deleteMany({
        _id: { $in: allChecklistIDs },
      }).session(session);
    }
    if (allAttachmentsId.length > 0) {
      await CardAttachmentModel.deleteMany({
        _id: { $in: allAttachmentsId },
      }).session(session);
    }

    await CardModel.deleteMany({ _id: { $in: cardIds } }).session(session);
    await ListModel.deleteMany({ _id: { $in: listIds } }).session(session);
    await boardModel.deleteOne({ _id: boardId }).session(session);

    await session.commitTransaction();
    res.status(200).json({ message: "Board deleted with all related data" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete Board Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  } finally {
    session.endSession();
  }
};
export const makeBoardAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const required = ["boardId", "targetedId"];
    if (!checkRequiredBody(req, res, required)) return;
    const { boardId, targetedId } = req.body;
    const currentUserId = req.user._id;
    const board = await boardModel.findById(boardId);
    if (!board) {
      notFound(board, "Board", res);
      return;
    }
    const currentUser = board.members.find(
      (member) => member.user.toString() === currentUserId.toString()
    );
    if (
      board.createdBy.toString() !== currentUserId.toString() ||
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      res
        .status(403)
        .json(
          new ApiResponse(
            400,
            {},
            "You are not authorized to make changes in this board"
          )
        );
      return;
    }
    const targetUser = board.members.find(
      (member) => member.user._id.toString() === targetedId.toString()
    );
    if (!targetUser) {
      res
        .status(404)
        .json(new ApiResponse(4040, {}, "User is not a member of this board"));
      return;
    }
    targetUser.role = "admin";
    await board.save();
    res.status(200).json(new ApiResponse(200, {}, "User is promoted to admin"));
  }
);
export const demoteAdmin = asyncHandler(async (req, res) => {
  const required = ["boardId", "targetedId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { boardId, targetedId } = req.body;
  const currentUserId = req.user._id;
  const board = await boardModel.findById(boardId);
  if (!board) {
    notFound(board, "Board", res);
    return;
  }
  const currentUser = board.members.find(
    (member) => member.user._id === currentUserId
  );
  if (
    board.createdBy.toString() !== currentUserId.toString() ||
    !currentUser ||
    currentUser.role !== "admin"
  ) {
    res
      .status(403)
      .json(
        new ApiResponse(
          400,
          {},
          "You are not authorized to make changes in this board"
        )
      );
    return;
  }
  const targetedUser = board.members.find(
    (member) => member.user._id === targetedId
  );
  if (!targetedUser) {
    res
      .status(403)
      .json(new ApiResponse(4040, {}, "User is not a member of this board"));
    return;
  }
  targetedUser.role = "member";
  await board.save();
  res.status(200).json(new ApiResponse(200, {}, "User is demoted to member"));
});

export const addMember = asyncHandler(async (req, res) => {
  const required = ["boardId", "targetedId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { boardId, targetedId } = req.body;
  const board = await boardModel.findById(boardId);
  if (!board) {
    notFound(board, "Board", res);
    return;
  }

  const alreadyMember = board.members.find(
    (member) => member.user._id.toString() === targetedId.toString()
  );
  if (alreadyMember) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "User is already a member of board"));
    return;
  }
  board.members.push({
    user: targetedId,
    role: "member",
  });
  await board.save();
  res.status(200).json(new ApiResponse(200, board, "User added to board"));
});

export const removeMember = asyncHandler(async (req, res) => {
  const required = ["boardId", "targetedId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { boardId, targetedId } = req.body;
  const board = await boardModel.findById(boardId);
  if (!board) {
    notFound(board, "Board", res);
    return;
  }

  const alreadyMember = board.members.find(
    (member) => member.user._id.toString() === targetedId.toString()
  );
  if (!alreadyMember) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "User is not a member of board"));
    return;
  }
  board.members = board.members.filter(
    (member) => member.user.toString() !== targetedId.toString()
  );

  await board.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "User removed from the board successfully"));
});
export const editBoard = asyncHandler(async (req, res) => {
  const required = ["title", "background", "board"];
  if (!checkRequiredBody(req, res, required)) return;
  const { title, boardId, backgroundColor } = req.body;
  const board = await boardModel.findById(boardId);
  if (!board) {
    notFound(board, "Board", res);
    return;
  }
  if (title) {
    board.title = title;
  }
  let backgroundValue = board.background;
  if (req.file) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const localPath = files.backgroundImage[0].path;

    if (!localPath) {
      res
        .status(400)
        .json(new ApiResponse(400, {}, "Background picture missing"));
      return;
    }
    const uploadedBg = await UploadOnCloudinary({ localFilePath: localPath });

    if (!uploadedBg) {
      res
        .status(400)
        .json(new ApiResponse(400, {}, "Background picture missing"));
      return;
    }
    backgroundValue = uploadedBg.url;
  }
  if (backgroundColor) {
    backgroundValue = backgroundColor;
  }

  await board.save();
  res.status(200).json(new ApiResponse(200, board, "Board edited"));
});
