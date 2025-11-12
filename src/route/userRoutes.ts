import Express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = Express.Router();

//REGISTER USER ROUTE
router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
