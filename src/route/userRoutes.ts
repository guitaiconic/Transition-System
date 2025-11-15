
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getAllUsers,
  AssignRole,
} from "../controllers/userController.js";
import { CheckRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//REGISTER USER ROUTE
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", verifyToken, getProfile);
router.get("/all-users", verifyToken, CheckRole("admin"), getAllUsers);
router.patch("/assign-role/:id", verifyToken, CheckRole("admin"), AssignRole);

//TASKS ROUTES
router.post("/create-task", verifyToken, CheckRole("client"), CreateTask);
router.post("/assign-task/:id", verifyToken, CheckRole("admin"), AssignTask);
router.get("/get-tasks", verifyToken, CheckRole("admin"), GetAllTasks);
router.get("/get-task/:id", verifyToken, GetTask);
router.patch("/update-task/:id", verifyToken, UpdateTask);
router.delete("/delete-task/:id", verifyToken, CheckRole("admin"), DeleteTask);

//PRICING ROUTES
router.post("/set-pricing", verifyToken, CheckRole("admin"), SetPricing);
router.patch("/update-pricing/:id", verifyToken, CheckRole("admin"), UpdatePricing);
router.delete("/delete-pricing/:id", verifyToken, CheckRole("admin"), DeletePricing);
router.get("/get-pricing/:id", verifyToken, GetPricing);
router.get("/get-pricing-per-task/:id", verifyToken, CheckRole("translator"), GetPricingPerTask);

export default router;
