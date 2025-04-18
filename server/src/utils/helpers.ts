import { ClientSession, Model, Types } from "mongoose";
import { workSpaceModel } from "../models/workspace.model";
import { Request, Response } from "express";
import ApiResponse from "./ApiResponse";
import { UserModel } from "../models/user.model";

export const findData = <T>(param: T[], key: keyof T) => {
  const data = param.flatMap((item) => item[key]);
  return data;
};

export const deleteIfExists = async <T>(
  model: Model<T>,
  ids: string[] | Types.ObjectId[],
  session: ClientSession
): Promise<void> => {
  if (ids.length > 0) {
    await model.deleteMany({ _id: { $in: ids } }).session(session);
  }
};

export const CheckAdmin = async (
  userId: Types.ObjectId,
  workspaceId: string | Types.ObjectId
): Promise<Boolean> => {
  const workspace = await workSpaceModel.findById(workspaceId);
  if (!workspace) return false;
  if (!workspace.admin.includes(userId)) return false;
  return true;
};

export const checkRequiredParams = (
  req: Request,
  res: Response,
  requiredParams: string[]
): boolean => {
  for (const param of requiredParams) {
    if (!req.params[param]) {
      res.status(400).json({
        message: `Missing required parameter: ${param}`,
      });
      return false;
    }
  }
  return true;
};

export const checkRequiredBody = (
  req: Request,
  res: Response,
  requiredBody: string[]
): Boolean => {
  for (const body of requiredBody) {
    if (!req.body[body]) {
      res.status(400).json({
        message: `Missing required parameter: ${body}`,
      });
      return false;
    }
  }
  return true;
};

export const checkRequiredQuery = (
  req: Request,
  res: Response,
  requiredQuery: string[]
): Boolean => {
  for (const query of requiredQuery) {
    if (!req.query[query]) {
      res.status(400).json({
        message: `Missing required parameter: ${query}`,
      });
      return false;
    }
  }
  return true;
};

export const notFound = <T>(item: T, name: string, res: Response): Boolean => {
  if (!item) {
    res.status(404).json(new ApiResponse(404, {}, `${name} not found`));
    return true;
  }
  return false;
};
export const fetchUsersByIdentifiers = async (identifiers: string[]) => {
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
