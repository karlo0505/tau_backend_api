import { Application } from "../models/application";
import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import {
  AllApplicationRequestSchema,
  ApplicationRequestSchema,
  GetOneApptRequestSchema,
  UserSingleAppRequestSchema,
  cancellRequestSchema,
  singleApplicationSchema,
} from "../schema/application";
import mongoose from "mongoose";
import { UserInfo } from "../models/userInfo";
import { Requirements } from "../models/requirements";
import { ArrayRequestSchema, CheckIdRequestSchema } from "../schema/users";
import { Users } from "../models/users";

export const createApplication = async (
  req: ValidatedRequest<ApplicationRequestSchema>,
  res: Response
) => {
  try {
    const {
      email,
      applicationType,
      typeOfVehicle,
      payment,
      companyAddress,
      companyContactNo,
      companyDesignation,
      companyName,
      plateNumber,
      specify,
    } = req.body;

    const newapplication = new Application({
      email,
      applicationType,
      typeOfVehicle,
      payment,
      plateNumber,
      companyAddress,
      companyContactNo,
      companyDesignation,
      companyName,
      appStatus: "pending",
      specify,
      dateApplied: Date.now(),
    });

    const application = await newapplication.save();

    if (application) {
      return res.status(200).json({
        message: "application successfully added",
        newapp: application,
      });
    } else {
      return res.status(400).json({ message: "Something error" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userApplication = async (
  req: ValidatedRequest<AllApplicationRequestSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;

    const applications = await Application.find({ email });
    const userInfo = await UserInfo.findOne({ email });
    const requirements = await Requirements.findOne({ email });
    const users = await Users.findOne({ email });
    if (applications && userInfo && requirements && users) {
      return res.status(200).json({
        applications,
        userInfo,
        requirements,
        users: {
          email: users.email,
          mobile: users.mobile,
        },
      });
    }

    return res.status(400).json({ message: "Error" });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};

export const cancelApplication = async (
  req: ValidatedRequest<cancellRequestSchema>,
  res: Response
) => {
  try {
    const { appId, newstatus } = req.query;

    const application = await Application.findById(appId);
    if (application) {
      application.appStatus = newstatus;
      const updateApp = await application.save();
      if (updateApp) {
        return res
          .status(200)
          .json({ message: "Your application is successfully updated" });
      } else {
        return res
          .status(400)
          .json({ message: "Unable to update your application" });
      }
    } else {
      return res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};

export const allApplication = async (
  req: ValidatedRequest<AllApplicationRequestSchema>,
  res: Response
) => {
  try {
    const allapps = await Application.find();
    if (allapps) {
      return res.status(200).json(allapps);
    }
    return res.status(400).json({ message: "Error" });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};

export const deleteApplication = async (
  req: ValidatedRequest<ArrayRequestSchema>,
  res: Response
) => {
  try {
    const { deletedId } = req.body;

    const application = await Application.deleteMany({
      _id: {
        $in: deletedId,
      },
    });
    if (application) {
      return res.status(200).json({ message: "Successfully remove" });
    } else {
      return res.status(400).json({ message: "Error in delete" });
    }
  } catch (error) {
    console.log("500 error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const singleApp = async (
  req: ValidatedRequest<singleApplicationSchema>,
  res: Response
) => {
  try {
    const { appId, email } = req.query;
    const userInfo = await UserInfo.findOne({ email });
    const requirements = await Requirements.findOne({ email });
    const applications = await Application.find({ _id: appId, email });
    if (requirements ?? applications ?? userInfo) {
      return res.status(200).json({
        userInfo,
        requirements,
        applications,
      });
    }
    return res.status(404).json({ message: "Cannot this details" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSingleApp = async (
  req: ValidatedRequest<singleApplicationSchema>,
  res: Response
) => {
  try {
    const { appId, email } = req.query;
    const applications = await Application.findOneAndUpdate(
      { _id: appId, email },
      { dateOfPayment: Date.now(), appStatus: "approved" }
    );

    if (applications)
      return res.status(200).json({
        message: "Successfully approved",
      });

    res.status(404).json({ message: "Cannot this details" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOneApplication = async (
  req: ValidatedRequest<GetOneApptRequestSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;

    const appdatasingle = await Application.find({ email });
    if (appdatasingle) {
      return res.status(200).json(appdatasingle);
    }

    return res.status(404).json({ message: "Application not found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const appIdSingleApp = async (
  req: ValidatedRequest<UserSingleAppRequestSchema>,
  res: Response
) => {
  try {
    const { appId } = req.query;

    const appdatasingle = await Application.findById(appId);
    if (appdatasingle) {
      return res.status(200).json(appdatasingle);
    }

    return res.status(404).json({ message: "Application not found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
