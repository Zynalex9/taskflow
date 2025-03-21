import mongoose, { Schema, model, Document } from "mongoose";

interface ICardLabel extends Document {
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
const CardLabelSchema: Schema = new Schema(
  {
    name: { type: String},
    color: { type: String, required: true },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  },
  { timestamps: true }
);

export const CardLabelModel = model<ICardLabel>("Label", CardLabelSchema);
