import express from "express";
import bcrypt from "bcrypt";
import {
  checkRole,
  verifyToken,
  validateDto,
  generateToken,
} from "../middlewares/authMiddleware.js";
import { LoginDto, RegisterDto } from "../dtos/userDto.js";
import { users } from "../models/userModel.js";
import { globalResponse } from "../response/globalResponse.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

//REGISTER USER ROUTE
router.post(
  "/register",
  validateDto(RegisterDto),
  catchAsync(async (req: any, res: any) => {
    const { fullName, email, password, role }: RegisterDto = req.body;

    //CHECK FOR EXISTING USER
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(globalResponse(null, "User already exist", 400));
    }
    //HIDE PASSWORD AFTER CREATING USER
    const hashPassword = await bcrypt.hash(password, 10);

    //CREATE AND SAVE NEW USER OBJECT IN DATABASE
    const newUser = await users.create({
      fullName,
      email,
      password,
      role,
    });

    //RETURN RESPONSE
    return res
      .status(200)
      .json(globalResponse(newUser, "User created successfully", 200));
  })
);

//LOGIN USER ROUTE
router.post(
  "/login",
  validateDto(LoginDto),
  catchAsync(async (req: any, res: any) => {
    const { email, password }: LoginDto = req.body;

    //FIND USER IN THE DATABASE BY EMAIL
    const user = await users.findOne({ email });

    //IF USER DOESN'T EXIST RETURN ERROR
    if (!user) {
      return res
        .status(401)
        .json(globalResponse(null, "Invalid credentials", 401));
    }

    //COMPARE THE PROVIDED PASSWORD WITH THE HASHPASSWORD USING BCRYPT
    const validPassword = await bcrypt.compare(password, user.password);

    //IF PASSWORD DOESN'T EXIST RETURN ERROR
    if (!validPassword) {
      return res
        .status(401)
        .json(globalResponse(null, "Invalide credentials", 401));
    }

    //IF SUCCESSFULL GENERATE JWT TOKEN & RES.COOKIES
    const token = generateToken(user._id as string);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    //RETURN SUCCESS USER DATA
    return res.status(200).json(
      globalResponse(
        {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            token,
          },
        },
        "loigin was successfull",
        200
      )
    );
  })
);

//GET USER PROFILE
router.get(
  "/profile/:id",
  verifyToken,
  catchAsync(async (req: any, res: any) => {
    const userId = req.users._id;

    //IF USER DOESN'T EXIST
    if (!userId) {
      return res
        .status(401)
        .json(globalResponse(null, "User is not unauthorized", 401));
    }

    //FIND USER BUT REMOVE PASSEORD
    const user = await users.findById(userId).select("-password");

    //USER DOESN'T EXIST
    if (!user) {
      return res
        .status(404)
        .json(globalResponse(null, "User does not exist", 404));
    }

    //RETURN PROFILE DATA
    return res.status(201).json(
      globalResponse(
        {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        "Profile status fetched successfully",
        201
      )
    );
  })
);

//UPDATE USER BY ASSIGNING ROLE
router.patch(
  "/assignUserRole/:id",
  verifyToken,
  checkRole("admin"),
  async (req: any, res: any) => {
    const { userId } = req.params;
    const { role } = req.body;
    const { adminId } = req.user._id;

    if (!userId) {
      return res
        .status(404)
        .json(globalResponse(null, "User ID is required", 404));
    }

    if (!role) {
      return res
        .status(404)
        .json(globalResponse(null, "Role ID is required", 404));
    }

    //CHECK IF THE PROVIDED ROLE IS AMONG THE LIST OF ROLES

    const allowedRole = ["client", "translator"];

    if (!allowedRole.includes(role)) {
      return res
        .status(400)
        .json(
          globalResponse(
            null,
            `Invalid role. Allowed roles are: ${allowedRole.join(", ")}`,
            400
          )
        );
    }

    //SEARCH DATABASE FOR USER WITH THAT USERID
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json(globalResponse(null, "User not found", 404));
    }

    //IF ADMIN IS TRYING TO REMOVE THEIR OWN ADMIN ROLE
    if (userId === adminId && role !== "admin") {
      return res
        .status(403)
        .json(
          globalResponse(
            null,
            "You cannot remove your own admin privilegdes",
            403
          )
        );
    }

    user.role = role;
    await user.save();
  }
);

export default router;
