import type { Types } from "mongoose";

export interface createTaskDto {
  status: "pending" | "In-progress" | "Completed";
  text: string;
}

export interface createTaskDto {
  translatorId: Types.ObjectId;
  amount: number;
}
