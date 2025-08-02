import { Types } from "mongoose";
import { workSpaceModel } from "../models/workspace.model";
import { ROLES } from "./Roles";

export const getWorkspacePermissions = async (
  userId: Types.ObjectId,
  workspaceId: string
): Promise<string[]> => {
  const workspace = await workSpaceModel.findById(workspaceId);
  if (!workspace) return [];
  if (workspace.createdBy.equals(userId)) {
    return ROLES.WORKSPACE_ADMIN.permissions;
  }
  if (workspace.admin.includes(userId)) {
    return ROLES.WORKSPACE_ADMIN.permissions;
  }
  const member = workspace.members.find((m) => m.user.equals(userId));
  if (member) {
    if (member.role === "admin") {
      return ROLES.WORKSPACE_ADMIN.permissions;
    } else {
      return ROLES.WORKSPACE_MEMBER.permissions;
    }
  }
  return [];
};
export const getBoardPermissions = async (
  userId: Types.ObjectId,
  boardId: string
): Promise<string[]> => {
  const board = await workSpaceModel.findById(boardId);
  if (!board) return [];
  if (board.createdBy.equals(userId)) return ROLES.BOARD_ADMIN.permissions;
  if (board.admin.includes(userId)) return ROLES.BOARD_ADMIN.permissions;

  const member = board.members.find((m) => m.user.equals(userId));
  if (member) {
    if (member.role === "admin") {
      return ROLES.BOARD_ADMIN.permissions;
    } else {
      return ROLES.BOARD_MEMBER.permissions;
    }
  }

  return [];
};
