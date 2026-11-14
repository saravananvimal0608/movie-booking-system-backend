import express from 'express'
import { getUsers, registerUser, verifyOtp, loginSendOtp, loginVerifyOtp } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers)
router.post('/register', registerUser)
router.post('/verify-otp', verifyOtp)
router.post('/login', loginSendOtp)
router.post('/login/verify-otp', loginVerifyOtp)

export default router