import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";


export interface RequirementsRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
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
    },

}

//joi validation

export const requirementSchema = Joi.object({
    email: Joi.string().email().required(),
    dLicense: Joi.string().required(),
    dLicenseExp: Joi.string().required(),
    mpPermit: Joi.string(),
    mpPermitExp: Joi.string(),
    crRegister: Joi.string().required(),
    crRegisterExp: Joi.string().required(),
    orReciept: Joi.string().required(),
    orRecieptExp: Joi.string().required(),
    studentId: Joi.string().allow(null, ''),
    studentIdExp: Joi.string().allow(null, ''),
    employeeId: Joi.string().allow(null, ''),
    employeeIdExp: Joi.string().allow(null, ''),
});