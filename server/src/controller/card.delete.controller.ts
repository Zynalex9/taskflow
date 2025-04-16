import mongoose from "mongoose";
import { Request, Response } from "express";
import { CardModel } from "../models/card.model";
import { commentsModel } from "../models/card.comments.models";
import { CardLabelModel } from "../models/card.label.model";
import { CardAttachmentModel } from "../models/card.attachments.model";
import { CheckListModel } from "../models/card.checklist.model";
import {
  CheckAdmin,
  checkRequiredBody,
  checkRequiredParams,
  deleteIfExists,
  findData,
} from "../utils/helpers";
import ApiResponse from "../utils/ApiResponse";

export const deleteCard = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { workspaceId, cardId } = req.params;
    const userId = req.user._id;

    if (!workspaceId || !cardId) {
      res.status(400).json(new ApiResponse(400, {}, "Both workspace and card Id are required"));
      return;
    }

    const card = await CardModel.findById(cardId).session(session);
    if (!card) {
      res.status(404).json(new ApiResponse(404, {}, "Card not found"));
      return;
    }

    const isAuthorized = await CheckAdmin(userId, workspaceId);
    if (!isAuthorized) {
      res.status(403).json(new ApiResponse(403, {}, "You're not authorized to delete a card in this workspace"));
      return;
    }

    const allCommentsIds = findData([card], "comments");
    const allLabelsIds = findData([card], "labels");
    const allAttachmentsId = findData([card], "attachments");
    const allChecklistIDs = findData([card], "checklist");

    await deleteIfExists(commentsModel, allCommentsIds, session);
    await deleteIfExists(CardLabelModel, allLabelsIds, session);
    await deleteIfExists(CardAttachmentModel, allAttachmentsId, session);
    await deleteIfExists(CheckListModel, allChecklistIDs, session);

    await CardModel.findByIdAndDelete(cardId).session(session);

    await session.commitTransaction();
    res.status(200).json(new ApiResponse(200, {}, "Card deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  } finally {
    session.endSession();
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const required = ["commentId"];
    if (!checkRequiredParams(req, res, required)) return;

    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid comment ID"));
      return;
    }

    const deletedComment = await commentsModel.findByIdAndDelete(commentId);
    if (!deletedComment) {
      res.status(404).json(new ApiResponse(404, {}, "Comment not found"));
      return;
    }

    res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const deleteLabel = async (req: Request, res: Response) => {
  try {
    const required = ["labelId"];
    if (!checkRequiredBody(req, res, required)) return;

    const { labelId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(labelId)) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid label ID"));
      return;
    }

    const deletedLabel = await CardLabelModel.findByIdAndDelete(labelId);
    if (!deletedLabel) {
      res.status(404).json(new ApiResponse(404, {}, "Label not found"));
      return;
    }

    res.status(200).json(new ApiResponse(200, {}, "Label deleted successfully"));
  } catch (error) {
    console.error("Error in deleteLabel:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const required = ["attachmentIDs"];
    if (!checkRequiredBody(req, res, required)) return;

    const { attachmentIds } = req.body;
    if (!Array.isArray(attachmentIds) || attachmentIds.length === 0) {
      res.status(400).json(new ApiResponse(400, {}, "attachmentIds must be a non-empty array"));
      return;
    }

    const invalidIds = attachmentIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid Attachment(s) ID(s)"));
      return;
    }

    const result = await CardAttachmentModel.deleteMany({
      _id: { $in: attachmentIds },
    });

    if (result.deletedCount === 0) {
      res.status(404).json(new ApiResponse(404, {}, "Attachment(s) not found"));
      return;
    }

    res.status(200).json(new ApiResponse(200, {}, `${result.deletedCount} attachment(s) deleted successfully`));
  } catch (error) {
    console.error("Error in deleteAttachment:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const deleteCheckList = async (req: Request, res: Response) => {
  try {
    const required = ["checkListId"];
    if (!checkRequiredBody(req, res, required)) return;

    const { checkListId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(checkListId)) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid checklist ID"));
      return;
    }

    const result = await CheckListModel.findByIdAndDelete(checkListId);
    if (!result) {
      res.status(404).json(new ApiResponse(404, {}, "No Checklist found"));
      return;
    }

    res.status(200).json(new ApiResponse(200, {}, "Checklist deleted"));
  } catch (error) {
    console.error("Error in deleteCheckList:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};
