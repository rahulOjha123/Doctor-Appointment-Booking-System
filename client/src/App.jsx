import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import About from "./pages/About";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import Navs from "./component/Navs";
import { Routes, Route } from "react-router-dom";
import Footer from "./component/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>
      <Navs></Navs>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/doctor/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointment" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
