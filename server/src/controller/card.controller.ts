import { Request, Response } from "express";
import { CardModel } from "../models/card.model";
import { CardLabelModel } from "../models/card.label.model";
import { commentsModel } from "../models/card.comments.models";
import { UploadOnCloudinary } from "../utils/cloudinary";
import { CardAttachmentModel } from "../models/card.attachments.model";
import { CheckListModel } from "../models/card.checklist.model";
import { mongo, Types } from "mongoose";
import { UserModel } from "../models/user.model";
import mongoose from "mongoose";

interface INewItem {
  title: string;
  completed: boolean;
  assignedTo?: Types.ObjectId[] | any;
  createdBy: Types.ObjectId;
  dueDate: Date | undefined;
}

export const joinCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.body;
    const userId = req.user._id;
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

    card.members.push(userId);
    await card.save();
    res.status(200).json({
      message: "User added to the card successfully",
      success: true,
      card,
    });
    return;
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
      res.status(404).json({ message: "Card does not found", success: false });
      return;
    }
    if (!card.members.includes(userId)) {
      res.status(401).json({
        message: "User is not a member of this card",
        success: false,
      });
      return;
    }

    card.members.pull(userId);
    await card.save();
    res.status(200).json({
      message: "User removed from the card successfully",
      success: true,
      card,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};
export const addLabel = async (req: Request, res: Response) => {
  try {
    const { name, color, cardId } = req.body;
    if (!color || !cardId) {
      res
        .status(404)
        .json({ message: "No Card-ID or Color given", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found", success: false });
      return;
    }
    const label = await CardLabelModel.create({
      name,
      color,
      card: cardId,
    });
    card.labels.push(label._id);
    await card.save();
    res.status(201).json({
      message: "Label added successfully",
      success: true,
      label,
    });
  } catch (error) {}
};
export const addComment = async (req: Request, res: Response) => {
  try {
    const { comment, cardId } = req.body;
    const userId = req.user._id;
    if (!comment || !cardId) {
      res
        .status(409)
        .json({ message: "No Comment or Card-ID given", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found", success: false });
      return;
    }
    const newComment = await commentsModel.create({
      comment,
      author: userId,
    });
    card.comments.push(newComment._id);
    await card.save();
    res.status(201).json({
      message: `New comment ${comment} has been made`,
      success: true,
      card,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const addAttachment = async (req: Request, res: Response) => {
  try {
    const { cardId, name, resourceType } = req.body;
    const userId = req.user._id;
    if (!cardId) {
      res.status(404).json({ message: "No Card Found", success: false });
      return;
    }
    if (!resourceType) {
      res
        .status(404)
        .json({ message: "No resourceTyped Found", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res
        .status(404)
        .json({ message: "Invalid ID, No Card Found", success: false });
      return;
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files.uploadedFile) {
      res.status(400).json({ message: "No file uploaded", success: false });
      return;
    }
    const filePath = files.uploadedFile[0].path;
    let filename = name ? name : files.uploadedFile[0].originalname;
    const existingAttachments = await CardAttachmentModel.find({
      cardId: card._id,
    });
    const duplicateAttachments = existingAttachments
      .filter((attachment) => attachment.filename?.startsWith(filename))
      .map((attachment) => attachment.filename);
    if (duplicateAttachments.length > 0) {
      let counter = 1;
      let newFilename = filename;
      while (duplicateAttachments.includes(newFilename)) {
        newFilename = `${filename} (${counter})`;
        counter++;
      }
      filename = newFilename;
    }
    const cloudinaryResponse = await UploadOnCloudinary({
      localFilePath: filePath,
      folderName: "taskflow/card-attachments",
    });
    if (!cloudinaryResponse) {
      res
        .status(404)
        .json({ message: "Error in uploading to cloudinary", success: false });
      return;
    }
    const attachment = await CardAttachmentModel.create({
      filename,
      cardId: card._id,
      fileUrl: cloudinaryResponse.url,
      uploadedBy: userId,
    });
    card.attachments.push(attachment._id);
    await card.save();
    res.status(201).json({
      message: `${filename} is uploaded`,
      success: true,
      card,
      attachment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const addChecklist = async (req: Request, res: Response) => {
  try {
    const { title, cardId } = req.body;
    const userId = req.user._id;
    if (!title || !cardId) {
      res
        .status(404)
        .json({ message: "Card ID or title missing", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(401).json({ message: "Invalid card ID", success: false });
      return;
    }
    const checkList = await CheckListModel.create({
      title,
      createdBy: userId,
      card: card._id,
    });
    card.checklist.push(checkList._id);
    await card.save();
    res.status(200).json({
      message: `Checklist (${checkList.title}) added to ${card.name}`,
      card,
      checkList,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const addItemToCheckList = async (req: Request, res: Response) => {
  try {
    const { title, assignedTo, dueDate } = req.body;
    const { checkListId } = req.params;
    const userId = req.user._id;

    if (!title || !checkListId) {
      res
        .status(404)
        .json({ message: "Checklist ID or title missing", success: false });
      return;
    }

    const checkList = await CheckListModel.findById(checkListId);
    if (!checkList) {
      res.status(401).json({ message: "Invalid checklist ID", success: false });
      return;
    }

    let validAssignedTo: Types.ObjectId[] = [];
    if (assignedTo && assignedTo.length > 0) {
      const objectIdAssignedTo = assignedTo.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      const assignedUsers = await UserModel.find({
        $or: [
          { _id: { $in: objectIdAssignedTo } },
          { email: { $in: assignedTo } },
          { username: { $in: assignedTo } },
        ],
      });

      if (assignedUsers.length !== assignedTo.length) {
        res.status(404).json({
          message: "One or more assigned users not found",
          success: false,
        });
        return;
      }

      validAssignedTo = assignedUsers.map((user) => user._id);
    }

    const newItem: INewItem = {
      title,
      completed: false,
      assignedTo: validAssignedTo,
      createdBy: userId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    checkList?.items.push(newItem);
    await checkList.save();
    res.status(201).json({
      message: `${newItem.title} is added to ${checkList.title}`,
      checkList,
      success: true,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const toggleCheckListItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { checklistId, itemId } = req.params;
    const checkList = await CheckListModel.findById(checklistId);
    if (!checkList) {
      res.status(404).json({ message: "Checklist not found", success: false });
      return;
    }

    const item = checkList.items.find(
      (item) => item._id?.toString() === itemId
    );
    if (!item) {
      res
        .status(404)
        .json({ message: "Checklist item not found", success: false });
      return;
    }

    item.completed = !item.completed;
    await checkList.save();

    res.status(200).json({
      message: `Item "${item.title}" is now ${
        item.completed ? "completed" : "incomplete"
      }.`,
      checklist: checkList,
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ message: error.message, success: false });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
};
export const editItem = async (req: Request, res: Response) => {
  try {
    const { checklistId, itemId } = req.params;
    const { title, assignedTo, removeAssignedTo, dueDate } = req.body;
    if (!checklistId || !itemId) {
      res.status(407).json({
        message: "Checklist ID or Item ID missing in params",
        success: false,
      });
      return;
    }
    const checkList = await CheckListModel.findById(checklistId);
    if (!checkList) {
      res.status(401).json({ message: "Invalid checklist ID", success: false });
      return;
    }
    const item = checkList.items.find(
      (item) => item._id?.toString() === itemId
    );
    if (!item) {
      res.status(401).json({ message: "Invalid item ID", success: false });
      return;
    }
    if (!title && !dueDate && !assignedTo) {
      res.status(200).json({
        message: `No detaileds provided to update.`,
        checklist: checkList,
        success: true,
      });
      return;
    }
    if (title) {
      item.title = title;
    }
    if (dueDate) {
      item.dueDate = dueDate;
    }
    /*
    1) Get all the already assigned users to this item in an array.
    2) Check if there is assignedTo?
    3) Separate array for quering object id in db 
    4) find all the users by ID or email or username
    5) create an addIds list store all the ids found
    6) merge them by new Set
    7) splice them
    */
    const currentAssignedUsers = item.assignedTo.map((id: Types.ObjectId) =>
      id.toString()
    );
    if (assignedTo && assignedTo.length > 0) {
      const objectIdAssignedTo = assignedTo.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      const usersToAdd = await UserModel.find({
        $or: [
          { _id: { $in: objectIdAssignedTo } },
          { email: { $in: assignedTo } },
          { username: { $in: assignedTo } },
        ],
      });
      if (usersToAdd.length !== assignedTo.length) {
        res.status(404).json({
          message: "One or more assigned users not found",
          success: false,
        });
        return;
      }
      const addIds = usersToAdd.map((user) => user._id.toString());
      const mergedIdsSet = new Set([...currentAssignedUsers, ...addIds]);
      currentAssignedUsers.splice(
        0,
        currentAssignedUsers.length,
        ...mergedIdsSet
      );
    }
    if (
      removeAssignedTo &&
      Array.isArray(removeAssignedTo) &&
      removeAssignedTo.length > 0
    ) {
      const ObjectIdtoRemove = removeAssignedTo.filter((id: string) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      const usersToRemove = await UserModel.find({
        $or: [
          { _id: { $in: ObjectIdtoRemove } },
          { email: { $in: removeAssignedTo } },
          { username: { $in: removeAssignedTo } },
        ],
      });
      if (usersToRemove.length !== removeAssignedTo.length) {
        res.status(404).json({
          message: "One or more assigned users not found",
          success: false,
        });
        return;
      }
      const removeIds = usersToRemove.map((user) => user._id.toString());
      const filteredIds = currentAssignedUsers.filter(
        (id: string) => !removeIds.includes(id)
      );
      currentAssignedUsers.splice(
        0,
        currentAssignedUsers.length,
        ...filteredIds
      );
    }
    item.assignedTo = currentAssignedUsers;
    await checkList.save();
    res.status(200).json({
      message: `Checklist item updated successfully.`,
      checklist: checkList,
      success: true,
    });
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
