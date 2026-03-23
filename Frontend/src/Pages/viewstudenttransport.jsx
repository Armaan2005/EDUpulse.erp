import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewStudentTransportDetails = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentTransportDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/viewstudenttransport`
        );
        setStudentData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching student transport details");
        setLoading(false);
      }
    };

    fetchStudentTransportDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-2xl">
        Loading Transport Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-400 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-10">

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            🚍 Student Transport
          </h1>

          <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg">
            Total Students: {studentData.length}
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">

            <thead>
              <tr className="bg-indigo-600 text-white text-left">

                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Parent</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Stop</th>
                <th className="px-6 py-3">Arrival</th>
                <th className="px-6 py-3">Departure</th>

              </tr>
            </thead>

            <tbody>

              {studentData.map((student, index) => (

                <tr
                  key={student._id}
                  className={`border-b hover:bg-indigo-50 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >

                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {student.studentName}
                  </td>

                  <td className="px-6 py-4">{student.studentAge}</td>

                  <td className="px-6 py-4">{student.rollNo}</td>

                  <td className="px-6 py-4">{student.grade}</td>

                  <td className="px-6 py-4">{student.contactNumber}</td>

                  <td className="px-6 py-4">{student.parentName}</td>

                  <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {student.assignedRoute}
                    </span>
                  </td>

                  <td className="px-6 py-4">{student.assignedStop}</td>

                  <td className="px-6 py-4">{student.arrivalTime}</td>

                  <td className="px-6 py-4">{student.departureTime}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ViewStudentTransportDetails;
