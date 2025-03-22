import { Request, Response } from "express";
import { CardModel, ICard } from "../models/card.model";
import { Types } from "mongoose";
import { CardLabelModel } from "../models/card.label.model";

export const joinCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.body;
    const userId = req.user._id;
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card does not found", success: false });
      return;
    }
    if (card.members.includes(userId)) {
      res
        .status(409)
        .json({ message: "You're already member", success: false });
      return;
    }

    card.members.push(userId);
    await card.save();
    res.status(200).json({
      message: "User added to the card successfully",
      success: true,
      card,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const leaveCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.body;
    const userId = req.user._id;
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card does not found", success: false });
      return;
    }
    if (!card.members.includes(userId)) {
      res.status(409).json({
        message: "User is not a member of this card",
        success: false,
      });
      return;
    }

    card.members.pull(userId);
    await card.save();
    res.status(200).json({
        message: "User removed from the card successfully",
        success: true,
        card,
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
export const addLabel = async (req: Request, res: Response) => {
  try {
    const { name, color, cardId } = req.body;
    if (!color || !cardId) {
      res
        .status(404)
        .json({ message: "No Card-ID or Color given", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found", success: false });
      return;
    }
    const label = await CardLabelModel.create({
      name,
      color,
      card: cardId,
    });
    card.labels.push(label._id);
    await card.save();
    res.status(201).json({
      message: "Label added successfully",
      success: true,
      label,
    });
  } catch (error) {}
};
