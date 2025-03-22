import { Request, Response } from "express";
import { CardModel } from "../models/card.model";
import { CardLabelModel } from "../models/card.label.model";
import { commentsModel } from "../models/card.comments.models";
import { UploadOnCloudinary } from "../utils/cloudinary";
import { CardAttachmentModel } from "../models/card.attachments.model";
import { CheckListModel } from "../models/card.checklist.model";

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
      res.status(401).json({
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
export const addAttachment = async (req: Request, res: Response) => {
  try {
    const { cardId, name, resourceType } = req.body;
    const userId = req.user._id;
    if (!cardId) {
      res.status(404).json({ message: "No Card Found", success: false });
      return;
    }
    if (!resourceType) {
      res
        .status(404)
        .json({ message: "No resourceTyped Found", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res
        .status(404)
        .json({ message: "Invalid ID, No Card Found", success: false });
      return;
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files.uploadedFile) {
      res.status(400).json({ message: "No file uploaded", success: false });
      return;
    }
    const filePath = files.uploadedFile[0].path;
    let filename = name ? name : files.uploadedFile[0].originalname;
    const existingAttachments = await CardAttachmentModel.find({
      cardId: card._id,
    });
    const duplicateAttachments = existingAttachments
      .filter((attachment) => attachment.filename?.startsWith(filename))
      .map((attachment) => attachment.filename);
    if (duplicateAttachments.length > 0) {
      let counter = 1;
      let newFilename = filename;
      while (duplicateAttachments.includes(newFilename)) {
        newFilename = `${filename} (${counter})`;
        counter++;
      }
      filename = newFilename;
    }
    const cloudinaryResponse = await UploadOnCloudinary({
      localFilePath: filePath,
      folderName: "taskflow/card-attachments",
    });
    if (!cloudinaryResponse) {
      res
        .status(404)
        .json({ message: "Error in uploading to cloudinary", success: false });
      return;
    }
    const attachment = await CardAttachmentModel.create({
      filename,
      cardId: card._id,
      fileUrl: cloudinaryResponse.url,
      uploadedBy: userId,
    });
    card.attachments.push(attachment._id);
    await card.save();
    res.status(201).json({
      message: `${filename} is uploaded`,
      success: true,
      card,
      attachment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const addChecklist = async (req: Request, res: Response) => {
  try {
    const { title, cardId } = req.body;
    const userId = req.user._id;
    if (!title || !cardId) {
      res
        .status(404)
        .json({ message: "Card ID or title missing", success: false });
      return;
    }
    const card = await CardModel.findById(cardId);
    if (!card) {
      res.status(401).json({ message: "Invalid card ID", success: false });
      return;
    }
    const checkList = await CheckListModel.create({
      title,
      createdBy: userId,
      card: card._id,
    });
    card.checklist.push(checkList._id);
    await card.save();
    res
      .status(200)
      .json({
        message: `Checklist (${checkList.title}) added to ${card.name}`,
        card,
        checkList,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};