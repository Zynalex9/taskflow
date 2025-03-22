import { Request, Response } from "express";
import { CardModel,ICard } from "../models/card.model";
import { Types } from "mongoose";
export interface AuthenticatedRequest extends Request {
  user: {
    _id: Types.ObjectId;
  };
}
export const joinCard = async (req: AuthenticatedRequest, res: Response) => {
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
    return;
  }
};
export const leaveCard = async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
    return;
  }
};
