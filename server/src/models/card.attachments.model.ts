import { Schema, model, Document, Types } from "mongoose";

 interface ICardAttachment extends Document {
  cardId: Types.ObjectId;
  filename?: string;
  fileUrl: string;
  uploadedBy: Types.ObjectId;
}

const CardAttachmentSchema = new Schema<ICardAttachment>(
  {
    cardId: { type: Schema.Types.ObjectId, ref: "Card", },
    filename: String,
    fileUrl: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CardAttachmentModel = model<ICardAttachment>(
  "CardAttachment",
  CardAttachmentSchema
);

export { CardAttachmentModel, ICardAttachment };
