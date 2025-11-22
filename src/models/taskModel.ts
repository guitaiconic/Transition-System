import mongoose, { Schema, Document, Types } from "mongoose";
import { users } from "./userModel.js";

export interface Itask extends Document {
  clientId: Types.ObjectId | string;
  assignTo: Types.ObjectId | string;
  translationId: Types.ObjectId | string;
  status: "pending" | "In-progress" | "Completed";
  text: string;
  translator?: string;
}
export const taskSchema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: users,
      required: true,
    },
    assignTo: {
      type: Schema.Types.ObjectId,
      ref: users,
      required: true,
    },
    translatorId: {
      type: Schema.Types.ObjectId,
      ref: users,
    },
    status: {
      type: String,
      enum: ["Pending", "In-progress", "Completed"],
      default: "Pending",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    translator: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const task = mongoose.model<Itask>("task", taskSchema);
