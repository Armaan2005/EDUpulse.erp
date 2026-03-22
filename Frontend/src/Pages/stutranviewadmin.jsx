import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBusAlt, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import Cookies from "js-cookie";

const StudentTransportDetails = () => {

 const [students, setStudents] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const fetchStudentDetails = async () => {
  try {

   const response = await axios.get(
    "http://localhost:7000/viewallstudenttransport",{
      headers: {
        Authorization: `Bearer ${Cookies.get("emtoken")}`,
      },
      withCredentials: true,
    }
   );

   setStudents(response.data.stu || []);
   setLoading(false);

  } catch (err) {

   setError("Failed to fetch student transport data");
   setLoading(false);

  }
 };

 useEffect(() => {
  fetchStudentDetails();
 }, []);

 if (loading) {
  return (

   <div className="flex justify-center items-center h-screen
   bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

    <div className="flex items-center gap-3 text-indigo-600 text-lg font-semibold">
     <FaSpinner className="animate-spin"/>
     Loading transport data...
    </div>

   </div>

  );
 }

 if (error) {
  return (

   <div className="flex justify-center items-center h-screen
   bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

    <div className="text-red-500 flex items-center gap-2 text-lg">
     <FaExclamationTriangle/>
     {error}
    </div>

   </div>

  );
 }

 return (

 <div className="min-h-screen p-8
 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

  <div className="bg-white/70 backdrop-blur-lg shadow-2xl
  rounded-3xl border border-white/40 w-full overflow-hidden">


<div className="bg-gradient-to-r from-white via-purple-100 to-indigo-100
px-8 py-6 flex items-center gap-3 border-b border-purple-200">

 <FaBusAlt className="text-purple-600 text-xl"/>

 <h2 className="text-2xl font-semibold text-purple-700 tracking-wide">
  Student Transport Management
 </h2>

</div>



   {/* TABLE */}

   <div className="overflow-x-auto">

    <table className="w-full text-sm text-left">

     <thead className="bg-white/60 backdrop-blur
     text-gray-700 uppercase text-xs tracking-wider">

      <tr>

       <th className="px-6 py-4 font-semibold">Student Name</th>
       <th className="px-6 py-4 font-semibold">Student ID</th>
       <th className="px-6 py-4 font-semibold">Route</th>
       <th className="px-6 py-4 font-semibold">Stop</th>
       <th className="px-6 py-4 font-semibold">Arrival</th>
       <th className="px-6 py-4 font-semibold">Departure</th>
       <th className="px-6 py-4 font-semibold">Contact</th>
       <th className="px-6 py-4 font-semibold">Address</th>

      </tr>

     </thead>

     <tbody className="divide-y divide-gray-200">

      {students.map((student) => (

       <tr
        key={student.studentId}
        className="hover:bg-indigo-50 transition duration-200"
       >

        <td className="px-6 py-4 font-semibold text-gray-800">
         {student.studentName}
        </td>

        <td className="px-6 py-4 text-gray-600">
         {student.studentId}
        </td>

        <td className="px-6 py-4 text-indigo-600 font-medium">
         {student.Route}
        </td>

        <td className="px-6 py-4 text-gray-700">
         {student.Stop}
        </td>

        <td className="px-6 py-4 text-green-600 font-medium">
         {student.arrivalTime}
        </td>

        <td className="px-6 py-4 text-red-600 font-medium">
         {student.departureTime}
        </td>

        <td className="px-6 py-4 text-gray-700">
         {student.contactNumber}
        </td>

        <td className="px-6 py-4 text-gray-600">
         {student.address}
        </td>

       </tr>

      ))}

     </tbody>

    </table>

   </div>

  </div>

 </div>

 );
};

export default StudentTransportDetails;
