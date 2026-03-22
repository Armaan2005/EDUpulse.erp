import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
 FaBus,
 FaGasPump,
 FaWrench,
 FaRoute,
 FaCalendarAlt,
 FaCheckCircle,
 FaExclamationCircle,
 FaSpinner
} from "react-icons/fa";

const BusConditionUpdate = () => {

 const [busNo, setBusNo] = useState("");
 const [size, setSize] = useState("");
 const [fuelCapacity, setFuelCapacity] = useState("");
 const [currentFuel, setCurrentFuel] = useState("");
 const [routeNo, setRoute] = useState("");
 const [busType, setBusType] = useState("");
 const [mileage, setMileage] = useState("");
 const [lastRefuelDate, setLastRefuelDate] = useState("");
 const [lastMaintenanceDate, setLastMaintenanceDate] = useState("");
 const [status, setStatus] = useState("active");

 const [routes, setRoutes] = useState([]);
 const [loading, setLoading] = useState(false);
 const [fetchLoading, setFetchLoading] = useState(true);
 const [error, setError] = useState("");
 const [successMessage, setSuccessMessage] = useState("");

 const token = Cookies.get("emtoken");

 useEffect(() => {
  if (!token) {
   setError("You are not authenticated. Please log in.");
  } else {
   fetchRoutes();
  }
 }, [token]);

 const fetchRoutes = async () => {
  try {
   const response = await axios.get("http://localhost:7000/viewroutes", {
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
   setFetchLoading(false);
  }
 };

 const handleSubmit = async (e) => {

  e.preventDefault();

  if (!token) {
   setError("You are not authenticated. Please log in.");
   return;
  }

  setLoading(true);
  setError("");
  setSuccessMessage("");

  try {

   await axios.post(
    "http://localhost:7000/conditionupdate",
    {
     busNo,
     size,
     fuelCapacity: Number(fuelCapacity),
     currentFuel: Number(currentFuel),
     routeNo,
     busType,
     mileage: Number(mileage),
     lastRefuelDate,
     lastMaintenanceDate,
     status,
    },
    {
     headers: { Authorization: `Bearer ${token}` },
     withCredentials: true,
    }
   );

   setSuccessMessage("Transport condition updated successfully!");

   setBusNo("");
   setSize("");
   setFuelCapacity("");
   setCurrentFuel("");
   setRoute("");
   setBusType("");
   setMileage("");
   setLastRefuelDate("");
   setLastMaintenanceDate("");
   setStatus("active");

  } catch (err) {

   const errMsg =
    err.response?.data?.message ||
    "Error updating transport condition.";

   setError(errMsg);

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
    Update Transport Condition
   </h1>

   {fetchLoading ? (
    <div className="flex items-center gap-3 text-indigo-600 mb-6">
     <FaSpinner className="animate-spin"/>
     Loading routes...
    </div>
   ) : (

   <>

   {error && (
    <div className="flex items-center gap-2 text-red-500 mb-4">
     <FaExclamationCircle/>
     {error}
    </div>
   )}

   {successMessage && (
    <div className="flex items-center gap-2 text-green-600 mb-4">
     <FaCheckCircle/>
     {successMessage}
    </div>
   )}

   <form onSubmit={handleSubmit}>

    <div className="grid md:grid-cols-2 gap-6">

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaBus className="text-indigo-500"/> Bus Number
      </label>

      <input
       type="text"
       value={busNo}
       onChange={(e)=>setBusNo(e.target.value)}
       placeholder="HR01-AB-1234"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaRoute className="text-indigo-500"/> Route Number
      </label>

      <select
       value={routeNo}
       onChange={(e)=>setRoute(e.target.value)}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
       <option value="">Select Route</option>
       {routes.map((route, index) => (
        <option key={index} value={route}>
         {route}
        </option>
       ))}
      </select>
     </div>

     <div>
      <label className="text-gray-700 mb-2 font-medium">Size</label>

      <input
       type="text"
       value={size}
       onChange={(e)=>setSize(e.target.value)}
       placeholder="52 Seater"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="text-gray-700 mb-2 font-medium">Bus Type</label>

      <input
       type="text"
       value={busType}
       onChange={(e)=>setBusType(e.target.value)}
       placeholder="AC / Non AC"
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaGasPump className="text-indigo-500"/> Fuel Capacity
      </label>

      <input
       type="number"
       value={fuelCapacity}
       onChange={(e)=>setFuelCapacity(e.target.value)}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaGasPump className="text-indigo-500"/> Current Fuel
      </label>

      <input
       type="number"
       value={currentFuel}
       onChange={(e)=>setCurrentFuel(e.target.value)}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="text-gray-700 mb-2 font-medium">Mileage</label>

      <input
       type="number"
       value={mileage}
       onChange={(e)=>setMileage(e.target.value)}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaCalendarAlt className="text-indigo-500"/> Last Refuel
      </label>

      <input
       type="date"
       value={lastRefuelDate}
       onChange={(e)=>setLastRefuelDate(e.target.value)}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
       <FaWrench className="text-indigo-500"/> Last Maintenance
      </label>

      <input
       type="date"
       value={lastMaintenanceDate}
       onChange={(e)=>setLastMaintenanceDate(e.target.value)}
       required
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
     </div>

     <div>
      <label className="text-gray-700 mb-2 font-medium">Bus Status</label>

      <select
       value={status}
       onChange={(e)=>setStatus(e.target.value)}
       className="w-full border border-gray-200 bg-white/80 rounded-xl px-4 py-3
       shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
       <option value="active">Active</option>
       <option value="under maintenance">Under Maintenance</option>
       <option value="off-duty">Off Duty</option>
      </select>
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
       Updating...
      </>
     ) : (
      <>
       <FaBus/>
       Update Bus Condition
      </>
     )}

    </button>

   </form>

   </>

   )}

  </div>

 </div>

 );
};

export default BusConditionUpdate;