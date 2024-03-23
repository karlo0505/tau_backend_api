import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { UserInfo } from "../models/userInfo";
import { userInfoRequestSchema } from "../schema/userInfo";
import { AllApplicationRequestSchema } from "../schema/application";

export const createuserinfo = async (
  req: ValidatedRequest<userInfoRequestSchema>,
  res: Response
) => {
  try {
    const {
      email,
      name,
      avatar,
      address,
      birthDate,
      civilStatus,
      nameOfSpouse,
    } = req.body;

    console.log("request", req.body);

    const checkExist = await UserInfo.findOne({ email });
    if (checkExist)
      return res
        .status(400)
        .json({ message: `email ${email} user information is exist ` });
    const newuserinfo = new UserInfo({
      email,
      name,
      avatar,
      address,
      birthDate,
      civilStatus,
      nameOfSpouse,
    });

    const userinfo = await newuserinfo.save();

    if (userinfo) {
      res.status(200).json(userinfo);
    } else {
      res.status(400).json({ message: "Something wrong" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserInfo = async (
  req: ValidatedRequest<AllApplicationRequestSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;
    const userinfo = await UserInfo.findOne({ email });
    if (userinfo) {
      res.status(200).json({ userinfo });
    } else {
      res.status(404).json({ message: "User Information not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
