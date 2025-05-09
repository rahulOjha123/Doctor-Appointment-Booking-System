import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'


// app config
const app=express()
const port =process.env.PORT || 8080;
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoing
app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter)
app.use("/api/user",userRouter)





// port number
app.listen(port,()=>{
    console.log(`Server is running  at port number ${port}`)
})