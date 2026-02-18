import express from 'express';
const router = express.Router()
import {changePassword, forgetPassword, loginUser, logoutUser, registerUser,verifyEmailToken, verifyOTP } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/isAuthenitcated.js';
import { userSchema, validateUser } from '../validators/user.validator.js';

router.route('/register').post( validateUser(userSchema) , registerUser) 
router.route('/verify').post(verifyEmailToken)
router.route('/login').post(loginUser)
router.route('/logout').post(isAuthenticated,logoutUser)
router.route('/forget-password').post(forgetPassword)
router.route('/verify-otp/:email').post(verifyOTP) 
router.route('/change-password').post(isAuthenticated,changePassword) 

export default router; 
   