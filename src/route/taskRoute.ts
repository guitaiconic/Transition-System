import express from "express";
import mongoose from "mongoose";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import type { assignRole, createTaskDto } from "../dtos/taskDto.js";
import { globalResponse } from "../response/globalResponse.js";
import type { Response } from "express";
import { tasks } from "../models/taskModel.js";
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

    const taskCreated = await tasks.create({ status, text, clientId: userId });

    return res
      .status(200)
      .json(globalResponse(taskCreated, "Task created successfuly", 200));
  })
);

//VIEW TASK BY ID
router.get(
  "/getTask/:id",
  verifyToken,
  catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json(globalResponse(null, "Task is required", 404));
    }

    //CHECK FOR TASK IN DATABASE
    const getTask = await tasks.findById(id);

    if (!getTask) {
      return res.status(404).json(globalResponse(null, "Task not found", 404));
    }

    return res
      .status(200)
      .json(globalResponse(getTask, "Task Created successfully", 200));
  })
);

router.patch(
  "/assignTask/:id",
  verifyToken,
  checkRole("admin"),
  catchAsync(async (req: any, res: Response) => {
    const { translatorId, amount }: assignRole = req.body;
    const { id: taskId } = req.params;

    //VALIDATE INPUT
    if (!translatorId) {
      return res
        .status(400)
        .json(globalResponse(null, "Translator ID is required", 400));
    }

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json(globalResponse(null, "Valid amount is required", 400));
    }

    //Find task by ID
    const task = await tasks.findById(taskId);
    if (!task) {
      return res.status(404).json(globalResponse(null, "Task not found", 404));
    }

    //Check if translator exist
    const translator = await users.findById(translatorId);
    if (!translator) {
      return res
        .status(404)
        .json(globalResponse(null, "Translator not found", 404));
    }

    //Verifies the user is actually a translator (not client or admin)
    if (translator.role !== "translator") {
      return res
        .status(404)
        .json(globalResponse(null, "User is not a translator", 404));
    }

    //Check if task is already assign to the translator by ID
    if (task.translatorId) {
      return res
        .status(404)
        .json(
          globalResponse(null, "Task is already assign to the translator", 404)
        );
    }

    //Assign task
    const assignTask = await tasks.findByIdAndUpdate(taskId, {
      translatorId,
      amount,
    });

    return res
      .status(200)
      .json(globalResponse(assignTask, "Task is assigned successfully", 200));
  })
);

//GET ALL TASK
router.get(
  "/getTasks",
  verifyToken,
  checkRole("admin"),
  catchAsync(async (req: any, res: Response) => {
    const getAllTask = await tasks.find();

    //Check if task exist
    if (!getAllTask) {
      return res.status(404).json(globalResponse(null, "Task not found", 404));
    }

    return res
      .status(200)
      .json(globalResponse(getAllTask, "Task successfully retrived", 200));
  })
);

// router.patch("/update-task/:id", verifyToken, UpdateTask);
// router.delete("/delete-task/:id", verifyToken, CheckRole("admin"), DeleteTask);

export default router;
