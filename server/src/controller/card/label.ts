import { Request, Response } from "express";
import { CardModel } from "../../models/card.model";
import { CardLabelModel } from "../../models/card.label.model";
import ApiResponse from "../../utils/ApiResponse";
import { checkRequiredBody } from "../../utils/helpers";
import mongoose from "mongoose";
import { redisClient } from "../..";
import { getIO } from "../../socket";
export const addLabel = async (req: Request, res: Response) => {
  try {
    const { cardId, labels, workspaceId } = req.body;

    if (!cardId || !Array.isArray(labels) || labels.length === 0) {
      res.status(400).json({
        message: "Card ID and labels are required",
        success: false,
      });
      return;
    }

    const cardExists = await CardModel.exists({ _id: cardId });
    if (!cardExists) {
      res.status(404).json({
        message: "Card not found",
        success: false,
      });
      return;
    }

    const labelDocs = await Promise.all(
      labels.map((label: { name: string; color: string }) =>
        CardLabelModel.create({
          name: label.name || "",
          color: label.color,
          card: cardId,
        })
      )
    );

    await CardModel.findByIdAndUpdate(cardId, {
      $addToSet: { labels: { $each: labelDocs.map((l) => l._id) } },
    });

    await redisClient.del(`tableData:${req.user._id}`);
    await redisClient.del(`singleCard:${cardId}`);
    const io = getIO();
    io.to(workspaceId).emit("labelAdded", labelDocs);
    res.status(201).json({
      message: "Labels added successfully",
      success: true,
      labels: labelDocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};

export const deleteLabel = async (req: Request, res: Response) => {
  try {
    const required = ["labelColor", "cardId", "workspaceId"];
    if (!checkRequiredBody(req, res, required)) return;

    const { labelColor, cardId, workspaceId } = req.body;

    const deletedLabel = await CardLabelModel.findOneAndDelete({
      color: labelColor,
      card: cardId,
    });
    if (!deletedLabel) {
      res.status(404).json(new ApiResponse(404, {}, "Label not found"));
      return;
    }
    await redisClient.del(`tableData:${req.user._id}`);
    const io = getIO();
    io.to(workspaceId).emit("labelRemoved", deletedLabel);
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Label deleted successfully"));
  } catch (error) {
    console.error("Error in deleteLabel:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};
