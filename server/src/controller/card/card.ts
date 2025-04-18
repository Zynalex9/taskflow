import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiResponse from "../../utils/ApiResponse";
import { CardModel } from "../../models/card.model";
import { CheckAdmin, checkRequiredBody, deleteIfExists, findData, notFound } from "../../utils/helpers";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { ListModel } from "../../models/list.models";
import { UserModel } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";

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
    const lastCard = await CardModel.findOne({ list: listId })
      .sort({ position: -1 })
      .select("position");
    const newPosition = lastCard ? lastCard.position + 1 : 0;

    const newCard = await CardModel.create({
      name: uniqueName,
      createdBy: userId,
      list: listId,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined,
      description: description ? description : "",
      priority: priority ? priority : "",
      position: newPosition,
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
export const joinCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(new ApiResponse(401, {}, "You're not authorized"));
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card does not found", success: false });
      return;
    }
    if (card.members.includes(userId)) {
      res
        .status(409)
        .json({ message: "You're already member", success: false });
      return;
    }

    const updatedCard = await UserModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { members: userId } },
      { new: true }
    );
    res.status(200).json({
      message: "User added to the card successfully",
      success: true,
      card: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const leaveCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.body;
    const userId = req.user._id;
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found", success: false });
      return;
    }
    if (card.createdBy.toString() === userId.toString()) {
      res.status(403).json({
        message:
          "You are the admin of this card. You must delete it instead of leaving.",
        success: false,
      });
      return;
    }
    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      { $pull: { members: userId } },
      { new: true }
    );
    res.status(200).json({
      message: "User removed from the card successfully",
      success: true,
      card: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const editCardDetails = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      addMembers,
      removeMembers,
      addLabels,
      removeLabels,
      priority,
    }: {
      name?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      addMembers?: string[];
      removeMembers?: string[];
      addLabels?: string[];
      removeLabels?: string[];
      priority: string;
    } = req.body;
    const { listId, cardId } = req.params;
    if (!listId || !cardId) {
      res.status(407).json({ message: "Card ID or List ID is missing" });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }
    if (name) card.name = name;
    if (description) card.description = description;
    if (startDate) card.startDate = startDate;
    if (endDate) card.endDate = endDate;
    if (priority) card.priority = priority;
    //Add Members
    const currentMembers = card.members.map((member) => member.toString());
    if (addMembers && addMembers.length > 0) {
      const objectIds = addMembers.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      const membersToAdd = await UserModel.find({
        $or: [
          {
            _id: { $in: objectIds },
          },
          { email: { $in: addMembers } },
          { username: { $in: addMembers } },
        ],
      });
      if (membersToAdd.length !== addMembers.length) {
        res.status(404).json({
          message: "One or more  users to add not found",
          success: false,
        });
        return;
      }
      const addIds = membersToAdd.map((member) => member._id.toString());
      const mergedIds = new Set([...currentMembers, ...addIds]);
      card.members.splice(
        0,
        card.members.length,
        ...Array.from(mergedIds).map((id) => new mongoose.Types.ObjectId(id))
      );
    }
    //Add Labels
    if (addLabels && addLabels.length > 0) {
      for (const label of addLabels) {
        const { name, color }: any = label;
        if (!color) {
          res
            .status(400)
            .json({ message: "Color is required for labels", success: false });
          return;
        }

        let existingLabel = await CardLabelModel.findOne({
          color,
          card: card._id,
        });

        if (!existingLabel) {
          existingLabel = await CardLabelModel.create({
            name,
            color,
            card: card._id,
          });
        }

        if (
          !card.labels.includes(existingLabel._id as mongoose.Types.ObjectId)
        ) {
          card.labels.push(existingLabel._id);
        }
      }
    }
    //Remove Members
    if (removeMembers && removeMembers.length > 0) {
      const objectIds = removeMembers.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      const membersToRemove = await UserModel.find({
        $or: [
          {
            _id: { $in: objectIds },
          },
          { email: { $in: removeMembers } },
          { username: { $in: removeMembers } },
        ],
      });
      if (membersToRemove.length !== removeMembers.length) {
        res.status(404).json({
          message: "One or more users to remove not found",
          success: false,
        });
        return;
      }
      const removeIds = membersToRemove.map((member) => member._id.toString());
      card.members = card.members
        .toObject()
        .filter(
          (id: mongoose.Types.ObjectId) => !removeIds.includes(id.toString())
        );
    }
    //Remove Members
    if (removeLabels && removeLabels.length > 0) {
      const objectIds = removeLabels.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      const labelsToRemove = await CardLabelModel.find({
        $or: [
          {
            _id: { $in: objectIds },
          },
          { name: { $in: removeLabels } },
          { color: { $in: removeLabels } },
        ],
        card: card._id,
      });
      if (labelsToRemove.length === 0) {
        res.status(404).json({
          message: "One or more labels to remove not found",
          success: false,
        });
        return;
      }
      const removeLabelIds = labelsToRemove.map((label) =>
        (label._id as mongoose.Types.ObjectId).toString()
      );
      card.labels = card.labels
        .toObject()
        .filter(
          (id: mongoose.Types.ObjectId) =>
            !removeLabelIds.includes(id.toString())
        );
    }
    await card.save();
    res.status(201).json({ card });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
};
export const getCardsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const cards = await CardModel.find({ createdBy: userId });
    if (!cards) {
      res.status(404).json({ message: "user have no cards" });
      return;
    }
    res.status(200).json({ cards });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
};
export const getCardsByList = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const { listId } = req.params;
    if (!listId) {
      res.status(400).json({ message: "workspace ID is required" });
      return;
    }
    const cards = await CardModel.find({ createdBy: userId, list: listId });
    if (cards.length === 0) {
      res.status(404).json({ message: "No Cards found in the given list" });
      return;
    }
    res.status(200).json({ message: "Cards found", cards });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
};
export const deleteCard = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { workspaceId, cardId } = req.params;
      const userId = req.user._id;
  
      if (!workspaceId || !cardId) {
        res.status(400).json(new ApiResponse(400, {}, "Both workspace and card Id are required"));
        return;
      }
  
      const card = await CardModel.findById(cardId).session(session);
      if (!card) {
        res.status(404).json(new ApiResponse(404, {}, "Card not found"));
        return;
      }
  
      const isAuthorized = await CheckAdmin(userId, workspaceId);
      if (!isAuthorized) {
        res.status(403).json(new ApiResponse(403, {}, "You're not authorized to delete a card in this workspace"));
        return;
      }
  
      const allCommentsIds = findData([card], "comments");
      const allLabelsIds = findData([card], "labels");
      const allAttachmentsId = findData([card], "attachments");
      const allChecklistIDs = findData([card], "checklist");
  
      await deleteIfExists(commentsModel, allCommentsIds, session);
      await deleteIfExists(CardLabelModel, allLabelsIds, session);
      await deleteIfExists(CardAttachmentModel, allAttachmentsId, session);
      await deleteIfExists(CheckListModel, allChecklistIDs, session);
  
      await CardModel.findByIdAndDelete(cardId).session(session);
  
      await session.commitTransaction();
      res.status(200).json(new ApiResponse(200, {}, "Card deleted successfully"));
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
    } finally {
      session.endSession();
    }
};
export const copyCard = asyncHandler(async (req, res) => {
  const required = ["cardId", "ListId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { cardId, ListId } = req.body;
  const card = await CardModel.findById(cardId);
  if (notFound(card, "Card", res)) return;
  const list = await ListModel.findById(ListId);
  if (notFound(list, "List", res)) return;

  list?.cards.push(cardId);
  await list?.save();
  res.status(200).json(new ApiResponse(200, list, "Card copied"));
});
export const moveCard = asyncHandler(async (req, res) => {
  const required = ["cardId", "ListId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { cardId, ListId } = req.body;
  const card = await CardModel.findById(cardId);
  if (notFound(card, "Card", res)) return;

  const list = await ListModel.findById(ListId);
  if (!list) {
    notFound(list, "List", res);
    return;
  }
  const oldList = await ListModel.findOne({ cards: cardId });
  if (!oldList) {
    notFound(oldList, "Old List", res);
    return;
  }

  list?.cards.push(cardId);
  oldList.cards = oldList.cards.filter(
    (id) => id.toString() !== cardId.toString()
  );
  await list.save();
  await oldList.save();
  res.status(200).json(new ApiResponse(200, list, "Card moved"));
});
