import mongoose, { Schema, Document, Types } from "mongoose";

export interface Ipricing extends Document {
  taskId: Types.ObjectId | string;
  translatorId: Types.ObjectId | string;
  pricing: number;
}

export const pricingSchema: Schema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    translatorId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const pricing = mongoose.model<Ipricing>("pricing", pricingSchema);
