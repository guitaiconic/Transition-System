import mongoose, { Schema, Document, Types } from "mongoose";
import { users } from "./userModel.js";

export interface Itask extends Document {
  clientId: Types.ObjectId;
  translatorId?: Types.ObjectId;
  status: "pending" | "in-progress" | "completed";
  text: string;
  translation?: string;
  amount?: number;
}

export const taskSchema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    translatorId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["Pending", "In-progress", "Completed"],
      default: "Pending",
    },
    text: {
      type: String,
      required: true,
    },
    translation: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const task = mongoose.model<Itask>("task", taskSchema);
