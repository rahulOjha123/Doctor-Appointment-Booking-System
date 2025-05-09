import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "./../models/doctorModule.js";
import validator from "validator";
import jwt from "jsonwebtoken"
import appointmentModel from './../models/appointmentModule.js';
import userModel from './../models/userModule.js';


// API for adding doctor
const addDoctor = async (req, resp) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      
    } = req.body;
    const imageFile = req.file;
    console.log("hello=", imageFile);
    // checking for all data add to doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return resp.json({ success: false, message: "Missing Details" });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return resp.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return resp.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload =await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
    const imageUrl=imageUpload.secure_url

    const doctorData = {
      name,
      email,
      image:imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address), // coder added but i did not added
      // address,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    resp.json({
      success: true,
      message: "Doctor Added",
    });
  } catch (error) {
    console.log(error);
    resp.json({
      success: false,
      messages: error.message,
      message: "internal server error",
    });
  }
};

// api for admin Login
const loginAdmin = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      const token=jwt.sign(email+password,process.env.JWT_SECRET)
      resp.json({
        success:true,
        token,
      })
    }else{
      resp.json({
        success:false,
        message:"Invalide credentails"
      })
    }
  } catch (error) {
    console.log(error);
    resp.json({
      success: false,
      message: error.message,
    });
  }
};

// Api to get all doctor list for admin panel

const allDoctors=async(req,resp)=>{
  try {
    const doctors=await doctorModel.find({}).select(`-password`)
    resp.json({
      success:true,
      doctors
    })
   
  } catch (error) {
    console.log(error)
    resp.json({success:false,message:error.message})
  }
}

// Api to get all appointment list
const appointmentsAdmin=async(req,res)=>{
  try {
    const appointments=await appointmentModel.find({})
    res.json({success:true,appointments})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// api for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
  

    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    // relasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slot_booked || {};

    if (!Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get dashboard data for admin panel
const adminDashboard=async(req,res)=>{
  try {

    const doctors=await doctorModel.find({})
    const users= await userModel.find({})
    const appointments=await appointmentModel.find({})

    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)

    }
    res.json({success:true,dashData})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
export { addDoctor, loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard };
