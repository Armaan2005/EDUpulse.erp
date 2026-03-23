import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import {
  FaUserCircle,
  FaIdCard,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaCity,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchStudentProfile = async () => {
    setLoading(true);
    const token = cookie.get("token");

    if (!token) {
      setError("Authentication Required: Please log in to view your profile.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/studentprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setStudent(response.data.student);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to fetch student profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const updatestudentpersonal = () => {
    navigate("/updatestudentpersonal");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
        <div className="flex flex-col items-center gap-3 text-slate-700">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <p className="text-lg">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4">
        <div className="bg-red-100 border border-red-300 text-red-600 p-5 rounded-xl flex items-center gap-3 shadow">
          <FaExclamationCircle />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-8 flex justify-center items-start">
      {student ? (
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-xl rounded-3xl border border-slate-200 overflow-hidden transition duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 p-8 text-white">
            <div className="flex flex-col items-center gap-2">
              <FaUserCircle className="text-7xl drop-shadow-md" />
              <h2 className="text-3xl font-bold tracking-wide">
                {student.name || "N/A"}
              </h2>
              <p className="text-xs uppercase tracking-widest text-blue-100">
                Student
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700 border-b border-slate-200 pb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200 hover:shadow-md transition">
                  <FaIdCard className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-xs uppercase text-slate-500">
                      Student ID
                    </p>
                    <p className="font-semibold text-slate-800">
                      {student.id || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200 hover:shadow-md transition">
                  <FaEnvelope className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-xs uppercase text-slate-500">Email</p>
                    <p className="text-blue-600 font-semibold hover:underline">
                      {student.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200 hover:shadow-md transition">
                  <FaPhoneAlt className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-xs uppercase text-slate-500">Contact</p>
                    <p className="font-semibold text-slate-800">
                      {student.contact || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-700 border-b border-slate-200 pb-2">
                Address Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200 hover:shadow-md transition">
                  <FaCity className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-xs uppercase text-slate-500">City</p>
                    <p className="font-semibold text-slate-800">
                      {student.city || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200 hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <FaMapMarkedAlt className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        Address
                      </p>
                      <p className="font-semibold text-slate-800">
                        {student.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
                onClick={updatestudentpersonal}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-700">
          No Student Profile Found
        </div>
      )}
    </div>
  );
};

export default StudentProfile;