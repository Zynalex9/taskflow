import { Request, Response } from "express";
import mongoose from "mongoose";
import { boardModel } from "../../models/board.models";
import { workSpaceModel } from "../../models/workspace.model";
import { ListModel } from "../../models/list.models";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CardModel } from "../../models/card.model";
import {
  checkRequiredBody,
  deleteIfExists,
  findData,
  notFound,
} from "../../utils/helpers";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { redisClient } from "../..";
import { getIO } from "../../socket";

export const createList = async (req: Request, res: Response) => {
  try {
    const { name, boardId } = req.body;
    const userId = req.user._id;

    if (!name) {
      res.status(401).json({
        message: "Please provide a name for your List",
        success: false,
      });
      return;
    }
    if (!boardId) {
      res.status(401).json({
        message: "Board ID is required",
        success: false,
      });
      return;
    }

    const board = await boardModel.findById(boardId);
    if (!board) {
      res.status(401).json({
        message: "No board found",
        success: false,
      });
      return;
    }
    const workspace = await workSpaceModel.findById(board.workspace);
    if (!workspace) {
      res.status(401).json({
        message: "No workspace found",
        success: false,
      });
      return;
    }
    const newList = await ListModel.create({
      name,
      createdBy: userId,
      board: boardId,
    });
    await boardModel.findByIdAndUpdate(boardId, {
      $push: { lists: newList._id },
    });
    await redisClient.del(`lists:${boardId}:${userId}`);
    const io = getIO();
    io.to(board.workspace.toString()).emit("listCreated", newList);
    res.status(201).json({
      message: "List created successfully",
      success: true,
      newList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error in creating list",
      success: false,
    });
  }
};
export const getAllLists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { boardId } = req.params;
    const userId = req.user;

    if (!boardId) {
      res.status(400).json({ message: "Board ID is required" });
      return;
    }
    const cachedList = await redisClient.get(
      `lists:${boardId}:userId:${userId}`
    );
    if (cachedList) {
      const parsedList = JSON.parse(cachedList);
      res
        .status(200)
        .json(new ApiResponse(200, parsedList, "List served from cache"));
      return;
    }
    const board = await boardModel
      .findOne({ _id: boardId, createdBy: userId })
      .lean();
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const allLists = await ListModel.find({ board: boardId });

    if (allLists.length === 0) {
      res.status(404).json({ message: "No lists found for this board" });
      return;
    }
    await redisClient.set(
      `lists:${boardId}:userId:${userId}`,
      JSON.stringify(allLists),
      "EX",
      1300
    );
    res.status(200).json({
      message: "Lists retrieved",
      allLists,
      workspaceId: board.workspace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteList = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { listId, workspaceId } = req.params;
    const userId = req.user._id;

    if (!listId) {
      await session.abortTransaction();
      res.status(400).json({ message: "List id missing" });
      return;
    }
    const list = await ListModel.findById(listId).session(session);
    if (!list) {
      await session.abortTransaction();
      res.status(400).json({ message: "List not found" });
      return;
    }

    const cards = await CardModel.find({ list: listId });

    if (cards.length === 0) {
      await ListModel.findByIdAndDelete(listId).session(session);
      await session.commitTransaction();
      const io = getIO();
      io.to(workspaceId).emit("listDeleted", listId);

      res
        .status(200)
        .json({ message: "List deleted. There were no cards in the list" });
      return;
    }

    const cardIds = cards.map((c) => c._id);
    const allCommentsIds = findData(cards, "comments");
    const allLabelsIds = findData(cards, "labels");
    const allAttachmentsId = findData(cards, "attachments");
    const allChecklistIDs = findData(cards, "checklist");

    await deleteIfExists(commentsModel, allCommentsIds, session);
    await deleteIfExists(CardLabelModel, allLabelsIds, session);
    await deleteIfExists(CardAttachmentModel, allAttachmentsId, session);
    await deleteIfExists(CheckListModel, allChecklistIDs, session);

    await CardModel.deleteMany({ _id: { $in: cardIds } }).session(session);
    await ListModel.findByIdAndDelete(listId).session(session);

    await session.commitTransaction(); // ✅ Await commit
    await redisClient.del(`lists:${list.board}:userId:${userId}`);
    const io = getIO();
    console.log("Emitting listDeleted to workspace:", workspaceId);
    console.log(
      "Sockets in workspace:",
      io.sockets.adapter.rooms.get(workspaceId)
    );
    io.to(workspaceId).emit("listDeleted", listId);
    res.status(200).json({ message: `List is deleted with related data` });
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete List Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  } finally {
    session.endSession();
  }
};

export const copyList = asyncHandler(async (req, res) => {
  const required = ["listId", "targetedBoardId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { listId, targetedBoardId } = req.body;
  const list = await ListModel.findById(listId);
  if (!list) {
    notFound(list, "List", res);
    return;
  }
  const targetedBoard = await boardModel.findById(targetedBoardId);
  if (!targetedBoard) {
    notFound(targetedBoard, "Targeted Board", res);
    return;
  }
  targetedBoard.lists.push(listId);
  await targetedBoard.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        targetedBoard,
        `${list.title} copied to ${targetedBoard.title}`
      )
    );
});
export const moveList = asyncHandler(async (req, res) => {
  const required = ["listId", "currentBoardId", "targetedBoardId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { listId, currentBoardId, targetedBoardId } = req.body;
  const list = await ListModel.findById(listId);
  if (!list) {
    notFound(list, "List", res);
    return;
  }
  const currentBoard = await boardModel.findById(currentBoardId);
  if (!currentBoard) {
    notFound(currentBoard, "Current Board", res);
    return;
  }
  const targetedBoard = await boardModel.findById(targetedBoardId);
  if (!targetedBoard) {
    notFound(targetedBoard, "Targeted Board", res);
    return;
  }
  targetedBoard.lists.push(listId);
  currentBoard.lists = currentBoard.lists.filter(
    (list) => list._id.toString() !== listId.toString()
  );
  list.board = targetedBoard._id;
  await list.save();
  await targetedBoard.save();
  await currentBoard.save();
  await redisClient.del(`lists:${currentBoardId}:${req.user._id}`);
  await redisClient.del(`lists:${targetedBoardId}:${req.user._id}`);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        targetedBoard,
        `${list.name} moved to ${targetedBoard.title}`
      )
    );
});
export const copyIntoNewList = asyncHandler(async (req, res) => {
  const { listId, boardId } = req.body;

  if (!listId || !boardId) {
    res.status(400).json({ message: "List ID and Board ID are required" });
    return;
  }

  // Fixed: Consistent model naming (assuming PascalCase convention)
  const targetBoard = await boardModel.findById(boardId);
  if (!targetBoard) {
    res.status(404).json({ message: "Target board not found" });
    return;
  }

  const [originalList] = await ListModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(listId) } },
    {
      $lookup: {
        from: "todos",
        localField: "cards",
        foreignField: "_id",
        as: "cards",
        pipeline: [
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
              from: "attachments",
              localField: "attachments",
              foreignField: "_id",
              as: "attachments",
            },
          },
        ],
      },
    },
  ]);

  if (!originalList) {
    res.status(404).json({ message: "List not found" });
    return;
  }

  const newList = await ListModel.create({
    name: `${originalList.name} (Copy)`,
    color: originalList.color,
    createdBy: originalList.createdBy,
    position: originalList.position + 1,
    board: new mongoose.Types.ObjectId(boardId),
    cards: [],
    isArchived: false,
  });

  // Collect all new card IDs for efficient batch update
  const newCardIds: any[] = [];

  await Promise.all(
    originalList.cards.map(async (card: any) => {
      const [newComments, newLabels, newChecklists, newAttachments] =
        await Promise.all([
          Promise.all(
            card.comments.map((c: any) =>
              commentsModel.create({
                comment: c.comment,
                author: c.author,
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
      });

      // Update related documents with new card ID references
      await Promise.all([
        // Update checklists with cardId reference
        ...newChecklists.map((checklist) =>
          CheckListModel.findByIdAndUpdate(checklist._id, {
            cardId: newCard._id,
          })
        ),
        // Update attachments with cardId reference
        ...newAttachments.map((attachment) =>
          CardAttachmentModel.findByIdAndUpdate(attachment._id, {
            cardId: newCard._id,
          })
        ),
        // Update labels with card reference (if your model has this field)
        ...newLabels.map((label) =>
          CardLabelModel.findByIdAndUpdate(label._id, {
            card: newCard._id,
          })
        ),
      ]);

      // Collect card ID instead of updating list immediately
      newCardIds.push(newCard._id);
    })
  );

  // Fixed: Single efficient batch update instead of multiple individual updates
  await ListModel.findByIdAndUpdate(newList._id, {
    $set: { cards: newCardIds },
  });
  await boardModel.findByIdAndUpdate(boardId, {
    $push: { lists: newList._id },
  });
  res.status(201).json({ message: "List copied successfully", newList });
});
