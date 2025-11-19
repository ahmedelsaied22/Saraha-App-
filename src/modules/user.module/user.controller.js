import { Router } from "express"
import * as userServices from "./user.services.js"
const router = Router()
import messageRouter from '../message.module/message.controller.js'

router.use('/:id/messages', messageRouter)

router.get('/:id', userServices.getUserById)

export default router