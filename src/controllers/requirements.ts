import { Response } from "express";
import { IRequirements, Requirements } from "../models/requirements";
import { ValidatedRequest } from "express-joi-validation";
import mongoose from "mongoose";
import { RequirementsRequestSchema } from "../schema/requirements";
import {
  AllApplicationRequestSchema,
  DeleteRequirementsRequestSchema,
  AddRequireRequestSchema,
} from "../schema/application";

export const createRequirements = async (
  req: ValidatedRequest<RequirementsRequestSchema>,
  res: Response
) => {
  try {
    const {
      email,
      dLicense,
      dLicenseExp,
      mpPermit,
      mpPermitExp,
      crRegister,
      crRegisterExp,
      orReciept,
      orRecieptExp,
      studentId,
      studentIdExp,
      employeeId,
      employeeIdExp,
    } = req.body;

    const newrequirements = new Requirements({
      _id: new mongoose.Types.ObjectId(),
      email,
      dLicense,
      dLicenseExp,
      mpPermit,
      mpPermitExp,
      crRegister,
      crRegisterExp,
      orReciept,
      orRecieptExp,
      studentId,
      studentIdExp,
      employeeId,
      employeeIdExp,
    });

    const requirements = await newrequirements.save();
    if (requirements) {
      res.status(200).json({ message: "ok", email, requirements });
    } else {
      res.status(400).json({ message: "Something wrong" });
    }
  } catch (error) {
    console.log("500 error requirements", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRequirements = async (
  req: ValidatedRequest<AllApplicationRequestSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;
    const requirements = await Requirements.findOne({ email });
    if (requirements) {
      res.status(200).json({ requirements });
    } else {
      res.status(404).json({ message: "Requirements cannot be found!" });
    }
  } catch (error) {
    console.log("500 error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOneRequirements = async (
  req: ValidatedRequest<DeleteRequirementsRequestSchema>,
  res: Response
) => {
  const { email, requirements } = req.query;

  try {
    const deleteReq = await Requirements.findOne({ email });
    if (requirements === "dLicense") {
      await Requirements.updateOne(
        { email },
        { $unset: { dLicense: 1, dLicenseExp: 1 } }
      )
        .then(() => {
          return res
            .status(200)
            .json({ message: "Successfully delete your Driver's license" });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: `Something wrong cannot delete : ${error}` });
        });
    }
    if (requirements === "mpPermit") {
      await Requirements.updateOne(
        { email },
        { $unset: { mpPermit: 1, mpPermitExp: 1 } }
      )
        .then(() => {
          return res
            .status(200)
            .json({ message: "Successfully delete your Mayor's permit" });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: `Something wrong cannot delete : ${error}` });
        });
    }
    if (requirements === "crRegister") {
      await Requirements.updateOne(
        { email },
        { $unset: { crRegister: 1, crRegisterExp: 1 } }
      )
        .then(() => {
          return res.status(200).json({
            message: "Successfully delete your Certificate of Register",
          });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: `Something wrong cannot delete : ${error}` });
        });
    }
    if (requirements === "orReciept") {
      await Requirements.updateOne(
        { email },
        { $unset: { orReciept: 1, orRecieptExp: 1 } }
      )
        .then(() => {
          return res
            .status(200)
            .json({ message: "Successfully delete your Official receipt" });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: `Something wrong cannot delete : ${error}` });
        });
    }
    if (requirements === "studentId") {
      await Requirements.updateOne(
        { email },
        { $unset: { studentId: 1, studentIdExp: 1 } }
      )
        .then(() => {
          return res
            .status(200)
            .json({ message: "Successfully delete your Student Id" });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: `Something wrong cannot delete : ${error}` });
        });
    }
    if (requirements === "employeeId") {
      await Requirements.updateOne(
        { email },
        { $unset: { employeeId: 1, employeeIdExp: 1 } }
      )
        .then(() => {
          return res
            .status(200)
            .json({ message: "Successfully delete your Employee ID" });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: `Something wrong cannot delete : ${error}` });
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addNewOneRequirements = async (
  req: ValidatedRequest<AddRequireRequestSchema>,
  res: Response
) => {
  try {
    const { email, requirements, requirementExp, type } = req.body;

    if (type === "dLicense") {
      const require = await Requirements.findOneAndUpdate(
        { email },
        { dLicense: requirements, dLicenseExp: requirementExp }
      );
      if (require)
        return res.status(200).json({
          message: "Successfully added Driver's License",
        });
      res.status(404).json({ message: "Cannot add Driver's License" });
    }
    if (type === "mpPermit") {
      const require = await Requirements.findOneAndUpdate(
        { email },
        { mpPermit: requirements, mpPermitExp: requirementExp }
      );
      if (require)
        return res.status(200).json({
          message: "Successfully added Mayor's Permit",
        });
      res.status(404).json({ message: "Cannot add Mayor's Permit" });
    }
    if (type === "crRegister") {
      const require = await Requirements.findOneAndUpdate(
        { email },
        { crRegister: requirements, crRegisterExp: requirementExp }
      );
      if (require)
        return res.status(200).json({
          message: "Successfully added Certificate of Registration",
        });
      res
        .status(404)
        .json({ message: "Cannot add Certificate of Registration" });
    }
    if (type === "orReciept") {
      const require = await Requirements.findOneAndUpdate(
        { email },
        { orReciept: requirements, orRecieptExp: requirementExp }
      );
      if (require)
        return res.status(200).json({
          message: "Successfully added Official Receipt",
        });
      res.status(404).json({ message: "Cannot add Official Receipt" });
    }
    if (type === "studentId") {
      const require = await Requirements.findOneAndUpdate(
        { email },
        { studentId: requirements, studentIdExp: requirementExp }
      );
      if (require)
        return res.status(200).json({
          message: "Successfully added Student ID",
        });
      res.status(404).json({ message: "Cannot  add Student ID" });
    }
    if (type === "employeeId") {
      const require = await Requirements.findOneAndUpdate(
        { email },
        { employeeId: requirements, employeeIdExp: requirementExp }
      );
      if (require)
        return res.status(200).json({
          message: "Successfully added Employee ID",
        });
      res.status(404).json({ message: "Cannot  add Employee ID" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
