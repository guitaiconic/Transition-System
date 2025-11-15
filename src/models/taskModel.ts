import mongoose, { Schema, Document, Types } from "mongoose";

export interface Itask extends Document {
  clientId: Types.ObjectId | string;
  assignedTo: Types.ObjectId | string;
  translatorId?: Types.ObjectId | string;
  status: "pending" | "in_progress" | "completed";
  text: string;
  translation?: string;
}

export const taskSchema: Schema<Itask> = new Schema<Itask>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "user", required: true },
    translatorId: { type: Schema.Types.ObjectId, ref: "user" },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      required: true,
    },
    text: { type: String, required: true },
    translation: { type: String },
  },
  {
    timestamps: true,
  }
);
export const tasks = mongoose.model<Itask>("task", taskSchema);
