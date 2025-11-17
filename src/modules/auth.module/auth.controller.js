import { Router } from "express";
const router = Router()
import * as authServices from './auth.services.js'
import { allowTo, auth } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as authValidation from '../auth.module/auth.validation.js'
import { role } from "../../DB/models/user.model.js";
import { uploadFile } from "../../utils/multer/multer.local.js";
import { uploadFileToCloudinary } from "../../utils/multer/multer.cloud.js";

router.post('/signup', validation(authValidation.signupSchema), authServices.signup)
router.post('/confirmEmail', validation(authValidation.confirmEmailSchema), authServices.confirmEmail)
router.post('/resendEmailOtp', validation(authValidation.resendEmailOTPSchema), authServices.resendOtp)

router.get('/login', validation(authValidation.loginSchema), authServices.login)
router.get('/share-profile', auth(), authServices.shareProfile)
router.get('/getUserProfile', auth(), authServices.getUserProfile)
router.patch('/updateUser', authServices.updateUser)

router.get('/', authServices.refreshToken)

router.post('/forgetPassword', authServices.forgetPass)
router.post('/changePass', authServices.changePass)
router.patch('/change-email', auth(), authServices.changeEmail)
router.patch('/confirm-new-email', auth(), authServices.confirmNewEmail)

router.patch('/soft-delete/:id', auth(), allowTo(role.admin), authServices.softDelete)
router.patch('/restore-user/:id', auth(), allowTo(role.admin), authServices.restoreUser)
router.delete('/hard-delete', auth(), authServices.hardDelete)


router.patch('/profile-image'
    , auth()
    , validation(authValidation.uploadFileSchema)
    , uploadFile('profile-images')
        .single('profileImage')
    , authServices.profileImage)

router.patch('/profile-image-cloudinary'
    , auth()
    , validation(authValidation.uploadFileSchema)
    , uploadFileToCloudinary()
        .single('image')
    , authServices.profileImageToCloud)

router.patch('/cover-images'
    , auth()
    , validation(authValidation.uploadFileSchema)
    , uploadFileToCloudinary()
        .array('coverImages', 5)
    , authServices.coverImageToCloud)


export default router