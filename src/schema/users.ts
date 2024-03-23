import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { ObjectId } from "mongoose";

export interface RegisterRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    password: string;
    email: string;
    mobile: number;
  };
}

export interface LoginRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    password: string;
    email: string;
  };
}

export interface CheckIdRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    id: ObjectId
  }
}

export interface ArrayRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    deletedId: string[];
    token: string;
  }
}

export interface VerifyEmailSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    verificationCode: number;
    email: string;
  };
}

export interface resendEmailCodeSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
  };
}



export interface changePasswordSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
    otp: number;
    password: string;
  };
}

//joi validation

export const registerUserSchema = Joi.object({
  password: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  mobile: Joi.number().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(2),
});

export const emailVerifiedSchema = Joi.object({
  verificationCode: Joi.number().required(),
  email: Joi.string().required().email(),
});

export const resendCodeSchema = Joi.object({
  email: Joi.string().required().email(),
});

export const changePasswordSchema = Joi.object({
  email: Joi.string().required().email(),
  otp: Joi.number().required(),
  password: Joi.string().required(),
});

export const CheckIdSchema = Joi.object({
  id: Joi.string().required()
})

export const deleteManySchema = Joi.object({
  deletedId: Joi.array().required(),
  token: Joi.string().required()
})