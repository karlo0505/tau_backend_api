import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { Types } from "mongoose";

export interface ApplicationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    applicationType: string;
    typeOfVehicle: string;
    payment: number;
    companyName: string;
    companyAddress: string;
    companyContactNo: string;
    companyDesignation: string;
    plateNumber: string;
    specify: string;
  };
}

export interface DeleteRequirementsRequestSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
    requirements: string;
  };
}

export interface AllApplicationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
  };
}

export interface cancellRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    appId: string;
    newstatus: string;
  };
}

export interface singleApplicationSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
    appId: string;
  };
}

export interface AddRequireRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    requirements: string;
    requirementExp: Date;
    type: string;
  };
}

//joi
export const applicationSchema = Joi.object({
  email: Joi.string().required(),
  applicationType: Joi.string().required(),
  typeOfVehicle: Joi.string().required(),
  payment: Joi.number().required(),
  plateNumber: Joi.string().required(),
  companyName: Joi.string().allow(null, ""),
  companyAddress: Joi.string().allow(null, ""),
  companyContactNo: Joi.string().allow(null, ""),
  companyDesignation: Joi.string().allow(null, ""),
  specify: Joi.string().allow(null, ""),
});

export const allApplicationSchema = Joi.object({
  email: Joi.string().required(),
});

export const cancelSchema = Joi.object({
  appId: Joi.string().required(),
  newstatus: Joi.string().required(),
});

export const singleAppSchema = Joi.object({
  appId: Joi.string().required(),
  email: Joi.string().required(),
});

export const deleteRequirementSchema = Joi.object({
  email: Joi.string().required(),
  requirements: Joi.string().required(),
});

export const updateRequirementSchema = Joi.object({
  email: Joi.string().required(),
  requirements: Joi.string().required(),
  requirementExp: Joi.date().required(),
  type: Joi.string().required(),
});

export interface PaymentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    price: string;
    desc: string;
  };
}

export const PaymentSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.string().required(),
  desc: Joi.string().required(),
});

export interface ApprovedPaymentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    payerId: string;
    paymentId: string;
    total: string;
    email: string;
    appId: Types.ObjectId;
  };
}

export const ApprovedPaymentSchema = Joi.object({
  payerId: Joi.string().required(),
  paymentId: Joi.string().required(),
  total: Joi.string().required(),
  email: Joi.string().required().email(),
  appId: Joi.string().required(),
});

export interface GetOneApptRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
  };
}

export const GetOneAppSchema = Joi.object({
  email: Joi.string().required(),
});

export interface UserSingleAppRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    appId: Types.ObjectId;
  };
}

export const UserSingleAppSchema = Joi.object({
  appId: Joi.string().required(),
});
