import React, { useState } from "react";
import axios from "axios";
import { FaBus, FaPlus, FaTimes, FaClock, FaSpinner } from "react-icons/fa";
import Cookies from "js-cookie";

function AddRoutes() {

 const [formData, setFormData] = useState({
  routeNumber: "",
  startTime: "",
  endTime: "",
  stops: [{ stopName: "", arrivalTime: "", departureTime: "" }]
 });

 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState("");
 const [error, setError] = useState("");

 const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData(prev => ({
   ...prev,
   [name]: value
  }));

  setError("");
  setMessage("");
 };

 const handleStopChange = (e, index) => {

  const { name, value } = e.target;

  const updatedStops = [...formData.stops];
  updatedStops[index][name] = value;

  setFormData(prev => ({
   ...prev,
   stops: updatedStops
  }));

 };

 const addStop = () => {

  if (formData.stops.length < 10) {

   setFormData(prev => ({
    ...prev,
    stops: [...prev.stops, { stopName: "", arrivalTime: "", departureTime: "" }]
   }));

  } else {

   setError("Maximum 10 stops allowed.");

  }

 };

 const removeStop = (index) => {

  if (formData.stops.length > 1) {

   const updatedStops = formData.stops.filter((_, i) => i !== index);

   setFormData(prev => ({
    ...prev,
    stops: updatedStops
   }));

  }

 };

 const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);
  setError("");
  setMessage("");

  try {

   const response = await axios.post(
    "http://localhost:7000/addroute",
    formData,
    {
     headers: {
      Authorization: `Bearer ${Cookies.get("emtoken")}`
     },
     withCredentials: true
    }
   );

   if (response.status === 200) {

    setMessage(`Route ${formData.routeNumber} added successfully!`);

    setFormData({
     routeNumber: "",
     startTime: "",
     endTime: "",
     stops: [{ stopName: "", arrivalTime: "", departureTime: "" }]
    });

   }

  } catch (err) {

   setError("Failed to add route.");

  } finally {

   setLoading(false);

  }

 };

 return (

 <div className="min-h-screen flex items-center justify-center p-6
 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

  <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl
  p-10 w-full max-w-5xl border border-white/40">

   <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-gray-800">
    <FaBus className="text-indigo-600 text-2xl"/>
    Add New Bus Route
   </h1>

   {message && (
    <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4">
     {message}
    </div>
   )}

   {error && (
    <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4">
     {error}
    </div>
   )}

   <form onSubmit={handleSubmit}>

    <div className="mb-8">

     <h2 className="text-lg font-semibold text-gray-700 mb-4">
      Route Information
     </h2>

     <div className="grid md:grid-cols-3 gap-6">

      <div>
       <label className="block text-gray-700 font-medium mb-1">
        Route Number
       </label>

       <input
        type="text"
        name="routeNumber"
        value={formData.routeNumber}
        onChange={handleChange}
        placeholder="R001"
        required
        className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-indigo-400"
       />
      </div>

      <div>
       <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
        Start Time <FaClock/>
       </label>

       <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        required
        className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-indigo-400"
       />
      </div>

      <div>
       <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
        End Time <FaClock/>
       </label>

       <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        required
        className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-indigo-400"
       />
      </div>

     </div>

    </div>


    <div className="mb-6">

     <h2 className="text-lg font-semibold text-gray-700 mb-4">
      Route Stops ({formData.stops.length})
     </h2>

     <div className="flex flex-col gap-4">

      {formData.stops.map((stop, index) => (

       <div
        key={index}
        className="bg-white/80 rounded-2xl p-5 shadow-md border border-gray-100 relative"
       >

        <h3 className="font-semibold text-gray-700 mb-3">
         Stop {index + 1}
        </h3>

        {formData.stops.length > 1 && (
         <button
          type="button"
          onClick={() => removeStop(index)}
          className="absolute top-3 right-3 bg-red-400 hover:bg-red-500 text-white p-2 rounded-full"
         >
          <FaTimes/>
         </button>
        )}

        <div className="grid md:grid-cols-3 gap-4">

         <input
          type="text"
          name="stopName"
          value={stop.stopName}
          onChange={(e)=>handleStopChange(e,index)}
          placeholder="Stop Name"
          required
          className="border border-gray-200 rounded-xl px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
         />

         <input
          type="time"
          name="arrivalTime"
          value={stop.arrivalTime}
          onChange={(e)=>handleStopChange(e,index)}
          required
          className="border border-gray-200 rounded-xl px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
         />

         <input
          type="time"
          name="departureTime"
          value={stop.departureTime}
          onChange={(e)=>handleStopChange(e,index)}
          required
          className="border border-gray-200 rounded-xl px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
         />

        </div>

       </div>

      ))}

     </div>

     <button
      type="button"
      onClick={addStop}
      className="mt-4 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600
      text-white px-5 py-2 rounded-xl shadow-md"
     >
      <FaPlus/>
      Add Stop
     </button>

    </div>

    <button
     type="submit"
     disabled={loading}
     className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-blue-600
     hover:from-indigo-600 hover:to-blue-700
     text-white py-3 rounded-xl font-semibold
     flex justify-center items-center gap-3 shadow-lg"
    >

     {loading ? (
      <>
       <FaSpinner className="animate-spin"/>
       Adding Route...
      </>
     ) : (
      "Confirm & Add Route"
     )}

    </button>

   </form>

  </div>

 </div>

 );

}

export default AddRoutes;