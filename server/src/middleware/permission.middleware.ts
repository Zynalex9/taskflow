import { NextFunction, Request, Response } from "express";
import { authorize } from "../RBAC/getPermissions";
import ApiResponse from "../utils/ApiResponse";
import { Types } from "mongoose";

export interface AuthorizedRequest extends Request {
  user: {
    _id: Types.ObjectId;
    [key: string]: any;
  };
}

export const requirePermission = (
  permission: string,
  resourceType: "workspace" | "board" | "list" | "card",
  resourceIdParam: string = "id",
  errorMessage?: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
        return;
      }
      const userId = req.user._id;
      const resourceId =
        req.params[resourceIdParam] || req.body[resourceIdParam];

      if (!resourceId) {
        res
          .status(400)
          .json(new ApiResponse(400, {}, `${resourceIdParam} is required`));
        return;
      }

      const authResult = await authorize(
        userId,
        permission,
        resourceType,
        resourceId
      );

      if (!authResult.authorized) {
        res
          .status(403)
          .json(
            new ApiResponse(
              403,
              {},
              errorMessage || authResult.reason || "Access denied"
            )
          );
        return;
      }

      next();
    } catch (error) {
      console.error("Authorization middleware error:", error);
      res
        .status(500)
        .json(new ApiResponse(500, {}, "Authorization check failed"));
    }
  };
};
