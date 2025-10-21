import { create, find, findById, findByIdAndUpdate, findOne } from "../../DB/DBServices.js"
import { userModel } from "../../DB/models/user.model.js"
import { emailAlreadyExist, invalidCredentionals, invalidOtpException, notFoundEmail } from "../../utils/exceptions.js"
import { successHandler } from "../../utils/successHandler.js"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { decodeToken, tokenTypes } from "../../middleware/auth.middleware.js"
import { decryption, encryption } from "../../utils/crypto.js"
import { template } from "../../utils/sendEmail/generateHTML.js"
import { customAlphabet } from "nanoid"
import { sendEmail } from "../../utils/sendEmail/sendEmail.js"
import { compare, hash } from "../../utils/bcrypt.js"

export const signup = async (req, res, next) => {
    const { firstName, lastName, email, password, age, gender, role, phone } = req.body

    const isExist = await find({
        model: userModel,
        filter: {
            email
        }
    })
    const custom = customAlphabet('012345678')
    const otp = custom(6)
    const subject = 'Email Confirmation'
    const html = template(otp, firstName, subject)
    if (!isExist) {
        return next(new emailAlreadyExist())
    }

    const user = await create({
        model: userModel,
        data: {
            firstName,
            lastName,
            email,
            password,
            age,
            gender,
            role,
            phone: encryption(phone),
            emailOtp: {
                otp: hash(otp),
                expiredAt: Date.now() + 1000 * 50
            }
        }
    })
    await sendEmail({ to: user.email, subject: subject, html })

    successHandler(res, { msg: "User Created Successfully", data: user, status: 201 })
}

export const confirmEmail = async (req, res, next) => {
    const { otp, email } = req.body

    const user = await findOne({
        model: userModel,
        filter: {
            email
        }
    })

    if (!user) {
        return next(new notFoundEmail())
    }

    if (user.confirmed) {
        throw new Error("user already confirmed")
    }

    if (user.emailOtp.expiredAt < Date.now()) {
        throw new invalidOtpException()
    }

    if (compare(otp, user.emailOtp.otp)) {
        return next(new invalidOtpException())
    }
    await user.updateOne({
        confirmed: true,
        $unset: {
            emailOtp: ""
        }
    })
    return successHandler(res, { status: 200 })
}

export const resendOtp = async (req, res, next) => {
    const { email } = req.body

    const user = await findOne({
        model: userModel,
        filter: {
            email
        }
    })

    const custom = customAlphabet('012345678')
    const otp = custom(6)
    const subject = 'Email Confirmation (resend email)'

    if (!user) {
        throw new Error("user not found", { status: 404 })
    }

    if (user.confirmed) {
        throw new Error("user already confirmed")
    }

    if (user.emailOtp.expiredAt > Date.now()) {
        throw new Error("use last sended otp")
    }

    await user.updateOne({
        emailOtp: {
            otp: otp,
            expiredAt: Date.now() + 1000 * 30
        }
    })
    const html = template(otp, user.firstName, subject)
    await sendEmail({ to: user.email, subject: subject, html })

    return successHandler(res, { status: 200 })
}

export const login = async (req, res, next) => {

    const { email, password } = req.body
    const user = await findOne({
        model: userModel,
        filter: {
            email
        }
    })

    if (!user || !user.comparePassword(password, user.password)) {
        return next(new invalidCredentionals())
    }

    const accessToken = jwt.sign({
        _id: user._id
    }, process.env.ACCESSTOKEN_SIGNATURE,
        {
            expiresIn: "5 M"
        })

    const refreshToken = jwt.sign({
        _id: user._id
    }, process.env.REFRESHTOKEN_SIGNATURE,
        {
            expiresIn: "7 D"
        })


    successHandler(res, { msg: "Done", data: { accessToken, refreshToken }, status: 200 })
}

export const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body

    const user = await decodeToken({
        token: refreshToken,
        type: tokenTypes.refresh
    })

    const accessToken = jwt.sign({
        _id: user._id
    }, process.env.ACCESSTOKEN_SIGNATURE,
        {
            expiresIn: "15 S"
        })

    return successHandler(res, { data: accessToken })
}

export const getUserProfile = async (req, res, next) => {
    const user = req.user
    user.phone = decryption(user.phone)

    successHandler(res, { msg: "Done", data: user, status: 200 })
}

export const updateUser = async (req, res, next) => {
    const id = req.params.id
    const { name, email, password, age, gender, role } = req.body

    const user = await findById({
        model: userModel,
        id: id
    })

    if (!user || user.password != password) {
        return next(new invalidCredentionals())
    }

    const updatedUser = await findByIdAndUpdate({
        model: userModel,
        id: id,
        data: {
            name,
            email,
            password,
            age,
            gender,
            role
        }
    })
    successHandler(res, { msg: "User Updated Successfully", data: updatedUser, status: 202 })
}

export const forgetPass = async (req, res, next) => {
    const { email } = req.body

    const user = await findOne({
        model: userModel,
        filter: {
            email
        }
    })
    if (!user) {
        throw new Error("user not found")
    }

    const custom = customAlphabet('012345678')
    const otp = custom(6)
    const subject = 'Email Confirmation'
    const html = template(otp, user.firstName, subject)

    if (!user.confirmed) {
        throw new Error("this user not confirmed")
    }

    if (user.passwordOtp.expiredAt > Date.now()) {
        throw new Error("use last sended OTP")
    }

    await sendEmail({ to: user.email, subject: subject, html })

    await user.updateOne({
        passwordOtp: {
            otp,
            expiredAt: Date.now() + 1000 * 30
        }
    })
    return successHandler(res, { msg: "Done", status: 200 })
}

export const changePass = async (req, res, next) => {
    const { email, password, otp } = req.body

    const user = await findOne({
        model: userModel,
        filter: {
            email
        }
    })

    if (!user) {
        throw new Error("user not found")
    }

    if (otp != user.passwordOtp.otp) {
        throw new invalidOtpException()
    }

    if (user.passwordOtp.expiredAt < Date.now()) {
        throw new Error("OTP expired")
    }

    await user.updateOne({
        password,
        $unset: {
            passwordOtp: ""
        }
    })
    return successHandler(res, { msg: "password updated successfully", status: 200 })
}