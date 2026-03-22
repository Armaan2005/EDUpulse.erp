import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import {
 FaBus,
 FaUserPlus,
 FaRoute,
 FaIdCard,
 FaPhone,
 FaEnvelope,
 FaCalendarAlt,
 FaMapMarkerAlt,
 FaPlayCircle,
 FaSpinner,
 FaCheckCircle,
 FaExclamationTriangle
} from "react-icons/fa";

const BASE_URL = "http://localhost:7000";

const DriverDetailsForm = () => {

 const [formData, setFormData] = useState({
  route: "",
  name: "",
  licenseNumber: "",
  phoneNumber: "",
  email: "",
  dateOfBirth: "",
  address: "",
  employmentStartDate: ""
 });

 const [routes, setRoutes] = useState([]);
 const [loading, setLoading] = useState(false);
 const [submitLoading, setSubmitLoading] = useState(false);
 const [error, setError] = useState("");
 const [successMessage, setSuccessMessage] = useState("");

 const token = Cookies.get("emtoken");

 useEffect(() => {

  const fetchRoutes = async () => {

   setLoading(true);

   try {

    const response = await axios.get(`${BASE_URL}/viewroutes`, {
     headers: { Authorization: `Bearer ${token}` },
     withCredentials: true
    });

    const availableRoutes = response.data.routes.map(
     route => route.routeNumber
    );

    setRoutes(availableRoutes);

   } catch (err) {

    setError("Error fetching routes.");

   } finally {

    setLoading(false);

   }

  };

  fetchRoutes();

 }, []);

 const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData(prev => ({
   ...prev,
   [name]: value
  }));

 };

 const handleSubmit = async (e) => {

  e.preventDefault();

  if (!token) {
   setError("You must be logged in to add a driver.");
   return;
  }

  setSubmitLoading(true);
  setError("");
  setSuccessMessage("");

  const driverData = {
   Route: formData.route,
   name: formData.name,
   licenseNumber: formData.licenseNumber,
   phoneNumber: formData.phoneNumber,
   email: formData.email,
   dateOfBirth: formData.dateOfBirth,
   address: formData.address,
   employmentStartDate: formData.employmentStartDate
  };

  try {

   const response = await axios.post(
    `${BASE_URL}/driverdetails`,
    driverData,
    {
     headers: { Authorization: `Bearer ${token}` },
     withCredentials: true
    }
   );

   setSuccessMessage(response.data.msg || "Driver added successfully!");

   setFormData({
    route: "",
    name: "",
    licenseNumber: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    employmentStartDate: ""
   });

  } catch (error) {

   setError(
    error.response
     ? error.response.data.msg
     : "Error adding driver."
   );

  } finally {

   setSubmitLoading(false);

  }

 };

 return (

 <div className="min-h-screen flex items-center justify-center p-6
 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

  <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl
  p-10 w-full max-w-4xl border border-white/40">

   <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-gray-800">
    <FaUserPlus className="text-indigo-600 text-2xl"/>
    Add New Driver
   </h1>

   {loading ? (

    <div className="flex items-center gap-3 text-indigo-600">
     <FaSpinner className="animate-spin"/>
     Fetching routes...
    </div>

   ) : (

   <form onSubmit={handleSubmit}>

    <div className="grid md:grid-cols-2 gap-6">

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaRoute className="text-indigo-500"/> Route Assignment
      </label>

      <select
       name="route"
       value={formData.route}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
       <option value="">Select Route</option>

       {routes.map((route,index)=>(
        <option key={index} value={route}>
         {route}
        </option>
       ))}

      </select>
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaUserPlus className="text-indigo-500"/> Full Name
      </label>

      <input
       type="text"
       name="name"
       value={formData.name}
       onChange={handleChange}
       placeholder="Driver Name"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaIdCard className="text-indigo-500"/> License Number
      </label>

      <input
       type="text"
       name="licenseNumber"
       value={formData.licenseNumber}
       onChange={handleChange}
       placeholder="DL1234567890"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaPhone className="text-indigo-500"/> Phone Number
      </label>

      <input
       type="tel"
       name="phoneNumber"
       value={formData.phoneNumber}
       onChange={handleChange}
       placeholder="9876543210"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaEnvelope className="text-indigo-500"/> Email
      </label>

      <input
       type="email"
       name="email"
       value={formData.email}
       onChange={handleChange}
       placeholder="example@email.com"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaCalendarAlt className="text-indigo-500"/> Date of Birth
      </label>

      <input
       type="date"
       name="dateOfBirth"
       value={formData.dateOfBirth}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaPlayCircle className="text-indigo-500"/> Employment Start
      </label>

      <input
       type="date"
       name="employmentStartDate"
       value={formData.employmentStartDate}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div className="md:col-span-2">
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaMapMarkerAlt className="text-indigo-500"/> Address
      </label>

      <textarea
       name="address"
       value={formData.address}
       onChange={handleChange}
       rows="3"
       placeholder="Full residential address"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

    </div>

    {error && (
     <div className="flex items-center gap-2 text-red-500 mt-4">
      <FaExclamationTriangle/>
      {error}
     </div>
    )}

    {successMessage && (
     <div className="flex items-center gap-2 text-green-600 mt-4">
      <FaCheckCircle/>
      {successMessage}
     </div>
    )}


    <button
     type="submit"
     disabled={submitLoading}
     className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-600
     hover:from-indigo-600 hover:to-blue-700
     text-white px-8 py-3 rounded-xl flex items-center gap-3
     shadow-lg hover:shadow-xl transition-all"
    >

     {submitLoading ? (
      <>
       <FaSpinner className="animate-spin"/>
       Adding Driver...
      </>
     ) : (
      <>
       <FaBus/>
       Add Driver
      </>
     )}

    </button>

   </form>

   )}

  </div>

 </div>

 );

};

export default DriverDetailsForm;