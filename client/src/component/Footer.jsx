import React from "react";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="md:mx-10">
      <div className="flex dlex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ===============left section========== */}
        <div>
          <img className="mb-5 w-10" src={assets.logo} alt="footerImg" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione,
            sunt blanditiis facere officia itaque minus deleniti inventore eius
            incidunt libero accusamus dolores. Alias officia repellat nisi
            ratione blanditiis, ipsa recusandae!
          </p>
        </div>
        {/* ===============center section========== */}
        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap text-gray-600">
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        {/* ===============right section========== */}
        <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap text-gray-600">
                <li>+1-212-453-78900</li>
                <li>greatstackdev@gmail.com</li>
            </ul>
        </div>
      </div>
      {/* ======================copyright========== */}
        <div>
                <hr />
                <p className="py-5 text-sm text-center">Copyright 2025@ Prescripto -All Right Reserved.</p>
        </div>
    </div>
  );
}

export default Footer;
