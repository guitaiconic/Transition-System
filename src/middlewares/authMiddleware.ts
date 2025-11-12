import dotenv from "dotenv";
import Jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (id: string) => {
  const token = Jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "2d",
  });
  return token;
};
