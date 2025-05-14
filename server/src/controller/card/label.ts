import { Request, Response } from "express";
import { CardModel } from "../../models/card.model";
import { CardLabelModel } from "../../models/card.label.model";
import ApiResponse from "../../utils/ApiResponse";
import { checkRequiredBody, checkRequiredParams } from "../../utils/helpers";
import mongoose from "mongoose";
import { redisClient } from "../..";
export const addLabel = async (req: Request, res: Response) => {
  try {
    const { name, color, cardId } = req.body;

    if (!color || !cardId) {
      res.status(400).json({
        message: "No Card-ID or Color given",
        success: false,
      });
      return;
    }
    const cardExists = await CardModel.exists({ _id: cardId });
    if (!cardExists) {
      res.status(404).json({ message: "Card not found", success: false });
      return;
    }
    const label = await CardLabelModel.create({
      name: name || "",
      color,
      card: cardId,
    });
    await CardModel.findByIdAndUpdate(cardId, {
      $push: { labels: label._id },
    });
    await redisClient.del(`tableData:${req.user._id}`);
    await redisClient.del(`singleCard:${cardId}`);
    res.status(201).json({
      message: "Label added successfully",
      success: true,
      label,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
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
    await redisClient.del(`tableData:${req.user._id}`);
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Label deleted successfully"));
  } catch (error) {
    console.error("Error in deleteLabel:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};
