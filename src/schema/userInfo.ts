import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface userInfoRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    name: string;
    avatar: Date;
    address: string;
    birthDate: Date;
    civilStatus: string;
    nameOfSpouse: string;
  };
}

export const userInfoSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  avatar: Joi.string().required(),
  address: Joi.string().required(),
  birthDate: Joi.string().required(),
  civilStatus: Joi.string().required(),
  nameOfSpouse: Joi.string().allow(null, ""),
});
