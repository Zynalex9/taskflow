import { Request, Response } from "express";
import { workSpaceModel } from "../models/workspace.model";
import { UserModel } from "../models/user.model";
import { boardModel } from "../models/board.models";

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
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
