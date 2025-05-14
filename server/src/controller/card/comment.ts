import { Request, Response } from "express";
import { CardModel } from "../../models/card.model";
import { commentsModel } from "../../models/card.comments.models";
import ApiResponse from "../../utils/ApiResponse";
import { checkRequiredParams } from "../../utils/helpers";
import mongoose from "mongoose";
import { redisClient } from "../..";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { comment, cardId } = req.body;
    const userId = req.user._id;
    if (!comment || !cardId) {
      res
        .status(409)
        .json({ message: "No Comment or Card-ID given", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found", success: false });
      return;
    }
    const newComment = await commentsModel.create({
      comment,
      author: userId,
    });
    card.comments.push(newComment._id);
    await card.save();
    await redisClient.del(`singleCard:${cardId}`);

    res.status(201).json({
      message: `New comment ${comment} has been made`,
      success: true,
      card,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const required = ["commentId"];
    if (!checkRequiredParams(req, res, required)) return;

    const { commentId } = req.params;
    const {cardId} = req.body
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid comment ID"));
      return;
    }

    const deletedComment = await commentsModel.findByIdAndDelete(commentId);
    if (!deletedComment) {
      res.status(404).json(new ApiResponse(404, {}, "Comment not found"));
      return;
    }
    await redisClient.del(`singleCard:${cardId}`);
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};
