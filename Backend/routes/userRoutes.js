import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser,  registerUser, updateProfile } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from "../middleware/multer.js"



const userRouter=express.Router()

// user Routers
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
// userRouter.post('/payment-razorpay',authUser,paymentRazorpay)



export default userRouter;