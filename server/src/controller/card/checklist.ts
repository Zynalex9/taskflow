import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { UserModel } from "../../models/user.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { CardModel } from "../../models/card.model";
import ApiResponse from "../../utils/ApiResponse";
import { checkRequiredBody, notFound } from "../../utils/helpers";
import { redisClient } from "../..";
import { asyncHandler } from "../../utils/asyncHandler";

interface INewItem {
  title: string;
  completed: boolean;
  assignedTo?: Types.ObjectId[] | any;
  createdBy: Types.ObjectId;
  dueDate: Date | undefined;
}
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
    await redisClient.del(`singleCard:${cardId}`);

    res.status(200).json({
      message: `Checklist (${checkList.title}) added to ${card.name}`,
      newChecklist: checkList,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const addItemToCheckList = async (req: Request, res: Response) => {
  try {
    const { title, assignedTo, dueDate, checkListId } = req.body;
    const userId = req.user._id;
    console.log(req.body);
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
    await redisClient.del(`singleCard:${req.body.cardId}`);

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
    await redisClient.del(`singleCard:${req.body.cardId}`);

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
    await redisClient.del(`singleCard:${req.body.cardId}`);

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
export const deleteCheckList = async (req: Request, res: Response) => {
  try {
    const required = ["checkListId"];
    if (!checkRequiredBody(req, res, required)) return;

    const { checkListId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(checkListId)) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid checklist ID"));
      return;
    }

    const result = await CheckListModel.findByIdAndDelete(checkListId);
    if (!result) {
      res.status(404).json(new ApiResponse(404, {}, "No Checklist found"));
      return;
    }
    await redisClient.del(`singleCard:${req.body.cardId}`);

    res.status(200).json(new ApiResponse(200, {}, "Checklist deleted"));
  } catch (error) {
    console.error("Error in deleteCheckList:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};
export const deleteItem = asyncHandler(async (req, res) => {
  try {
    const required = ["checkListId", "itemId"];
    if (!checkRequiredBody(req, res, required)) return;
    const { checkListId, itemId } = req.body;
    const checkList = await CheckListModel.findById(checkListId);
    if (!checkList) {
      notFound(checkList, "Checklist", res);
      return;
    }
    const item = checkList.items.find((item) => item._id?.toString() === itemId);
    if (!item) {
      notFound(item, "Item", res);
      return;
    }
    checkList.items = checkList.items.filter((i) => i._id?.toString() !== item._id?.toString());
    await checkList.save();
    await redisClient.del(`singleCard:${req.body.cardId}`);
    res.status(200).json(new ApiResponse(200, {}, "Item deleted"));
  } catch (error) {
    console.error("Error in deleteItem:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
});
