import { Users } from "../models/users";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const JWT_KEY = process.env.SECRET_TOKEN as Secret;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization?.startsWith("Bearer");

  const xAppKey = req.headers.x_app_key;
  if (xAppKey !== (process.env.X_API_KEY as string)) {
    res
      .status(403)
      .json({ message: "Application key is invalid or not found" });
  }

  if (!authHeader) {
    res.status(404).json({ message: "Token not found" });
  }
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;

    const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;

    if (Date.now() >= decoded.exp! * 1000) {
      return res.status(403).json({ message: "Token is expired" });
    }

    const checkEmail = await Users.findOne({
      email: decoded.userInfo.email,
    });

    if (!checkEmail) {
      return res
        .status(404)
        .json({ message: "Email from token cannot be found" });
    }

    if (decoded) {
      next();
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyToken;
