import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: config.NODE_ENV !== "development",
  });

  return token;
};
