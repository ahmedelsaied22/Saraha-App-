import { Router } from "express";
const router = Router()
import * as authServices from './auth.services.js'
import { auth } from "../../middleware/auth.middleware.js";

router.post('/signup', authServices.signup)
router.post('/confirmEmail', authServices.confirmEmail)
router.post('/resendEmailOtp', authServices.resendOtp)

router.get('/login', authServices.login)
router.get('/getUserProfile', auth(), authServices.getUserProfile)
router.patch('/updateUser', authServices.updateUser)
router.get('/', authServices.refreshToken)

router.post('/forgetPassword', authServices.forgetPass)
router.post('/changePass', authServices.changePass)

export default router