import { ClientSession, Model, Types } from "mongoose";
import { workSpaceModel } from "../models/workspace.model";

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
