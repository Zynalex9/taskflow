import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiResponse from "../../utils/ApiResponse";
import { CardModel } from "../../models/card.model";
import {
  cardActivityUpdate,
  CheckAdmin,
  checkRequiredBody,
  deleteIfExists,
  findData,
  notFound,
} from "../../utils/helpers";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { ListModel } from "../../models/list.models";
import { UserModel } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { redisClient } from "../..";
import { getIO } from "../../socket";
import { UploadOnCloudinary } from "../../utils/cloudinary";
const cloudinary = require("cloudinary").v2;

export const createCard = async (req: Request, res: Response) => {
  try {
    const {
      name,
      listId,
      startDate,
      endDate,
      description,
      priority,
      workspaceId,
    } = req.body;
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
    const List = await ListModel.findById(listId);
    if (!List) {
      res.status(409).json(new ApiResponse(404, {}, "List not found"));
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

    const cardMembers = [
      ...new Set([userId.toString(), List.createdBy.toString()]),
    ];
    const newCard = await CardModel.create({
      name: uniqueName,
      createdBy: userId,
      list: listId,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : null,
      description: description ? description : "",
      priority: priority ? priority : "",
      position: newPosition,
      members: cardMembers,
    });
    List.cards.push(newCard._id);
    await List.save();
    await redisClient.del(`tableData:${userId}`);
    await redisClient.del(`singleBoard:${List.board}`);
    cardActivityUpdate(
      newCard._id,
      `(${req.user.username}) created a (${newCard.name})`
    );
    const io = getIO();
    io.to(workspaceId).emit("cardCreated", newCard);
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
    const { cardId, workspaceId } = req.body;
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

    const updatedCard = await CardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("members");
    await redisClient.del(`singleCard:${cardId}`);
    cardActivityUpdate(
      card._id,
      `(${req.user.username}) joined (${card.name})`
    );
    const io = getIO();

    io.to(workspaceId).emit("joinedCard", updatedCard);
    res
      .status(200)
      .json(new ApiResponse(200, { updatedCard }, "Joined card successfully"));
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
    const { cardId, workspaceId } = req.body;
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
    ).populate("members");
    cardActivityUpdate(card._id, `(${req.user.username}) left (${card.name})`);
    const io = getIO();

    io.to(workspaceId).emit("joinedCard", updatedCard);

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
    const userId = req.user._id;
    await redisClient.del(`tableData:${userId}`);
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
export const addDescription = asyncHandler(async (req, res) => {
  const { description, cardId, workspaceId } = req.body;
  if (!description || !cardId) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "No Description/cardId provided"));
    return;
  }
  const card = await CardModel.findById(cardId);
  if (!card) {
    res.status(404).json(new ApiResponse(404, {}, "No card found"));
    return;
  }
  card.description = description;
  await card.save();
  const io = getIO();
  io.to(workspaceId).emit("descriptionAdded", description);
  res.status(200).json(new ApiResponse(200, card, "Description updated"));
});
export const addEndDate = asyncHandler(async (req, res) => {
  const { endDate, cardId } = req.body;
  if (!endDate || !cardId) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "No due date/cardId provided"));
    return;
  }
  const card = await CardModel.findById(cardId);
  if (!card) {
    res.status(404).json(new ApiResponse(404, {}, "No card found"));
    return;
  }
  card.endDate = endDate;
  await card.save();
  res.status(200).json(new ApiResponse(200, card, "End date addded"));
});
export const addDate = asyncHandler(async (req, res) => {
  const { startDate, endDate, cardId, workspaceId } = req.body;
  if (!startDate && !endDate) {
    res.status(401).json(new ApiResponse(401, {}, "No date provided"));
    return;
  }
  if (!cardId) {
    res.status(401).json(new ApiResponse(401, {}, "No card id provided"));
    return;
  }
  const card = await CardModel.findById(cardId);
  if (!card) {
    res.status(404).json(new ApiResponse(404, {}, "No card found"));
    return;
  }
  if (startDate) {
    card.startDate = startDate;
  }
  if (endDate) {
    card.endDate = endDate;
  }
  const io = getIO();
  io.to(workspaceId).emit("dateAdded", card);
  await card.save();
  res.status(200).json(new ApiResponse(200, card, "Description updated"));
});
export const addStartDate = asyncHandler(async (req, res) => {
  const { startDate, cardId, workspaceId } = req.body;
  if (!startDate || !cardId) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "No start date/cardId provided"));
    return;
  }
  const card = await CardModel.findById(cardId);
  if (!card) {
    res.status(404).json(new ApiResponse(404, {}, "No card found"));
    return;
  }
  card.startDate = startDate;
  await card.save();
  const io = getIO();

  io.to(workspaceId).emit("dateAdded", card);

  res.status(200).json(new ApiResponse(200, card, "Start date addded"));
});
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
    await redisClient.del(`tableData:${userId}`);
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
      res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Both workspace and card Id are required")
        );
      return;
    }

    const card = await CardModel.findById(cardId).session(session);
    if (!card) {
      res.status(404).json(new ApiResponse(404, {}, "Card not found"));
      return;
    }

    const isAuthorized = await CheckAdmin(userId, workspaceId);
    if (!isAuthorized) {
      res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "You're not authorized to delete a card in this workspace"
          )
        );
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
export const copyCard = asyncHandler(async (req: Request, res: Response) => {
  const required = ["cardId", "ListId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { cardId, ListId } = req.body;
  const card = await CardModel.findById(cardId);
  if (notFound(card, "Card", res)) return;
  const list = await ListModel.findById(ListId);
  if (notFound(list, "List", res)) return;
  list?.cards.push(cardId);
  await list?.save();
  const userId = req.user._id;
  await redisClient.del(`tableData:${userId}`);
  await redisClient.del(`singleCard:${cardId}`);
  if (card && list) {
    cardActivityUpdate(
      card._id,
      `${req.user.username} copied (${card.name}) to (${list.name})`
    );
  }

  res.status(200).json(new ApiResponse(200, list, "Card copied"));
});
export const moveCard = asyncHandler(async (req: Request, res: Response) => {
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
  const userId = req.user._id;
  await redisClient.del(`tableData:${userId}`);
  await redisClient.del(`singleCard:${cardId}`);
  if (card && list && oldList) {
    cardActivityUpdate(
      cardId,
      `${req.user.username} moved (${card.name}) from (${oldList.name}) to (${list.name})`
    );
  }
  res.status(200).json(new ApiResponse(200, list, "Card moved"));
});
export const getSingleCard = asyncHandler(
  async (req: Request, res: Response) => {
    const { cardId } = req.params;
    const cachedKey = `singleCard:${cardId}`;
    const cachedCard = await redisClient.get(cachedKey);
    // if (cachedCard) {
    //   res
    //     .status(200)
    //     .json(new ApiResponse(200, JSON.parse(cachedCard), "Card from cache"));
    //   return;
    // }

    const card = await CardModel.findById(cardId)
      .populate("labels")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .populate("attachments")
      .populate("checklist")
      .populate("list")
      .populate("members");
    if (!card) {
      res.status(404).json(new ApiResponse(404, {}, "No card found "));
      return;
    }
    await redisClient.set(cachedKey, JSON.stringify(card), "EX", 1300);
    res.status(200).json(new ApiResponse(200, card, "Card found"));
    return;
  }
);
export const getCardActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const { cardId } = req.params;
    if (!cardId) {
      res.status(404).json(new ApiResponse(404, {}, "No card Id provided"));
      return;
    }
    const logs = await redisClient.lrange(`card:${cardId}`, 0, 10);
    res.status(200).json(new ApiResponse(200, logs, "Here you go"));
  }
);
export const toggleComplete = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.body);
    const { cardId, isComplete, workspaceId } = req.body;
    if (!cardId && !isComplete) {
      res
        .status(400)
        .json(new ApiResponse(402, {}, "Invalid card id or boolean"));
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json(new ApiResponse(401, {}, "No card found"));
      return;
    }
    card.checked = !card.checked;
    await card.save();
    const io = getIO();
    io.to(workspaceId).emit("cardUpdated", card.checked);
    res.status(200).json(new ApiResponse(200, {}, "Updateds"));
  }
);
export const addCover = asyncHandler(async (req: Request, res: Response) => {
  const { cardId, workspaceId } = req.body;
  const card = await CardModel.findById(cardId);
  if (!card) {
    res.status(404).json(new ApiResponse(404, {}, "No card found"));
    return;
  }
  if (!req.file) {
    res.status(400).json(new ApiResponse(400, {}, "No file uploaded"));
    return;
  }
  const path = req.file.path;
  const uploadResult = await UploadOnCloudinary({ localFilePath: path });
  const coverUrl = uploadResult?.url;
  if (!cardId || !coverUrl) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "cardId and coverUrl are required"));
    return;
  }

  card.cover = coverUrl;
  await card.save();
  const io = getIO();
  io.to(workspaceId).emit("coverAdded", coverUrl);
  res.status(200).json(new ApiResponse(200, card, "Cover added to card"));
});
