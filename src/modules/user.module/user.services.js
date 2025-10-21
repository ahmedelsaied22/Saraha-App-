import { userModel } from "../../DB/models/user.model.js"
import { emailAlreadyExist, notFoundEmail, validationError } from "../../utils/exceptions.js"
import { successHandler } from "../../utils/successHandler.js"

export const signup = async (req, res, next) => {
    const { name, email, password, age, gender, role } = req.body
    const isExist = await userModel.find({ email })

    if (!isExist) {
        return next(new emailAlreadyExist())
    }

    const user = await userModel.create({
        name,
        email,
        password,
        age,
        gender,
        role
    })
    return successHandler(res, { msg: "User Created Successfully", data: user, status: 201 })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const userExist = await userModel.find({ email, password })

    if (!userExist) {
        return next(new validationError())
    }

    return successHandler(res, { msg: "Done", data: userExist, status: 200 })
}

export const getAllUsers = async (req, res, next) => {
    const users = await userModel.find()

    return successHandler(res, { msg: "Done", data: users, status: 200 })
}

export const editUser = async (req, res, next) => {
    const { name, email, password, age, gender, role } = req.body

    const userExist = await userModel.find({ email })

    if (!userExist) {
        return next(new notFoundEmail())
    }

    const updatedUser = await userModel.updateOne({
        name,
        email,
        password,
        age,
        gender,
        role
    })

    return successHandler(res, { msg: "User Updated Successfully", data: updatedUser, status: 200 })

}

export const deleteUser = async (req, res, next) => {
    const id = req.params.id
    const isExist = await userModel.find({ _id: id })


    if (!isExist) {
        return next(new notFoundEmail())
    }

    await userModel.deleteOne({ _id: id })
    return successHandler(res, { msg: "User Deleted Successfully", status: 200 })
}