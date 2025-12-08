import type { Types } from "mongoose";

export interface createTaskDto {
  status: "pending" | "In-progress" | "Completed";
  text: string;
}

export interface assignRole {
  translatorId: Types.ObjectId;
  amount: number;
}
