import { Types } from "mongoose";
import { workSpaceModel } from "../models/workspace.model";
import { ROLES } from "./Roles";
import { boardModel } from "../models/board.models";
import { ListModel } from "../models/list.models";
import { CardModel } from "../models/card.model";

export const getWorkspacePermissions = async (
  userId: Types.ObjectId,
  workspaceId: string
): Promise<string[]> => {
  const workspace = await workSpaceModel.findById(workspaceId);
  if (!workspace) return [];
  if (workspace.createdBy.equals(userId)) {
    return ROLES.WORKSPACE_OWNER.permissions;
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
export const getListPermissions = async (
  userId: Types.ObjectId,
  listId: string
): Promise<string[]> => {
  const list = await ListModel.findById(listId);
  if (!list) return [];

  if (list.createdBy.equals(userId)) return ROLES.LIST_CREATOR.permissions;
  const boardPermissions = await getBoardPermissions(
    userId,
    list.board.toString()
  );
  return boardPermissions.filter(
    (p) => p.startsWith("list:") || p.startsWith("card:")
  );
};
export const getCardPermissions = async (
  userId: Types.ObjectId,
  cardId: string
): Promise<string[]> => {
  const card = await CardModel.findById(cardId);
  if (!card) return [];

  if (card.createdBy.equals(userId)) {
    return ROLES.CARD_CREATOR.permissions;
  }
  if(card.members.includes(userId)){
    return ROLES.CARD_MEMBER.permissions
  }

  const listPermissions = await getListPermissions(
    userId,
    card.list.toString()
  );

  return listPermissions.filter((p) => p.startsWith("card:"));
};

export const getUserPermissions = async (
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
  if (resourceType === "list") {
    const listPermissions = await getListPermissions(userId, resourceId);
    listPermissions.forEach((p) => permissions.add(p));
  }
  if (resourceType === "card") {
    const cardPermissions = await getCardPermissions(userId, resourceId);
    cardPermissions.forEach((p) => permissions.add(p));
  }
  return Array.from(permissions);
};
export const hasPermission = async (
  userId: Types.ObjectId,
  permission: string,
  resourceType: "workspace" | "board" | "list" | "card",
  resourceId: string
): Promise<boolean> => {
  try {
    const userPermissions = await getUserPermissions(
      userId,
      resourceType,
      resourceId
    );
    return userPermissions.includes(permission);
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
};
export const authorize = async (
  userId: Types.ObjectId,
  action: string,
  resourceType: "workspace" | "board" | "list" | "card",
  resourceId: string
): Promise<{ authorized: boolean; reason?: string }> => {
  const userHasPermission = await hasPermission(
    userId,
    action,
    resourceType,
    resourceId
  );

  if (!userHasPermission) {
    return {
      authorized: false,
      reason: `You don't have permission to ${action} on this ${resourceType}`,
    };
  }

  return { authorized: true };
};
