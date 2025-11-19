import { Router } from "express"
import * as messageServices from "./message.services.js"
import { auth } from "../../middleware/auth.middleware.js"
const router = Router({
    mergeParams: true
})

router.get('/', messageServices.getUserMessages)

router.post('/send-message/{:from}', messageServices.sendMessage)
router.get('/get-user-messages', auth(), messageServices.getMessages)
router.delete('/delete-user-messages', auth(), messageServices.deleteMessages)

export default router