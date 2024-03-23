import { Schema, model } from "mongoose";

export interface IApplication {
  email: string;
  applicationType: string;
  typeOfVehicle: string;
  payment: number;
  companyName: string;
  companyAddress: string;
  companyContactNo: string;
  companyDesignation: string;
  dateOfPayment: string;
  plateNumber: string;
  appStatus: string;
  specify: string;
  dateApplied: string;
}

const applicationSchema = new Schema<IApplication>({
  email: {
    type: String,
    required: true,
  },
  applicationType: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  typeOfVehicle: {
    type: String,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  dateOfPayment: {
    type: String,
  },
  companyName: {
    type: String,
  },
  companyAddress: {
    type: String,
  },
  companyContactNo: {
    type: String,
  },
  companyDesignation: {
    type: String,
  },

  appStatus: {
    type: String,
  },
  specify: {
    type: String,
  },
  dateApplied: {
    type: String,
  },
});

export const Application = model<IApplication>(
  "Application",
  applicationSchema
);
