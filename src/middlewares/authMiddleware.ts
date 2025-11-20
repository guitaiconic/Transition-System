import dotenv from "dotenv";
import Jwt from "jsonwebtoken";
import { globalResponse } from "../response/globalResponse.js";
import { catchAsync } from "../utils/catchAsync.js";
import { users } from "../models/userModel.js";

dotenv.config();

interface idCodedUser {
  id: string;
  iat: string;
  exp: number;
}

//CREATE UNIQUE TOKEN
export const generateToken = (id: string) => {
  const token = Jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "2d",
  });
  return token;
};

//VERIFY USER
export const verifyToken = catchAsync(async (req: any, res: any, next: any) => {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    return res.status(401).json(globalResponse(null, "Unauthorized", 401));
  }

  const decoded: idCodedUser = Jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as unknown as idCodedUser;

  const currentUsers = await users.findById(decoded.id);

  console.log(currentUsers);

  if (!currentUsers) {
    return res.status(401).json(globalResponse(null, "Unauthorized", 401));
  }

  req.user = currentUsers;
  next();
});

export const checkRole = (role: string) => {
  return (req: any, res: any, next: any) => {
    const user = req.user;

    if (user?.role !== role) {
      return res.status(403).json(globalResponse(null, "Forbidden", 403));
    }

    next();
  };
};
