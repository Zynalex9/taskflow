import { Request, Response } from "express";
import { workSpaceModel } from "../models/workspace.model";
import { UserModel } from "../models/user.model";
import { boardModel } from "../models/board.models";
import { ListModel } from "../models/list.models";
import { CardModel } from "../models/card.model";
import mongoose from "mongoose";

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
    const { name, listId } = req.body;
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
    // const list = await ListModel.findById(listId).populate({
    //   path: "board",
    //   populate: {
    //     path: "workspace",
    //     select: "admin",
    //   },
    // });
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
    console.log(list[0]);
    const adminsId = list[0].targetedWorkSpace.admin.map((id:any) => id.toString());
  
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
      name:uniqueName,
      createdBy: userId,
      list: listId,
    });
    await ListModel.findOneAndUpdate({ _id: listId }, {
      $push: { cards: newCard._id },
    });
    res.status(201).json({
      message: "Card created successfully",
      success: true,
      newCard,
    });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};
