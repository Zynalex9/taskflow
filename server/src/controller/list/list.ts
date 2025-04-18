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
import { CheckAdmin, deleteIfExists, findData } from "../../utils/helpers";
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
    if (!workspace.admin.includes(userId)) {
      res.status(401).json({
        message: "You're not authorized to create board in this workspace",
        success: false,
      });
      return;
    }
    const existingList = await ListModel.findOne({ name, board: boardId });
    if (existingList) {
      res.status(401).json({
        message: "Name already exist, please choose another name",
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
      const isAuthorized = await CheckAdmin(userId, workspaceId);
      if (!isAuthorized) {
        await session.abortTransaction();
        res
          .status(403)
          .json({ message: "You are not authorized to delete the board" });
        return;
      }
      const list = await ListModel.findById(listId).session(session);
      if (!list) {
        await session.abortTransaction();
        res.status(400).json({ message: "List not found" });
        return;
      }
  
      const cards = await CardModel.find({ list: listId });
      if (cards.length == 0) {
        await ListModel.findByIdAndDelete(listId).session(session);
        session.commitTransaction();
        res
          .status(200)
          .json({ message: "List deleted. There was no cards in the list" });
        return;
      }
  
      const cardIds = cards.flatMap((c) => c._id);
  
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
      session.commitTransaction();
      res.status(200).json({ message: `List is deleted with related data` });
      return;
    } catch (error) {
      await session.abortTransaction();
      console.error("Delete List Error:", error);
      res.status(500).json({ message: "Internal server error", error });
    } finally {
      session.endSession();
    }
  };