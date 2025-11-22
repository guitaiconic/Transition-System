import express from "express";
import {
  registerUser,
  //loginUser,
  getProfile,
  getAllUsers,
  assignRole,
} from "../controllers/userController.js";
import {
  checkRole,
  verifyToken,
  validateDto,
} from "../middlewares/authMiddleware.js";
import { RegisterDto } from "../dtos/userDto.js";

const router = express.Router();

//REGISTER USER ROUTE
router.post("/register", validateDto(RegisterDto), registerUser);
//router.post("/login", loginUser);
//router.post("/logout", logoutUser);
router.get("/profile", verifyToken, getProfile);
router.get("/allUsers", verifyToken, checkRole("users"), getAllUsers);
router.patch("/assign-role/:id", verifyToken, checkRole("admin"), assignRole);

//PRICING ROUTES
// router.post("/set-pricing", verifyToken, CheckRole("admin"), SetPricing);
// router.patch(
//   "/update-pricing/:id",
//   verifyToken,
//   CheckRole("admin"),
//   UpdatePricing
// );
// router.delete(
//   "/delete-pricing/:id",
//   verifyToken,
//   CheckRole("admin"),
//   DeletePricing
// );
// router.get("/get-pricing/:id", verifyToken, GetPricing);
// router.get(
//   "/get-pricing-per-task/:id",
//   verifyToken,
//   CheckRole("translator"),
//   GetPricingPerTask
// );

export default router;
