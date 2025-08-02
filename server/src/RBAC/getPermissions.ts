import { Types } from "mongoose";
import { workSpaceModel } from "../models/workspace.model";
import { ROLES } from "./Roles";
import { boardModel } from "../models/board.models";

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
  const board = await boardModel.findById(boardId);
  if (!board) return [];
  if (board.createdBy.equals(userId)) return ROLES.BOARD_ADMIN.permissions;

  const member = board.members.find((m) => m.user.equals(userId));
  if (member) {
    if (member.role === "admin") {
      return ROLES.BOARD_ADMIN.permissions;
    } else {
      return ROLES.BOARD_MEMBER.permissions;
    }
  }
  if (board.visibility === "private") {
    return [];
  } else if (board.visibility === "workspace") {
    const workspace = await workSpaceModel.findById(board.workspace);
    if (workspace) {
      const member = workspace.members.find((m) => m.user.equals(userId));
      if (member) {
        if (member.role === "admin") {
          return ROLES.BOARD_ADMIN.permissions;
        } else {
          return ROLES.BOARD_MEMBER.permissions;
        }
      }
    }
  }
  return [];
};

export const getPermission = async (
  userId: Types.ObjectId,
  resourceType: "workspace" | "board" | "list" | "card",
  resourceId: string
): Promise<string[]> => {
  const permissions = new Set<string>();
  if (resourceType === "workspace") {
    const workspacePermissions = await getWorkspacePermissions(
      userId,
      resourceId
    );
    workspacePermissions.forEach((p) => permissions.add(p));
  }
  if (resourceType === "board") {
    const boardPermissions = await getBoardPermissions(userId, resourceId);
    boardPermissions.forEach((p) => permissions.add(p));
    const board = await boardModel.findById(resourceId);
    if (board?.workspace) {
      const workspacePermissions = await getWorkspacePermissions(
        userId,
        board?.workspace.toString()
      );
      workspacePermissions.forEach((p) => permissions.add(p));
    }
  }
  return Array.from(permissions);
};
