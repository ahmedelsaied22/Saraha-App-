import jwt from "jsonwebtoken";
import { findById } from "../DB/DBServices.js";
import { userModel } from "../DB/models/user.model.js";
import { invalidTokenException, unAuthorizedException } from "../utils/exceptions.js";
import "dotenv/config";

export const tokenTypes = {
    access: "access",
    refresh: "refresh",
};

Object.freeze(tokenTypes);

export const decodeToken = async ({ token, type = tokenTypes.access }) => {
    if (!token) {
        return next(new invalidTokenException());
    }
    let signature = process.env.ACCESSTOKEN_SIGNATURE;

    if (type == tokenTypes.refresh) {
        signature = process.env.REFRESHTOKEN_SIGNATURE;
    }

    const data = jwt.verify(token, signature);
    const user = await findById({
        model: userModel,
        id: data._id,
    });

    return user;
};

export const auth = () => {
    return async (req, res, next) => {
        const token = req.headers.auth;
        const user = await decodeToken({ token });
        req.user = user;
        next();
    };
};

export const allowTo = (...Roles) => {
    return (req, res, next) => {
        const user = req.user
        console.log(user);

        if (!Roles.includes(user.role)) {
            throw new unAuthorizedException()
        }
        next()
    }
}