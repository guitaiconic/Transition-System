import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export const userSchema: Schema = new Schema<Iuser>(
  {
    fullName: {
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

    role: {
      type: String,
      enum: {
        values: ["client", "admin", "translator"],
      },
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);
export const users = mongoose.model<Iuser>("user", userSchema);
