import dotenv from "dotenv";
import Jwt from "jsonwebtoken";
import { globalResponse } from "../response/globalResponse.js";

dotenv.config();

export const generateToken = (id: string) => {
  const token = Jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "2d",
  });
  return token;
};

export const verifyToken = (req: any, res: any, next: any) => {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    return res.status(401).json(globalResponse(null, "Unauthorized", 401));
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(globalResponse(null, "Unauthorized", 401));
  }
};

export const CheckRole = (role: string) => {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    if (user?.role !== role) {
      return res.status(403).json(globalResponse(null, "Forbidden", 403));
    }
    next(); 
  };
};