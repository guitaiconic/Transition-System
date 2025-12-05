import express from "express";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

//TASKS ROUTES
//router.post("/create-task", verifyToken, checkRole("client"), createTask);
// router.post("/assign-task/:id", verifyToken, CheckRole("admin"), AssignTask);
// router.get("/get-tasks", verifyToken, CheckRole("admin"), GetAllTasks);
// router.get("/get-task/:id", verifyToken, GetTask);
// router.patch("/update-task/:id", verifyToken, UpdateTask);
// router.delete("/delete-task/:id", verifyToken, CheckRole("admin"), DeleteTask);

export default router;
