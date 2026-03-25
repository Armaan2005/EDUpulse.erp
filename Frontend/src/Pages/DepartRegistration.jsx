import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import {
  FaBuilding,
  FaSave,
  FaChevronLeft,
  FaSpinner
} from "react-icons/fa";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const DeptRegistration = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departId: "",
    departName: "",
    departDescription: ""
  });

  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSubmitMessage("");

    try {

      const response = await axios.post(
        `${BASE_URL}/adddepartment`,
        formData,{
          headers: {
            Authorization: `Bearer ${Cookies.get("emtoken")}`
          },
          withCredentials: true
        }
      );

      if (response.status === 201) {

        setSubmitMessage("Department registered successfully!");

        setFormData({
          departId: "",
          departName: "",
          departDescription: ""
        });

        setTimeout(() => {
          navigate("/viewdepartments");
        }, 1500);

      }

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Department registration failed";

      setSubmitMessage(msg);

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center p-6
    bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

      <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl
      p-10 w-full max-w-3xl border border-white/40">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
            <FaBuilding className="text-indigo-600 text-2xl"/>
            Department Registration
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600
            hover:text-indigo-600 transition"
          >
            <FaChevronLeft/>
            Back
          </button>

        </div>

        {submitMessage && (
          <div className="mb-6 text-sm text-center text-indigo-600 font-medium">
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6">

            <div>

              <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                <FaBuilding className="text-indigo-500"/>
                Department ID
              </label>

              <input
                type="number"
                name="departId"
                value={formData.departId}
                onChange={handleChange}
                placeholder="e.g. 101"
                required
                className="w-full border border-gray-200 bg-white/80
                rounded-xl px-4 py-3 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />

            </div>


            <div>

              <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                <FaBuilding className="text-indigo-500"/>
                Department Name
              </label>

              <input
                type="text"
                name="departName"
                value={formData.departName}
                onChange={handleChange}
                placeholder="Computer Science Engineering"
                required
                className="w-full border border-gray-200 bg-white/80
                rounded-xl px-4 py-3 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />

            </div>


            <div>

              <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                <FaBuilding className="text-indigo-500"/>
                Department Description
              </label>

              <textarea
                name="departDescription"
                value={formData.departDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description about the department..."
                required
                className="w-full border border-gray-200 bg-white/80
                rounded-xl px-4 py-3 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />

            </div>

          </div>

          {/* Submit Button */}

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
                Saving...
              </>
            ) : (
              <>
                <FaSave/>
                Register Department
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default DeptRegistration;