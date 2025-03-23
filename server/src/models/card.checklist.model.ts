import mongoose, { Document, Schema, Types } from "mongoose";
interface IChecklistItem {
  _id?: Types.ObjectId;
  title: string;
  completed: Boolean;
  assignedTo?: Types.ObjectId[] | any;
  createdBy: Types.ObjectId;
  
}
export interface IChecklist extends Document {
  title: string;
  items: IChecklistItem[];
  createdBy: Types.ObjectId;
  card: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const CheckListSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        assignedTo: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  },
  { timestamps: true }
);
export const CheckListModel = mongoose.model<IChecklist>(
  "Checklist",
  CheckListSchema
);
