import { userModel } from "../../DB/models/user.model.js"
import { successHandler } from "../../utils/successHandler.js"

export const getUserById = async (req, res, next) => {
    const { id } = req.params
    const user = await userModel.findById(id)

    if (!user) {
        throw new Error("user not found")
    }

    return successHandler(res, { data: user })
}