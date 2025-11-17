import Joi from "joi";
import { generalValidation } from "../../middleware/general.validation.js";

export const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required()
})

export const signupSchema = Joi.object().keys({
    firstName: generalValidation.firstName.required(),
    lastName: generalValidation.lastName.required(),
    email: generalValidation.email.required(),
    password: generalValidation.password.required(),
    confirmPassword: generalValidation.confirmPassword.required(),
    age: generalValidation.age,
    gender: generalValidation.gender,
    role: generalValidation.role,
    phone: generalValidation.phone
})

export const confirmEmailSchema = Joi.object({
    otp: generalValidation.otp.required(),
    email: generalValidation.email.required()
})

export const resendEmailOTPSchema = Joi.object({
    email: generalValidation.email.required()
})

export const uploadFileSchema = Joi.object({
    fieldname: generalValidation.fieldname,
    originalname: generalValidation.originalname,
    encoding: generalValidation.encoding,
    mimetype: generalValidation.mimetype,
    destination: generalValidation.destination,
    filename: generalValidation.filename,
    path: generalValidation.path,
    size: generalValidation.size
})