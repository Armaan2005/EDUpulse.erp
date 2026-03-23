import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
 FaPlusCircle,
 FaRegCalendarAlt,
 FaBullhorn,
 FaPaperPlane,
 FaSpinner,
 FaEye,
 FaListAlt,
 FaRegFileAlt
} from "react-icons/fa";

const Notices = () => {

 const [formData, setFormData] = useState({
  title: "",
  content: "",
  type: "",
  eventDate: "",
  issueDate: "",
 });

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const navigate = useNavigate();

 const noticeTypes = [
  { label: "Select Notice Type", value: "" },
  { label: "Important / Urgent Alert", value: "Important" },
  { label: "General Announcement", value: "General Announcement" },
  { label: "New Event / Program", value: "New Event" },
  { label: "Circular / Information", value: "Information" },
 ];

 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {

  e.preventDefault();
  setLoading(true);

  if (
   !formData.title ||
   !formData.content ||
   !formData.type ||
   !formData.eventDate ||
   !formData.issueDate
  ) {
   setError("All fields are required!");
   setLoading(false);
   return;
  }

  try {

   const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/addnotice`,
    formData,{
        headers: { Authorization: `Bearer ${Cookies.get('emtoken')}` },
        withCredentials: true
    }
   );

   if (response.status === 201) {

    setFormData({
     title: "",
     content: "",
     type: "",
     eventDate: "",
     issueDate: "",
    });

    navigate("/ViewNotices");
   }

  } catch (err) {

   console.error(err);
   setError("Error publishing notice");

  } finally {

   setLoading(false);

  }

 };

 return (

 <div className="min-h-screen flex items-center justify-center p-6 
 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

  <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl 
  p-10 w-full max-w-4xl border border-white/40">

   <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-gray-800">

    <FaBullhorn className="text-indigo-600 text-2xl"/>

    Publish Notice

   </h1>

   {error && (
    <p className="text-red-500 mb-4">{error}</p>
   )}

   <form onSubmit={handleSubmit}>

    <div className="grid md:grid-cols-2 gap-6">

     <div>

      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaListAlt className="text-indigo-500"/>
       Notice Type
      </label>

      <select
       name="type"
       value={formData.type}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >

       {noticeTypes.map((option) => (
        <option key={option.value} value={option.value} disabled={!option.value}>
         {option.label}
        </option>
       ))}

      </select>

     </div>


     <div>

      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaBullhorn className="text-indigo-500"/>
       Notice Title
      </label>

      <input
       type="text"
       name="title"
       value={formData.title}
       onChange={handleChange}
       placeholder="Annual Sports Day Announcement"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

     </div>

     <div>

      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaRegCalendarAlt className="text-indigo-500"/>
       Event / Last Date
      </label>

      <input
       type="date"
       name="eventDate"
       value={formData.eventDate}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

     </div>

     <div>

      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaRegCalendarAlt className="text-indigo-500"/>
       Publication Date
      </label>

      <input
       type="date"
       name="issueDate"
       value={formData.issueDate}
       onChange={handleChange}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

     </div>


     <div className="md:col-span-2">

      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaRegFileAlt className="text-indigo-500"/>
       Notice Content
      </label>

      <textarea
       name="content"
       value={formData.content}
       onChange={handleChange}
       rows="5"
       placeholder="Write the full notice content..."
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3 shadow-sm
       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      ></textarea>

     </div>

    </div>


    <button
     type="submit"
     disabled={loading}
     className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-600
     hover:from-indigo-600 hover:to-blue-700
     text-white px-8 py-3 rounded-xl flex items-center gap-3
     shadow-lg hover:shadow-xl transition-all"
    >

     {loading ? (
      <>
       <FaSpinner className="animate-spin"/>
       Publishing...
      </>
     ) : (
      <>
       <FaPaperPlane/>
       Publish Notice
      </>
     )}

    </button>

   </form>


   <div className="mt-6 text-gray-600">

    <Link
     to="/ViewNotices"
     className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
    >
     <FaEye/>
     View All Notices
    </Link>

   </div>

  </div>

 </div>

 );
};

export default Notices;