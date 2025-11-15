import Joi from "joi";
import { gender, role } from "../DB/models/user.model.js";
import mongoose from "mongoose";


const checkId = (value, helpers) => {
    if (mongoose.isValidObjectId(value)) {
        return true
    } else {
        return helpers.message('in-valid object id')
    }
}

export const generalValidation = {
    firstName: Joi.string().min(5).max(20),
    lastName: Joi.string().min(5).max(20),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(20),
    confirmPassword: Joi.string().min(8).max(20),
    age: Joi.number().min(18).max(60),
    gender: Joi.string().valid(gender.male, gender.female),
    role: Joi.string().valid(role.admin, role.user),
    phone: Joi.string().min(10).max(13),
    otp: Joi.string().length(6),
    id: Joi.string().custom(checkId),
}