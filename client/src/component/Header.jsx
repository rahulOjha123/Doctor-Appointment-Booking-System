import React from "react";
import Appointment from "./../pages/Appointment";
import { assets } from "../assets/assets";

function Header() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/* ==========left side========= */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[5vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br />
          With Trousted Doctors
        </p>
        <div className="flex   items-center gap-3 text-white text-sm font-light">
          <img  className="w-48"src={assets.group_profile_img} alt="group-profile"style={{width:"40px"}} />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" /> schedule your appointment hassle-free.
          </p>
        </div>
        <a href="#speciality"className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm  md:m-0 hover:scale-105 transition-all duration-300">Book Appointment</a>
      </div>
      {/* ==============right side ========= */}
      <div className="md:w-1/2 relative">
        <img className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src="https://media.gettyimages.com/id/1864700127/photo/group-of-doctors-and-nurses-attending-healthcare-seminar.jpg?s=612x612&w=0&k=20&c=xPOBsGuokqjR-qoMrCBsTbynhBUBbt_43SapZ33EOjI="
          alt="homeImg"
        />
      </div>
    </div>
  );
}

export default Header;
