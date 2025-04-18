import { Request, Response } from "express";
import { workSpaceModel } from "../../models/workspace.model";
import { UserModel } from "../../models/user.model";
import { boardModel } from "../../models/board.models";
import { ListModel } from "../../models/list.models";
import { CardModel } from "../../models/card.model";
import mongoose from "mongoose";
import { commentsModel } from "../../models/card.comments.models";
import { CardLabelModel } from "../../models/card.label.model";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import { CheckListModel } from "../../models/card.checklist.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { CheckAdmin, checkRequiredBody, notFound } from "../../utils/helpers";
import ApiResponse from "../../utils/ApiResponse";
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
export const addAdmin = asyncHandler(async (req: Request, res: Response) => {
  const required = ["workspaceId,adminId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { workspaceId, adminId } = req.body;
  const userId = req.user._id;
  const isAuthorized = await CheckAdmin(userId, workspaceId);
  if (!isAuthorized) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "You are not authorized to add an admin"));
    return;
  }
  const workspace = await workSpaceModel.findById(workspaceId);
  if (!workspace) {
    notFound(workspace, "workspace", res);
    return;
  }
  const admin = await UserModel.findById(adminId);
  if (!admin) {
    notFound(admin, "admin", res);
    return;
  }
  if (workspace.admin.includes(admin._id)) {
    res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          `${admin.username} is already an admin in this workspace`
        )
      );
    return;
  }
  workspace.admin.push(admin._id);
  await workspace.save();
  res
    .status(200)
    .json(new ApiResponse(200, {}, `${admin.username} now an admin`));
});
export const removeAdmin = asyncHandler(async (req: Request, res: Response) => {
  const required = ["workspaceId,adminId"];
  if (!checkRequiredBody(req, res, required)) return;
  const { workspaceId, adminId } = req.body;
  const userId = req.user._id;
  const isAuthorized = await CheckAdmin(userId, workspaceId);
  if (!isAuthorized) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, "You are not authorized to add an admin"));
    return;
  }
  const workspace = await workSpaceModel.findById(workspaceId);
  if (!workspace) {
    notFound(workspace, "workspace", res);
    return;
  }
  const admin = await UserModel.findById(adminId);
  if (!admin) {
    notFound(admin, "admin", res);
    return;
  }
  if (!workspace.admin.includes(admin._id)) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, `${admin.username} is not an admin`));
    return;
  }
  workspace.admin = workspace.admin.filter(
    (id) => id.toString() !== admin._id.toString()
  );
  await workspace.save();
  res
    .status(200)
    .json(new ApiResponse(200, {}, `${admin.username} is removed from admins`));
  return;
});
