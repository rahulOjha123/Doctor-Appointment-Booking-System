import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "./../models/userModule.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "./../models/doctorModule.js";
import appointmentModel from "../models/appointmentModule.js";
import Razorpay from "razorpay";

// api to register user
const registerUser = async (req, resp) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return resp.json({
        success: false,
        message: "All Filed Are Required",
      });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return resp.json({
        success: false,
        message: "Email is Not Valide",
      });
    }
    // validating strong passwrod
    // if (!password.length <= 8) {
    //   return resp.json({
    //     success: false,
    //     message: "Enter a Strong password",
    //   })
    // }

    // hashing user passwrod
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    resp.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    resp.json({
      success: false,
      message: error.message,
    });
  }
};

// Api for user Login
const loginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    // email and pasword field checkd
    if (!email || !password) {
      return resp.json({
        success: false,
        message: "Both Field Are Required",
      });
    }

    if (!user) {
      return resp.json({
        success: false,
        message: "Invalid user and password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      resp.json({
        success: true,
        token,
        user,
      });
    } else {
      resp.json({
        success: false,
        message: "Invalid user and password",
      });
    }
  } catch (error) {
    console.log(error);
    resp.json({
      success: false,
      //   message: error.message,
      message: "internal server error in login page",
    });
  }
};

// api to get user profile data
const getProfile = async (req, resp) => {
  try {
    // const { userId } = req.body;
    const userId = req.user.id;

    const userData = await userModel.findById(userId).select("-password");

    resp.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    resp.json({
      success: false,
      message: error.message,
    });
  }
};

// api to update user profile
const updateProfile = async (req, resp) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    console.log("userId=", userId);
    console.log("userid=", name, phone, address, dob, gender);
    if (!name || !phone || !address || !dob || !gender) {
      return resp.json({
        success: false,
        message: "All Field Are Required",
      });
    }

    const newdata = await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      // address: JSON.parse(address),
      address: typeof address === "string" ? JSON.parse(address) : address,
      dob,
      gender,
    });
    console.log(newdata);

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    resp.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    resp.json({
      success: false,
      message: error.message,
    });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor not available",
      });
    }

    let slots_booked = docData.slot_booked || {};

    // checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "user not found" });
    }
    delete docData.slot_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Api to get user apintments for frontend my-appointments page

const listAppointment = async (req, res) => {
  try {
    // const {userId}=req.body
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to cancle appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;

    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user;
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

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

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
// api to make payment of appointment using razorpay
// const paymentRazorpay = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;
//     const appointmentData = await appointmentModel.findById(appointmentId);
//     if (!appointmentData || appointmentData.cancelled) {
//       return res.json({
//         success: false,
//         message: "Appointment Cancelled or not found",
//       });
//     }

//     // creating options for razorpay payment
//     const options = {
//       amount: appointmentData.amount * 100,
//       currency: process.env.CURRENCY,
//       receipt: appointmentId,
//     };
//     //creation of an order
//     const order =await razorpayInstance.orders.create(options);
//     res.json({ success: true, order });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
 
};
