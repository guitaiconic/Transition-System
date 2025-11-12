import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const userSchema: Schema = new Schema<Iuser>(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
export const users = mongoose.model<Iuser>("user", userSchema);
