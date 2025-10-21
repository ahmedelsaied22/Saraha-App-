import { Router } from "express";
const router = Router()
import * as userServices from './user.services.js'

router.post('/signup', userServices.signup)
router.get('/login', userServices.login)
router.get('/getAllUsers', userServices.getAllUsers)
router.patch('/updateUser', userServices.editUser)
router.delete('/deleteUser/:id', userServices.deleteUser)


export default router;