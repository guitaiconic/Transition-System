import express from "express";
import mongoose from "mongoose";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import type { createTaskDto } from "../dtos/taskDto.js";
import { globalResponse } from "../response/globalResponse.js";
import type { Response } from "express";
import { task } from "../models/taskModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { users } from "../models/userModel.js";

const router = express.Router();

//TASKS ROUTES
router.post(
  "/createTask",
  verifyToken,
  checkRole("client"),
  catchAsync(async (req: any, res: Response) => {
    const userId = req.user._id;
    const { text, status }: createTaskDto = req.body;

    if (!text || !status) {
      return res
        .status(404)
        .json(globalResponse(null, "All field is required", 404));
    }

    const taskCreated = await task.create({ status, text, clientId: userId });

    return res
      .status(200)
      .json(globalResponse(taskCreated, "Task created successfuly", 200));
  })
);

//VIEW TASK
router.get(
  "/getTask/:id",
  verifyToken,
  catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    console.log("This is params", req.params);

    if (!id) {
      return res
        .status(404)
        .json(globalResponse(null, "Task is required", 404));
    }

    //CHECK FOR TASK IN DATABASE
    const getTask = await task.findById(id);

    if (!getTask) {
      return res.status(404).json(globalResponse(null, "Task not found", 404));
    }

    return res
      .status(200)
      .json(globalResponse(getTask, "Task Created successfully", 200));
  })
);

router.post(
  "/assign-task/:id",
  verifyToken,
  checkRole("admin"),
  catchAsync(async (req: any, res: Response) => {})

  //translatorId from body

  //get task from taskId
  //update the translatorId and amount
);

// router.get("/get-tasks", verifyToken, CheckRole("admin"), GetAllTasks);
// router.patch("/update-task/:id", verifyToken, UpdateTask);
// router.delete("/delete-task/:id", verifyToken, CheckRole("admin"), DeleteTask);

export default router;
