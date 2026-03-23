import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import {
 FaUser,
 FaEnvelope,
 FaLock,
 FaPhone,
 FaCity,
 FaMapMarkerAlt,
 FaBuilding,
 FaImage,
 FaUserPlus,
 FaSpinner
} from "react-icons/fa";

const Registration = () => {

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  address: "",
  contact: "",
  city: "",
  image: "",
  department: "",
 });

 

 const [dept, setDept] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);

 const navigate = useNavigate();

 const handleChange = (e) => {
  if (e.target.name === "image") {
   setFormData({ ...formData, image: e.target.files[0] });
  } else {
   setFormData({ ...formData, [e.target.name]: e.target.value });
  }
 };

 const fetchDept = async () => {
  setLoading(true);
  try {
   const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewdepartment`,{
    headers: {
        Authorization: `Bearer ${Cookies.get('emtoken')}`,
    },
    withCredentials: true,
   });
   setDept(response.data.dept || []);
  } catch (err) {
   setError("Failed to fetch department data");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchDept();
 }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");

  try {

   const data = new FormData();
   for (const key in formData) {
    data.append(key, formData[key]);
   }

   const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/staffregister`,
    data,
    { headers: { Authorization: `Bearer ${Cookies.get("emtoken")}`, "Content-Type": "multipart/form-data" },
withCredentials: true }
   );

   if (response.status === 201) {

    setFormData({
     name: "",
     email: "",
     address: "",
     contact: "",
     city: "",
     image: "",
     department: "",
    });

    navigate("/dashboard");
   }

  } catch (err) {
   setError("Registration failed! Please check details.");
  } finally {
   setIsSubmitting(false);
  }
 };

 const imagePreview = formData.image
  ? URL.createObjectURL(formData.image)
  : null;

 return (

 <div className="min-h-screen flex items-center justify-center p-6 
 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

  <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl 
  p-10 w-full  max-w-4xl border border-white/40">

   <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-gray-800">
    <FaUserPlus className="text-indigo-600 text-2xl"/>
    Staff Registration
   </h1>

   {error && (
    <p className="text-red-500 mb-4">{error}</p>
   )}

   <form onSubmit={handleSubmit}>

    <div className="grid md:grid-cols-2 gap-6">

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaUser className="text-indigo-500"/> Full Name
      </label>

      <input
       type="text"
       name="name"
       value={formData.name}
       onChange={handleChange}
       placeholder="Enter full name"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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
       placeholder="Enter email"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>


     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaPhone className="text-indigo-500"/> Contact
      </label>

      <input
       type="number"
       name="contact"
       value={formData.contact}
       onChange={handleChange}
       placeholder="Phone number"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaBuilding className="text-indigo-500"/> Department
      </label>

      <select
       name="department"
       value={formData.department}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
       <option value="">Select Department</option>

       {dept.map((d) => (
        <option key={d._id} value={d.departId}>
         {d.departName}
        </option>
       ))}
      </select>
     </div> 

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaCity className="text-indigo-500"/> City
      </label>

      <input
       type="text"
       name="city"
       value={formData.city}
       onChange={handleChange}
       placeholder="Enter city"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaImage className="text-indigo-500"/> Profile Image
      </label>

      <input
       type="file"
       name="image"
       accept="image/*"
       onChange={handleChange}
      />

      <div className="mt-3 p-4 border-2 border-dashed border-indigo-200 
      rounded-xl text-center bg-white/60">

       {imagePreview ? (
        <img
         src={imagePreview}
         alt="preview"
         className="mx-auto w-32 rounded-lg shadow"
        />
       ) : (
        <p className="text-gray-400 text-sm">
         No Image Selected
        </p>
       )}

      </div>
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
       placeholder="Full Address"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      ></textarea>
     </div>

    </div>

    <button
     type="submit"
     disabled={isSubmitting}
     className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-600
     hover:from-indigo-600 hover:to-blue-700
     text-white px-8 py-3 rounded-xl flex items-center gap-3
     shadow-lg hover:shadow-xl transition-all"
    >

     {isSubmitting ? (
      <>
       <FaSpinner className="animate-spin"/>
       Registering...
      </>
     ) : (
      <>
       <FaUserPlus/>
       Register Staff
      </>
     )}

    </button>

   </form>

  </div>

 </div>

 );
};

export default Registration;

