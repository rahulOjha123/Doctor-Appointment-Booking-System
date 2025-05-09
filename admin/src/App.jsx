import React, { useContext } from "react";
import "./App.css";
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext.jsx";
import NavBar from "./component/NavBar.jsx";
import SideBar from "./component/SideBar.jsx";
import { Routes, Route } from "react-router-dom";
import Dasboard from "./pages/Admin/Dasboard.jsx";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorList from "./pages/Admin/DoctorList.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

function App() {
  const { aToken } = useContext(AdminContext);
  const {dToken}=useContext(DoctorContext)

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <NavBar />
      <div className="flex items-start">
        <SideBar />
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dasboard" element={<Dasboard></Dasboard>} />
          <Route path="/all-appointments" element={<AllAppointments/>} />
          <Route path="/add-doctor" element={<AddDoctor/>} />
          <Route path="/doctor-list" element={<DoctorList/>} />

          {/* Doctor Route */}
          <Route path="/doctor-dashboard"element={<DoctorDashboard/>} />
          <Route path="/doctor-appointments"element={<DoctorAppointment/>} />
          <Route path="/doctor-profile"element={<DoctorProfile/>} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <div>
        <Login />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
