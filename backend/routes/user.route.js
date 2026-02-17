import express from 'express';
const router = express.Router()
import {forgetPassword, loginUser, logoutUser, registerUser,verifyEmailToken, verifyOTP } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/isAuthenitcated.js';

router.route('/register').post(registerUser)
router.route('/verify').post(verifyEmailToken)
router.route('/login').post(loginUser)
router.route('/logout').post(isAuthenticated,logoutUser)
router.route('/forget-password').post(forgetPassword)
router.route('/verify-otp/:email').post(verifyOTP) 
export default router; 
   