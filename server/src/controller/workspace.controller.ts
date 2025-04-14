import { Request, Response } from "express";
import { workSpaceModel } from "../models/workspace.model";
import { UserModel } from "../models/user.model";
import { boardModel } from "../models/board.models";
import { ListModel } from "../models/list.models";
import { CardModel } from "../models/card.model";
import mongoose from "mongoose";
import { commentsModel } from "../models/card.comments.models";
import { CardLabelModel } from "../models/card.label.model";
import { CardAttachmentModel } from "../models/card.attachments.model";
import { CheckListModel } from "../models/card.checklist.model";

interface IParams {
  name: string;
  members?: string[];
  admins?: string[];
}

export const createWorkSpace = async (req: Request, res: Response) => {
  try {
    const {
      name,
      members: memberIdentifiers,
      admins: adminIdentifiers,
    }: IParams = req.body;
    const userId = req.user._id;
    if (!name) {
      res.status(409).json({ message: "Please name your workspace" });
      return;
    }
    const alreadyNamed = await workSpaceModel.findOne({ name, admin: userId });
    if (alreadyNamed) {
      res.status(409).json({
        message: "You already have a workspace with this name",
      });
      return;
    }
    const workspaceAdmins = [userId];
    const fetchUsersByIdentifiers = async (identifiers: string[]) => {
      const users = await UserModel.find({
        $or: [
          {
            email: { $in: identifiers },
          },
          {
            username: { $in: identifiers },
          },
        ],
      });
      return users;
    };

    if (adminIdentifiers && adminIdentifiers.length > 0) {
      const AdditionalAdmins = await fetchUsersByIdentifiers(adminIdentifiers);
      if (AdditionalAdmins && AdditionalAdmins.length > 0) {
        AdditionalAdmins.forEach((admin) => {
          if (!workspaceAdmins.includes(admin)) {
            workspaceAdmins.push(admin._id);
          }
        });
      }
    }
    const workspaceMembers: any = [];
    if (memberIdentifiers && memberIdentifiers.length > 0) {
      const addedMembers = await fetchUsersByIdentifiers(memberIdentifiers);
      if (addedMembers && addedMembers.length > 0) {
        addedMembers.forEach((member) => {
          if (!workspaceMembers.includes(member)) {
            workspaceMembers.push(member._id);
          }
        });
      }
    }
    const workSpace = await workSpaceModel.create({
      name,
      admin: workspaceAdmins,
      members: workspaceMembers || [],
      createdBy: userId,
    });

    const allUsers = [...workspaceAdmins, ...workspaceMembers];
    await UserModel.updateMany(
      { _id: { $in: allUsers } },
      {
        $push: {
          workspace: workSpace._id,
        },
      }
    );
    res.status(201).json({
      message: "Workspace Created",
      workSpace,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, visibility, backgroundOptions, workspaceId } = req.body;
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
    if (!workspace.admin.includes(userId)) {
      res.status(403).json({
        message: "You are not authorized to create a board in this workspace",
        success: false,
      });
      return;
    }
    const newBoard = await boardModel.create({
      title,
      visibility: visibilityStatus,
      backgroundOptions: backgroundStatus,
      createdBy: userId,
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
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, listId, startDate, endDate, description, priority } =
      req.body;
    if (!name) {
      res.status(409).json({
        message: "Please choose a title for your card",
        success: false,
      });
      return;
    }
    if (!listId) {
      res.status(409).json({
        message: "List ID is required",
        success: false,
      });
      return;
    }
    const userId = req.user._id;
    const list = await ListModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(listId) },
      },
      {
        $lookup: {
          from: "boards",
          localField: "board",
          foreignField: "_id",
          as: "board",
        },
      },
      {
        $unwind: "$board",
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "board.workspace",
          foreignField: "_id",
          as: "targetedWorkSpace",
        },
      },
      {
        $unwind: "$targetedWorkSpace",
      },
      {
        $project: {
          name: 1,
          "board.title": 1,
          "targetedWorkSpace.admin": 1,
        },
      },
    ]);
    const adminsId = list[0].targetedWorkSpace.admin.map((id: any) =>
      id.toString()
    );

    if (!adminsId.includes(userId.toString())) {
      res.status(408).json({
        message:
          "Sorry, you're not authorized to create card in this workspace",
        success: false,
      });
      return;
    }
    const existingCards = await CardModel.find({
      name: { $regex: `^${name}( \\d+)?$`, $options: "i" },
      list: listId,
    });
    let uniqueName = name;
    if (existingCards.length > 0) {
      let maxNumber = 0;
      existingCards.forEach((card) => {
        const match = card.name.match(/\d+$/);
        if (match) {
          const number = parseInt(match[0], 10);
          if (number > maxNumber) {
            maxNumber = number;
          }
        }
      });
      uniqueName = `${name} ${maxNumber + 1}`;
    }

    const newCard = await CardModel.create({
      name: uniqueName,
      createdBy: userId,
      list: listId,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
      description: description ? description : "",
      priority: priority ? priority : "",
    });
    await ListModel.findOneAndUpdate(
      { _id: listId },
      {
        $push: { cards: newCard._id },
      }
    );
    res.status(201).json({
      message: "Card created successfully",
      success: true,
      newCard,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};
export const getWorkspaceTableData = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      res
        .status(400)
        .json({ message: "Workspace ID is required", success: false });
      return;
    }
    const tableData = await boardModel.aggregate([
      {
        $match: { workspace: new mongoose.Types.ObjectId(workspaceId) },
      },
      {
        $lookup: {
          from: "lists",
          localField: "_id",
          foreignField: "board",
          as: "listsDetails",
        },
      },
      {
        $unwind: {
          path: "$listsDetails",
        },
      },
      {
        $lookup: {
          from: "todos",
          localField: "listsDetails._id",
          foreignField: "list",
          as: "cardsDetails",
        },
      },
      { $unwind: "$cardsDetails" },
      {
        $lookup: {
          from: "labels",
          localField: "cardsDetails.labels",
          foreignField: "_id",
          as: "LabelDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "cardsDetails.members",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          boardName: "$title",
          listName: "$listDetails.name",
          cardName: "$cardsDetails.name",
          labels: "$LabelDetails.name",
          members: "$userDetails.username",
        },
      },
    ]);
    if (!tableData || tableData.length === 0) {
      res.status(404).json({
        message: "No Table Found",
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: "Table Found",
      tableData,
      success: false,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
      console.log(error.message);
    }
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const getCalendarData = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      res.status(400).json({ error: "Workspace ID is required" });
      return;
    }
    const calenderData = await CardModel.aggregate([
      {
        $lookup: {
          from: "lists",
          localField: "list",
          foreignField: "_id",
          as: "listDetails",
        },
      },
      { $unwind: "$listDetails" },
      {
        $lookup: {
          from: "boards",
          localField: "listDetails.board",
          foreignField: "_id",
          as: "boardDetails",
        },
      },
      { $unwind: "$boardDetails" },
      {
        $match: {
          "boardDetails.workspace": new mongoose.Types.ObjectId(workspaceId),
          endDate: { $ne: null },
        },
      },
      {
        $lookup: {
          from: "labels",
          localField: "labels",
          foreignField: "_id",
          as: "labelDetails",
        },
      },
      {
        $project: {
          name: 1,
          endDate: 1,
          labels: {
            $map: {
              input: "$labelDetails",
              as: "label",
              in: "$$label.name",
            },
          },
        },
      },
    ]);
    res.status(200).json({ message: "ok", calenderData });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
      console.log(error.message);
    }
    res.status(500).json({ message: "Internal server error", success: false });
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
export const allWorkspaces = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user;
    const workspaces = await workSpaceModel.find({ createdBy: userId }).lean();
    if (workspaces.length === 0) {
      res.status(404).json({ message: "workspace not found" });
      return;
    }
    res.status(201).json({ message: "Workspace(s) Found", workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

export const deleteWorkSpace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.body;
    const userId = req.user._id;
    const workspace = await workSpaceModel.findById(workspaceId);
    if (!workspace?.admin.includes(userId)) {
      res
        .status(200)
        .json({ message: "You are not authorized to delete the workspace" });
      return;
    }
    const boards = await boardModel.find({ workspace: workspaceId });
    if (boards.length === 0) {
      await workSpaceModel.findByIdAndDelete(workspaceId);
      res.status(201).json({ message: "Workspace deleted.." });
      return;
    }
    const boardIds = boards.map((b) => b._id);

    const lists = await ListModel.find({ board: { $in: boardIds } });
    if (lists.length === 0) {
      await boardModel.deleteMany({ _id: { $in: boardIds } });
      await workSpaceModel.findByIdAndDelete(workspaceId);
      res.status(201).json({
        message: "Workspace deleted and corresponding boards are deleted",
      });
      return;
    }
    const listIds = lists.map((list) => list._id);

    const cards = await CardModel.find({ list: { $in: listIds } });
    if (cards.length === 0) {
      await ListModel.deleteMany({ _id: { $in: listIds } });
      await boardModel.deleteMany({ _id: { $in: boardIds } });
      await workSpaceModel.findByIdAndDelete(workspaceId);
      res.status(201).json({
        message:
          "Workspace deleted and corresponding boards and lists are deleted",
      });
      return;
    }
    const cardIds = cards.map((c) => c._id);

    const allCommentsIds = cards.flatMap((c) => c.comments);
    const allLabelsIds = cards.flatMap((c) => c.labels);
    const allChecklistIDs = cards.flatMap((c) => c.checklist);
    const allAttachmentsId = cards.flatMap((c) => c.attachments);
    if (allCommentsIds.length > 0) {
      await commentsModel.deleteMany({ _id: { $in: allCommentsIds } });
    }
    if (allLabelsIds.length > 0) {
      await CardLabelModel.deleteMany({ _id: { $in: allLabelsIds } });
    }
    if (allChecklistIDs.length > 0) {
      await CheckListModel.deleteMany({ _id: { $in: allChecklistIDs } });
    }
    if (allAttachmentsId.length > 0) {
      await CardAttachmentModel.deleteMany({ _id: { $in: allAttachmentsId } });
    }

    await CardModel.deleteMany({ _id: { $in: cardIds } });
    await ListModel.deleteMany({ _id: { $in: listIds } });
    await boardModel.deleteMany({ _id: { $in: boardIds } });
    await workSpaceModel.findByIdAndDelete(workspaceId);
    res.status(200).json({
      message: "Workspace deleted",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error in deleting workspace", error });
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

    const workspace = await workSpaceModel.findById(board.workspace).session(session);
    if (!workspace?.admin.includes(user)) {
      res.status(403).json({ message: "You are not authorized to delete the board" });
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
    const cards = await CardModel.find({ list: { $in: listIds } }).session(session);

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
      await commentsModel.deleteMany({ _id: { $in: allCommentsIds } }).session(session);
    }
    if (allLabelsIds.length > 0) {
      await CardLabelModel.deleteMany({ _id: { $in: allLabelsIds } }).session(session);
    }
    if (allChecklistIDs.length > 0) {
      await CheckListModel.deleteMany({ _id: { $in: allChecklistIDs } }).session(session);
    }
    if (allAttachmentsId.length > 0) {
      await CardAttachmentModel.deleteMany({ _id: { $in: allAttachmentsId } }).session(session);
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

