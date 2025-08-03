import { Request, Response } from "express";
import { IWorkspace, workSpaceModel } from "../../models/workspace.model";
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
import {
  CheckAdmin,
  checkRequiredBody,
  getRandomColor,
  lPushList,
  notFound,
} from "../../utils/helpers";
import ApiResponse from "../../utils/ApiResponse";
import { redisClient } from "../..";
import { UploadOnCloudinary } from "../../utils/cloudinary";
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
    let workspaceCover;
    if (req.file) {
      const localFilePath = req.file.path;
      const response = await UploadOnCloudinary({
        localFilePath,
        folderName: "taskflow/workspaceCovers",
      });
      if (response && response.url) {
        workspaceCover = response.url;
      }
    } else {
      workspaceCover = getRandomColor();
    }
    const workSpace = await workSpaceModel.create({
      name,
      admin: workspaceAdmins,
      members: workspaceMembers || [],
      createdBy: userId,
      cover: workspaceCover,
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
    await lPushList(userId, `Created Workspace: ${workSpace.name}`);
    await redisClient.del(`workspace:${workSpace._id}`);
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
    const userId = req.user._id;
    if (!workspaceId) {
      res
        .status(400)
        .json({ message: "Workspace ID is required", success: false });
      return;
    }
    // const cachedData = await redisClient.get(`tableData:${userId}`);
    // if (cachedData) {
    //   const parsed = JSON.parse(cachedData);
    //   res.status(200).json(new ApiResponse(200, parsed, "Data from cache"));
    //   return;
    // }

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
          listName: "$listsDetails.name",
          cardName: "$cardsDetails.name",
          labels: {
            $map: {
              input: "$LabelDetails",
              as: "label",
              in: {
                name: "$$label.name",
                color: "$$label.color",
              },
            },
          },
          members: "$userDetails.username",
          dueDate: {
            $cond: {
              if: "$cardsDetails.endDate",
              then: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: "$cardsDetails.endDate",
                },
              },
              else: null,
            },
          },
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

    await redisClient.set(
      `tableData:${userId}`,
      JSON.stringify(tableData),
      "EX",
      1300
    );
    res.status(200).json(new ApiResponse(200, tableData, "Table found"));
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
          _id: 1,
          name: 1,
          endDate: 1,
          listId: "$listDetails._id", // Include listId
          boardId: "$boardDetails._id", // Include boardId
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
export const allWorkspaces = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id; 
    
    if (!userId) {
       res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
       return
    }

    const cachedKey = `user:${userId}:workspaces`;

    // Uncomment if caching is needed
    // const cachedWorkspaces = await redisClient.get(cachedKey);
    // if (cachedWorkspaces) {
    //   return res.status(200).json(
    //     new ApiResponse(200, JSON.parse(cachedWorkspaces), "Workspaces Found (cache)")
    //   );
    // }

    // 1️⃣ Query all workspaces where user is creator, admin, or member
    const allUserWorkspaces = await workSpaceModel.find({
      $or: [
        { createdBy: userId },
        { admin: userId },
        { "members.user": userId }
      ]
    })
    .populate("boards")
    .lean();

    const ownedWorkspaces = allUserWorkspaces.filter(ws => ws.createdBy.toString() === userId.toString());
    const joinedWorkspaces = allUserWorkspaces.filter(ws => ws.createdBy.toString() !== userId.toString());

    const responseData = { ownedWorkspaces, joinedWorkspaces };
    await redisClient.set(cachedKey, JSON.stringify(responseData), "EX", 3600);

    res.status(200).json(new ApiResponse(200, responseData, "Workspaces Found"));
  }
);

export const getWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.query;

    if (!workspaceId || typeof workspaceId !== "string") {
      res.status(400).json(new ApiResponse(400, {}, "workspaceId is required"));
      return;
    }

    const cachedKey = `workspace:${workspaceId}`;

    const cachedWorkSpace = await redisClient.get(cachedKey);
    if (cachedWorkSpace) {
      const parsedData = JSON.parse(cachedWorkSpace);
      res
        .status(200)
        .json(new ApiResponse(200, parsedData, "Workspace Found (from cache)"));
      return;
    }
    const workspace = await workSpaceModel
      .findById(workspaceId)
      .populate("members")
      .lean();
    if (!workspace) {
      res.status(404).json(new ApiResponse(404, {}, "No workspace found"));
      return;
    }

    await redisClient.set(cachedKey, JSON.stringify(workspace), "EX", 3600);
    res.status(200).json(new ApiResponse(200, workspace, "Workspace Found"));
  }
);

export const deleteWorkSpace = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { workspaceId } = req.body;
    const userId = req.user._id;
    const workspace = await workSpaceModel.findById(workspaceId);
    if (
      !workspace?.admin.includes(userId) &&
      workspace?.createdBy.toString() !== userId.toString()
    ) {
      res
        .status(400)
        .json({ message: "You are not authorized to delete the workspace" });
      return;
    }
    const boards = await boardModel.find({ workspace: workspaceId });
    if (boards.length === 0) {
      await UserModel.updateOne(
        { _id: userId },
        {
          $pull: { workspace: workspaceId },
        }
      );
      await workSpaceModel.findByIdAndDelete(workspaceId);
      res.status(201).json({ message: "Workspace deleted.." });
      return;
    }
    const boardIds = boards.map((b) => b._id);

    const lists = await ListModel.find({ board: { $in: boardIds } });
    if (lists.length === 0) {
      await UserModel.updateOne(
        { _id: userId },
        {
          $pull: { workspace: workspaceId },
        }
      );
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
      await UserModel.updateOne(
        { _id: userId },
        {
          $pull: { workspace: workspaceId },
        }
      );
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
    await UserModel.updateOne(
      { workspace: workspaceId },
      {
        $pull: { workspace: workspaceId },
      }
    );
    await workSpaceModel.findByIdAndDelete(workspaceId);
    await lPushList(userId, `Deleted workspace`);
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

  // Add admin to workspace
  workspace.admin.push(admin._id);
  const memberObj = workspace.members.find((u) => u.user.equals(admin._id));
  if (memberObj) {
    memberObj.role = "admin";
  }

  const boards = await boardModel.find({ workspace: workspaceId });

  await Promise.all(
    boards.map(async (board) => {
      const existing = board.members.find((m) => m.user.equals(admin._id));
      if (existing) {
        existing.role = "admin";
      } else {
        board.members.push({
          user: admin._id,
          role: "admin",
        });
      }
      await board.save();
    })
  );

  await workspace.save();
  redisClient.del(`workspace:${workspaceId}`);
  await lPushList(
    userId,
    `You added ${admin.username} as an admin of ${workspace.name}`
  );

  res
    .status(200)
    .json(new ApiResponse(200, {}, `${admin.username} is now an admin`));
});

export const removeAdmin = asyncHandler(async (req: Request, res: Response) => {
  const required = ["workspaceId", "adminId"];
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
  const boards = await boardModel.find({ workspace: workspaceId });
  boards.forEach(async (board) => {
    board.members.map((member) => {
      if (member.user._id.toString === adminId) {
        member.role = "member";
      }
    });
    await board.save();
  });
  workspace.admin = workspace.admin.filter(
    (id) => id.toString() !== admin._id.toString()
  );
  workspace.members = workspace.members.map((member) => {
    if (member.user._id.toString() === admin._id.toString()) {
      member.role = "member";
    }
    return member;
  });
  await workspace.save();
  await lPushList(
    userId,
    `You removed ${admin.username} as an admin of ${workspace.name}`
  );
  res
    .status(200)
    .json(new ApiResponse(200, {}, `${admin.username} is removed from admins`));
  return;
});
export const addWorkspaceMember = asyncHandler(
  async (req: Request, res: Response) => {
    const required = ["workspaceId", "memberCredentials"];
    if (!checkRequiredBody(req, res, required)) return;
    const { workspaceId, memberCredentials } = req.body;
    const userId = req.user._id;
    const isAuthorized = await CheckAdmin(userId, workspaceId);
    if (!isAuthorized) {
      res
        .status(400)
        .json(
          new ApiResponse(400, {}, "You are not authorized to add a member")
        );
      return;
    }
    const workspace = await workSpaceModel.findById(workspaceId);
    if (!workspace) {
      notFound(workspace, "workspace", res);
      return;
    }
    let member = null;

    if (/^[0-9a-fA-F]{24}$/.test(memberCredentials)) {
      member = await UserModel.findById(memberCredentials);
    }

    if (!member) {
      member = await UserModel.findOne({
        $or: [{ email: memberCredentials }, { username: memberCredentials }],
      });
    }
    if (!member) {
      notFound(member, "member", res);
      return;
    }
    if (
      workspace.members
        .map((m) => m.user._id.toString())
        .includes(member._id.toString())
    ) {
      res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `${member.username} is already a member of this workspace`
          )
        );
      return;
    }
    const newMember: { user: typeof member._id; role: "member" } = {
      user: member._id,
      role: "member",
    };
    workspace.members.push(newMember);
    await workspace.save();
    await UserModel.updateOne(
      { _id: member._id },
      { $addToSet: { workspace: workspace._id } }
    );
    redisClient.del(`workspace:${workspaceId}`);
    await lPushList(
      userId,
      `You added ${member.username} as a member of ${workspace.name}`
    );
    res
      .status(200)
      .json(new ApiResponse(200, {}, `${member.username} is now a member`));
  }
);
export const removeWorkspaceMember = asyncHandler(
  async (req: Request, res: Response) => {
    const required = ["workspaceId", "memberId"];
    if (!checkRequiredBody(req, res, required)) return;
    const { workspaceId, memberId } = req.body;
    const userId = req.user._id;
    const isAuthorized = await CheckAdmin(userId, workspaceId);
    if (!isAuthorized) {
      res
        .status(400)
        .json(
          new ApiResponse(400, {}, "You are not authorized to remove a member")
        );
      return;
    }
    const workspace = await workSpaceModel.findById(workspaceId);
    if (!workspace) {
      notFound(workspace, "workspace", res);
      return;
    }
    const member = await UserModel.findById(memberId);
    if (!member) {
      notFound(member, "member", res);
      return;
    }
    const isMember = workspace.members.some(
      (u) => u.user.toString() === member._id.toString()
    );
    if (!isMember) {
      res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `${member.username} is not a member of this workspace`
          )
        );
      return;
    }
    workspace.members = workspace.members.filter(
      (u) => u.user.toString() !== member._id.toString()
    );
    await workspace.save();
    await UserModel.updateOne(
      { _id: member._id },
      { $pull: { workspace: workspace._id } }
    );
    redisClient.del(`workspace:${workspaceId}`);
    await lPushList(
      userId,
      `You removed ${member.username} from ${workspace.name}`
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, {}, `${member.username} is removed from members`)
      );
    return;
  }
);

export const getWorkspaceMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      res
        .status(400)
        .json(new ApiResponse(400, {}, "Workspace ID is required"));
      return;
    }
    const workspaceWithMembers = await workSpaceModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(workspaceId) } },
      {
        $unwind: "$members",
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user",
          foreignField: "_id",
          as: "memberInfo",
        },
      },
      { $unwind: "$memberInfo" },
      {
        $project: {
          _id: 0,
          userId: "$memberInfo._id",
          username: "$memberInfo.username",
          profilePicture: "$memberInfo.profilePicture",
          email: "$memberInfo.email",
          avatar: "$memberInfo.avatar",
          role: "$members.role",
        },
      },
    ]);

    if (workspaceWithMembers.length === 0) {
      notFound(workspaceWithMembers, "workspace", res);
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(200, workspaceWithMembers, "Members found"));
  }
);
