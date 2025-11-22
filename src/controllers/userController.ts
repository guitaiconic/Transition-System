import type { RegisterDto } from "../dtos/userDto.js";
import { users } from "../models/userModel.js";
import { globalResponse } from "../response/globalResponse.js";
import bcrypt from "bcrypt";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../middlewares/authMiddleware.js";

const buildAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 2 * 24 * 60 * 60 * 1000,
});

export const registerUser = catchAsync(async (req: any, res: any) => {
  const { firstName, lastName, email, password, role }: RegisterDto = req.body;

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json(globalResponse(null, "User already exist", 400));
  }

  //HIDE PASSWORD
  const hashPassword = await bcrypt.hash(password, 10);

  //CREATE PARAMETERS IN THE DATABASE
  const newUser = await users.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    role,
  });

  return res
    .status(200)
    .json(globalResponse(newUser, "User created successfully", 200));
});

// export const loginUser = async (req: any, res: any) => {
//const { email, password }: loginDto = req.body;

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json(globalResponse(null, "All field are required", 400));
//   }

//   const user = await users.findOne({ email });
//   if (!user) {
//     return res
//       .status(400)
//       .json(globalResponse(null, "Invalid email address", 400));
//   }

//   const validPassword = await bcrypt.compare(password, user.password);
//   if (!validPassword) {
//     return res.status(400).json(globalResponse(null, "Invalid password", 400));
//   }

//   const token = generateToken(user._id as string);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//     maxAge: 2 * 24 * 60 * 60 * 1000,
//   });

//   return res.status(200).json(
//     globalResponse(
//       {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         token,
//       },
//       "login was successful",
//       200
//     )
//   );
// };

export const getProfile = catchAsync(async (req: any, res: any) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json(globalResponse(null, "Unauthorized", 401));
  }

  const user = await users.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json(globalResponse(null, "User not found", 404));
  }

  return res
    .status(200)
    .json(globalResponse(user, "Profile fetched successfully", 200));
});

export const getAllUsers = catchAsync(async (req: any, res: any) => {
  const allUsers = await users.find().select("-password");
  if (!allUsers) {
    return res
      .status(404)
      .json(globalResponse(null, "Hey bro, you dont have any users", 404));
  }
  return res
    .status(200)
    .json(globalResponse(allUsers, "Users fetched successfully", 200));
});

export const assignRole = async (req: any, res: any) => {
  const { id: userId } = req.params;
  const { role } = req.body;

  console.log("Target User ID from URL:", userId); // Should be target user
  console.log("Role to assign:", role);
  console.log("Logged-in Admin:", req.user._id);

  if (!userId) {
    return res
      .status(400)
      .json(globalResponse(null, "User ID is required", 400));
  }

  if (!role) {
    return res.status(400).json(globalResponse(false, "Role is required", 400));
  }

  const allowedRole = ["client", "translator"];

  if (!allowedRole.includes(role)) {
    return res
      .status(400)
      .json(
        globalResponse(
          null,
          `Allowed roles are: ${allowedRole.join(", ")}`,
          400
        )
      );
  }

  const user = await users.findById(userId);

  if (!user) {
    return res.status(404).json(globalResponse(null, "User not found", 404));
  }

  if (req.user?._id.toString() === userId && role !== "admin") {
    return res
      .status(403)
      .json(globalResponse(null, "You cannot change your own admin role", 403));
  }

  user.role = role;
  await user.save();

  return res.status(200).json(
    globalResponse(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      "Role assigned successfully",
      200
    )
  );
};

// export const logoutUser = catchAsync(async (_req: any, res: any) => {
//   res.cookie("token", "", {
//     ...buildAuthCookieOptions(),
//     expires: new Date(0),
//     maxAge: undefined,
//   });

//   return res.status(200).json(globalResponse(null, "Logout successful", 200));
// });

// //export const AssignRole = catchAsync(async (req: any, res: any) => {
// const { id } = req.params;
// const { role } = req.body;

// if (!id)
//   return res.status(400).json(globalResponse(null, "User ID is required", 400));
// if (!role)
//   return res.status(400).json(globalResponse(null, "Role is required", 400));

// const user = await users.findById(id);
// if (!user)
//   return res.status(404).json(globalResponse(null, "User not found", 404));

// user.role = role;
// await user.save();

// return res
//   .status(200)
//   .json(globalResponse(user, "Role assigned successfully", 200));
//});
