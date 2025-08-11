import mongoose, { Mongoose, Types } from "mongoose";
import { boardModel } from "../../models/board.models";
import { workSpaceModel } from "../../models/workspace.model";
import { Request, Response } from "express";
import { IList, ListModel } from "../../models/list.models";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CardModel, ICard } from "../../models/card.model";
import { UserModel } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  checkRequiredBody,
  getRandomColor,
  lPushList,
  notFound,
} from "../../utils/helpers";
import ApiResponse from "../../utils/ApiResponse";
import { UploadOnCloudinary } from "../../utils/cloudinary";
import { redisClient } from "../..";
import { getIO } from "../../socket";
export interface IBoardMember {
  user: string | Types.ObjectId;
  role: "member" | "admin";
}
export const createBoard = async (req: Request, res: Response) => {
  try {
    const {
      title,
      visibility,
      cover,
      backgroundOptions,
      workspaceId,
      memberId,
    } = req.body;
    const userId = req.user._id;

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

    const allMemberIdsSet = new Set([
      ...memberId.map((id: any) => id.toString()),
      workspace.createdBy.toString(),
      ...workspace.admin.map((adminId) => adminId.toString()),
    ]);
    console.log(allMemberIdsSet);
    const allMemberIds = [...allMemberIdsSet];
    console.log(allMemberIds);
    const users = await UserModel.find({ _id: { $in: allMemberIds } });
    const boardMembers: IBoardMember[] = users.map((user) => {
      const isAdmin =
        workspace.admin
          .map((id) => id.toString())
          .includes(user._id.toString()) ||
        workspace.createdBy.toString() === user._id.toString();
      return {
        user: user._id,
        role: isAdmin ? "admin" : "member",
      };
    });
    let boardCover;
    if (cover) {
      boardCover = cover;
    } else if (req.file) {
      const localPath = req.file.path;
      const response = await UploadOnCloudinary({
        localFilePath: localPath,
        folderName: "taskflow/boardCovers",
      });
      if (response && response.url) {
        boardCover = response.url;
      }
    } else {
      boardCover =
        "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/c176ec219cc71b83695da82802ab31a7/photo-1742156345582-b857d994c84e.webp";
    }
    const newBoard = await boardModel.create({
      title,
      visibility: visibilityStatus,
      backgroundOptions: backgroundStatus,
      createdBy: userId,
      members: boardMembers,
      workspace: workspaceId,
      cover: boardCover,
    });
    await workSpaceModel.findByIdAndUpdate(
      workspaceId,
      { $push: { boards: newBoard._id } },
      { new: true }
    );
    await lPushList(userId, `Board created : ${title}`);
    await redisClient.del(`boards:${userId}`);
    const io = getIO();
    io.to(workspaceId).emit("boardCreated", newBoard);
    res
      .status(201)
      .json({ message: "New board created", sucess: true, newBoard });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error in creating board",
      success: false,
    });
  }
};
export const allBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { workspaceId } = req.params;

    if (!workspaceId) {
      res.status(400).json({ message: "workspace ID is required" });
      return;
    }

    // const cachedKey = `boards:${userId}`;
    // const cachedBoard = await redisClient.get(cachedKey);
    // if (cachedBoard) {
    //   res
    //     .status(200)
    //     .json(new ApiResponse(200, JSON.parse(cachedBoard), "Boards from cache"));
    //   return;
    // }
    const boards = await boardModel.find({ workspace: workspaceId }).lean();

    if (!boards || boards.length === 0) {
      res.status(404).json({ message: "No boards found in this workspace" });
      return;
    }

    const yourBoards = boards.filter(
      (board) => board.createdBy.toString() === userId.toString()
    );
    const otherBoards = boards.filter(
      (board) => board.createdBy.toString() !== userId.toString()
    );
    const response = { yourBoards, otherBoards };
    // await redisClient.set(cachedKey, JSON.stringify(response), "EX", 3600);
    res.status(200).json(new ApiResponse(200, response, "Boards found"));
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getSingleBoard = asyncHandler(
  async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const cachedkey = `singleBoard:${boardId}`;
    const cachedBoard = await redisClient.get(cachedkey);
    // if (cachedBoard) {
    //   res
    //     .status(200)
    //     .json(
    //       new ApiResponse(200, JSON.parse(cachedBoard), "Board from cache")
    //     );
    //   return;
    // }
    const board = await boardModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(boardId) },
      },
      {
        $lookup: {
          from: "lists",
          localField: "lists",
          foreignField: "_id",
          as: "lists",
          pipeline: [
            {
              $lookup: {
                from: "todos",
                localField: "cards",
                foreignField: "_id",
                as: "cards",
                pipeline: [
                  {
                    $lookup: {
                      from: "labels",
                      localField: "labels",
                      foreignField: "_id",
                      as: "labels",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user",
          foreignField: "_id",
          as: "membersData",
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                $mergeObjects: [
                  "$$member",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$membersData",
                          as: "userDoc",
                          cond: {
                            $eq: ["$$userDoc._id", "$$member.user"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!board) {
      notFound(board, "Board", res);
      return;
    }
    const response = board[0];
    await redisClient.set(cachedkey, JSON.stringify(response), "EX", 1300);
    res.status(200).json(new ApiResponse(200, response, "Board found"));
  }
);
export const deleteBoard = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { boardId } = req.params;
    const user = req.user._id;
    const io = getIO();

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

    if (!workspace) {
      res.status(404).json({ message: "No workspace found" });
      return;
    }
    const lists = await ListModel.find({ board }).session(session);
    if (lists.length === 0) {
      await boardModel.findByIdAndDelete(boardId).session(session);
      await session.commitTransaction();
      workspace.boards = workspace.boards.filter(
        (b) => b.toString() !== boardId.toString()
      );
      await workspace.save();
      io.to(workspace._id.toString()).emit("boardDeleted", boardId);
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
      workspace.boards = workspace.boards.filter(
        (b) => b.toString() !== boardId.toString()
      );
      await workspace.save();
      io.to(workspace._id.toString()).emit("boardDeleted", boardId);
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
    workspace.boards = workspace.boards.filter(
      (b) => b.toString() !== boardId.toString()
    );
    await workspace.save();
    await session.commitTransaction();
    await lPushList(req.user._id, `Board Deleted : ${board.title}`);
    await redisClient.del(`boards:${req.user._id}`);
    io.to(workspace._id.toString()).emit("boardDeleted", boardId);
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
    await lPushList(req.user._id, `You made added board admin`);

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
  await redisClient.del(`boards:${req.user._id}`);

  await lPushList(req.user._id, `You removed added board admin`);
  res.status(200).json(new ApiResponse(200, {}, "User is demoted to member"));
});

export const addMember = asyncHandler(async (req, res) => {
  const required = ["boardId", "targetedId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { boardId, targetedId, workspaceId } = req.body;
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
  await lPushList(
    req.user._id,
    `You made added member to ${board.title} board`
  );
  const io = getIO();
  io.to(workspaceId).emit("boardUpdated", board);
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
  await lPushList(
    req.user._id,
    `You made removed member from ${board.title} board`
  );
  const io = getIO();
  io.to(board.workspace.toString()).emit("boardUpdated", board);
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
  await lPushList(req.user._id, `You edited ${board.title} board`);
  const io = getIO();
  io.to(board.workspace.toString()).emit("boardUpdated", board);
  res.status(200).json(new ApiResponse(200, board, "Board edited"));
});
export const toggleFavourite = asyncHandler(async (req, res) => {
  const { boardId } = req.body;
  if (!boardId) {
    res.status(401).json(new ApiResponse(401, {}, "No Board Id provided"));
  }
  const board = await boardModel.findById(boardId);
  if (!board) return;
  board.favourite = !board.favourite;
  await board.save();
  const io = getIO();
  io.to(board.workspace.toString()).emit("boardUpdated", board);
  res.status(200).json(new ApiResponse(200, {}, "Updated"));
});
export const updateVisibility = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params, req.body);
    const { boardId } = req.params;
    const { visibility } = req.body;
    if (!boardId || !visibility) {
      res.status(400).json({
        message: "Board ID and visibility are required",
        success: false,
      });
      return;
    }
    const board = await boardModel.findById(boardId);
    if (!board) {
      notFound(board, "Board", res);
      return;
    }
    const userId = req.user._id;
    const workspace = await workSpaceModel.findById(board.workspace);
    if (
      !workspace?.admin.includes(userId) &&
      workspace?.createdBy.toString() !== userId.toString()
    ) {
      res.status(403).json({
        message:
          "You are not authorized to change the visibility of this board",
        success: false,
      });
      return;
    }
    board.visibility = visibility;
    await board.save();
    await redisClient.del(`singleBoard:${boardId}`);
    const io = getIO();
    io.to(board.workspace.toString()).emit("boardUpdated", board);
    res.status(200).json(new ApiResponse(200, {}, "Visibility updated"));
  }
);

export const updateBoardCover = asyncHandler(
  async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const { cover } = req.body;
    console.log(req.body, req.file);
    if (!boardId || (!cover && !req.file)) {
      res
        .status(400)
        .json(new ApiResponse(400, {}, "Board ID and cover are required"));
      return;
    }
    const board = await boardModel.findById(boardId);
    if (!board) {
      notFound(board, "Board", res);
      return;
    }
    const userId = req.user._id;
    const workspace = await workSpaceModel.findById(board.workspace);
    if (
      !workspace?.admin.includes(userId) &&
      workspace?.createdBy.toString() !== userId.toString()
    ) {
      res.status(403).json({
        message: "You are not authorized to change the cover of this board",
        success: false,
      });
      return;
    }
    let coverUrl = cover;
    if (req.file) {
      const localPath = req.file.path;
      const response = await UploadOnCloudinary({
        localFilePath: localPath,
        folderName: "taskflow/boardCovers",
      });
      if (response && response.url) {
        coverUrl = response.url;
      } else {
        res
          .status(400)
          .json(new ApiResponse(400, {}, "Failed to upload cover"));
        return;
      }
    }
    board.cover = coverUrl;
    await board.save();
    await redisClient.del(`singleBoard:${boardId}`);
    const io = getIO();
    io.to(board.workspace.toString()).emit("boardUpdated", board);
    res.status(200).json(new ApiResponse(200, {}, "Board cover updated"));
  }
);
export const addBoardDescription = asyncHandler(async (req, res) => {
  const { description, boardId } = req.body;
  if (!description || !boardId) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "No Description/boardId provided"));
    return;
  }
  const board = await boardModel.findById(boardId);
  if (!board) {
    res.status(404).json(new ApiResponse(404, {}, "No board found"));
    return;
  }
  board.description = description;
  await board.save();
  const io = getIO();
  io.to(board.workspace.toString()).emit("boardUpdated", description);
  res.status(200).json(new ApiResponse(200, board, "Description updated"));
});
export const copyBoard = asyncHandler(async (req, res) => {
  const { workspaceId, boardId, title } = req.body;
  if (!workspaceId || !boardId) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "No workspaceId/boardId provided"));
    return;
  }
  const workspace = await workSpaceModel.findById(workspaceId);
  if (!workspace) {
    res.status(404).json(new ApiResponse(404, {}, "No workspace found"));
    return;
  }
  const io = getIO();
  io.to(workspaceId).emit("boardUpdated", workspaceId);
  if (workspace.boards.includes(boardId)) {
    res
      .status(401)
      .json(
        new ApiResponse(
          401,
          {},
          `Board:${title} is already present in workspace:${workspace.name}`
        )
      );
    return;
  }
  workspace.boards.push(boardId);
  await workspace.save();
  res
    .status(200)
    .json(new ApiResponse(200, {}, `${title} copied to ${workspace.name} `));
});
export const pdfBoardData = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  if (!boardId) {
    res.status(400).json(new ApiResponse(400, {}, "Board ID is required"));
    return;
  }

  const cachedKey = `PdfData:${boardId}`;
  const cachedData = await redisClient.get(cachedKey);

  if (cachedData) {
    res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(cachedData), "Cache hit"));
    return;
  }

  const board = await boardModel.findById(boardId).populate({
    path: "lists",
    populate: {
      path: "cards",
      model: "Todo",
      populate: [
        {
          path: "comments",
          populate: {
            path: "author",
            model: "User",
          },
        },
        { path: "attachments", model: "CardAttachment" },
        { path: "checklist", model: "Checklist" },
        { path: "labels", model: "Label" },
        { path: "members", model: "User" },
      ],
    },
  });

  if (!board) {
    res.status(404).json(new ApiResponse(404, {}, "Board not found"));
    return;
  }

  await redisClient.set(cachedKey, JSON.stringify(board), "EX", 3600);

  res.status(200).json(new ApiResponse(200, board, "Board data fetched"));
});
export const copyBoardIntoNew = asyncHandler(async (req, res) => {
  const { workspaceId, boardId } = req.body;

  if (!workspaceId || !boardId) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "No workspaceId/boardId provided"));
    return;
  }

  // Check target workspace existence
  const targetWorkspace = await workSpaceModel.findById(workspaceId);
  if (!targetWorkspace) {
    res.status(404).json(new ApiResponse(404, {}, "No workspace found"));
    return;
  }

  // Fetch original board with nested lists, cards, and related entities
  const [originalBoard] = await boardModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(boardId) } },
    {
      $lookup: {
        from: "lists",
        localField: "lists",
        foreignField: "_id",
        as: "lists",
        pipeline: [
          {
            $lookup: {
              from: "todos", // cards collection
              localField: "cards",
              foreignField: "_id",
              as: "cards",
              pipeline: [
                {
                  $lookup: {
                    from: "labels",
                    localField: "labels",
                    foreignField: "_id",
                    as: "labels",
                  },
                },
                {
                  $lookup: {
                    from: "checklists",
                    localField: "checklist",
                    foreignField: "_id",
                    as: "checklist",
                  },
                },
                {
                  $lookup: {
                    from: "comments",
                    localField: "comments",
                    foreignField: "_id",
                    as: "comments",
                  },
                },
                {
                  $lookup: {
                    from: "attachments",
                    localField: "attachments",
                    foreignField: "_id",
                    as: "attachments",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  if (!originalBoard) {
    res.status(404).json(new ApiResponse(404, {}, "Board not found"));
    return;
  }

  // Create new board
  const newBoard = await boardModel.create({
    title: `${originalBoard.title} (Copy)`,
    visibility: originalBoard.visibility,
    createdBy: originalBoard.createdBy,
    members: originalBoard.members || originalBoard.boardMembers || [],
    workspace: workspaceId,
    cover: originalBoard.cover,
    favourite: originalBoard.favourite,
    description: originalBoard.description,
  });

  const newListIds: mongoose.Types.ObjectId[] = [];

  await Promise.all(
    originalBoard.lists.map(async (list: any) => {
      // Create new list without cards first
      const newList = await ListModel.create({
        name: `${list.name} (Copy)`,
        color: list.color,
        createdBy: list.createdBy,
        board: newBoard._id,
        cards: [],
        isArchived: list.isArchived,
      });

      const newCardIds: mongoose.Types.ObjectId[] = [];

      await Promise.all(
        list.cards.map(async (card: any) => {
          const [newComments, newLabels, newChecklists, newAttachments] =
            await Promise.all([
              Promise.all(
                card.comments.map((c: any) =>
                  commentsModel.create({
                    comment: c.comment,
                    author: c.author,
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt,
                  })
                )
              ),
              Promise.all(
                card.labels.map((l: any) =>
                  CardLabelModel.create({
                    name: l.name,
                    color: l.color,
                  })
                )
              ),
              Promise.all(
                card.checklist.map((ch: any) =>
                  CheckListModel.create({
                    title: ch.title,
                    items: ch.items,
                    createdBy: ch.createdBy,
                  })
                )
              ),
              Promise.all(
                card.attachments.map((a: any) =>
                  CardAttachmentModel.create({
                    fileUrl: a.fileUrl,
                    filename: a.filename,
                    uploadedBy: a.uploadedBy,
                  })
                )
              ),
            ]);

          const newCard = await CardModel.create({
            name: card.name,
            description: card.description,
            createdBy: card.createdBy,
            comments: newComments.map((c) => c._id),
            labels: newLabels.map((l) => l._id),
            checklist: newChecklists.map((ch) => ch._id),
            attachments: newAttachments.map((a) => a._id),
            list: newList._id,
            checked: card.checked,
            cover: card.cover,
          });

          await Promise.all([
            ...newChecklists.map((cl) =>
              CheckListModel.findByIdAndUpdate(cl._id, { card: newCard._id })
            ),
            ...newAttachments.map((att) =>
              CardAttachmentModel.findByIdAndUpdate(att._id, {
                card: newCard._id,
              })
            ),
            ...newLabels.map((lbl) =>
              CardLabelModel.findByIdAndUpdate(lbl._id, { card: newCard._id })
            ),
          ]);

          newCardIds.push(newCard._id);
        })
      );

      await ListModel.findByIdAndUpdate(newList._id, { cards: newCardIds });

      newListIds.push(newList._id);
    })
  );

  await boardModel.findByIdAndUpdate(newBoard._id, { lists: newListIds });
  targetWorkspace.boards.push(newBoard._id);
  await targetWorkspace.save();
  const io = getIO();
  io.to(targetWorkspace._id.toString()).emit("boardCreated", newBoard);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { newBoard, originalBoard },
        "Board copied successfully"
      )
    );
});
