import { findById } from "../../DB/DBServices.js"
import { messageModel } from "../../DB/models/message.model.js"
import { userModel } from "../../DB/models/user.model.js"
import { invalidCredentionals, notFoundEmail } from "../../utils/exceptions.js"
import { successHandler } from "../../utils/successHandler.js"

export const sendMessage = async (req, res, next) => {
    const { content, to } = req.body
    const { from } = req.params

    const sender = await userModel.findById(from)
    const receiver = await userModel.findById(to)
    if (!receiver) {
        throw new notFoundEmail()
    }

    const message = messageModel.create({
        content: content,
        to: receiver._id,
        from: sender?._id
    })
    return successHandler(res, { msg: "message sended successfully" })
}

export const getMessages = async (req, res, next) => {
    const user = req.user

    if (!user) {
        throw new invalidCredentionals()
    }
    const messages = await messageModel.find({ to: user._id }).select('-to').populate([{
        path: "from",
        select: 'firstName lastName _id email profileImage.secure_url'
    }])

    return successHandler(res, { msg: "Done", data: messages })
}

export const getUserMessages = async (req, res, next) => {
    const { id } = req.params

    const user = await findById({
        model: userModel,
        id: id
    })

    if (!user) {
        throw new invalidCredentionals()
    }
    const messages = await messageModel.find({ to: user._id }).select('-to').populate([{
        path: "from",
        select: 'firstName lastName _id email profileImage.secure_url'
    }])

    return successHandler(res, { msg: "Done", data: messages })
}

export const deleteMessages = async (req, res, next) => {
    const user = req.user
    if (!user) {
        throw new invalidCredentionals()
    }
    const messages = await messageModel.find({ to: user._id })
    if (!messages) {
        throw new Error("no messages to delete")
    }

    await messageModel.deleteMany({ to: user._id })
    return successHandler(res, { msg: "messages deleted successfully" })
}