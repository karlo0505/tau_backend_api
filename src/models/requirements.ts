import { Schema, model } from "mongoose";

export interface IRequirements {
  email: string;
  dLicense: string,
  dLicenseExp: Date,
  mpPermit: string,
  mpPermitExp: Date,
  crRegister: string,
  crRegisterExp: Date,
  orReciept: string,
  orRecieptExp: Date,
  studentId: string,
  studentIdExp: Date,
  employeeId: string,
  employeeIdExp: Date,
}

const requirementSchema = new Schema<IRequirements>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dLicense: {
    type: String,
    required: true,
  },
  dLicenseExp: {
    type: Date,
    required: true
  },
  mpPermit: {
    type: String,
  },
  mpPermitExp: {
    type: Date,
  },
  crRegister: {
    type: String,
    required: true
  },
  crRegisterExp: {
    type: Date,
    required: true
  },
  orReciept: {
    type: String,
    required: true
  },
  orRecieptExp: {
    type: Date,
    required: true
  },
  studentId: {
    type: String,
  },
  studentIdExp: {
    type: Date,
  },
  employeeId: {
    type: String
  },
  employeeIdExp: {
    type: Date
  }
});

export const Requirements = model<IRequirements>(
  "Requirements",
  requirementSchema
);
