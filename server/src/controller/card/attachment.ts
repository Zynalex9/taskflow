import { Request, Response } from "express";
import mongoose from "mongoose";
import { CardAttachmentModel } from "../../models/card.attachments.model";
import ApiResponse from "../../utils/ApiResponse";
import { cardActivityUpdate, checkRequiredBody } from "../../utils/helpers";
import { UploadOnCloudinary } from "../../utils/cloudinary";
import { CardModel } from "../../models/card.model";

export const addAttachment = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { cardId, name } = req.body;
    const userId = req.user._id;
    if (!cardId) {
      res.status(404).json({ message: "No Card Found", success: false });
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
    cardActivityUpdate(
      cardId,
      `(${req.user.username}) added a new attachment (${attachment.filename})`
    );
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
export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const required = ["attachmentId"];
    if (!checkRequiredBody(req, res, required)) return;

    const { attachmentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
      res.status(400).json(new ApiResponse(400, {}, "Invalid attachment ID"));
      return;
    }

    const result = await CardAttachmentModel.deleteOne({ _id: attachmentId });

    if (result.deletedCount === 0) {
      res.status(404).json(new ApiResponse(404, {}, "Attachment not found"));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Attachment deleted successfully"));
  } catch (error) {
    console.error("Error in deleteAttachment:", error);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};
