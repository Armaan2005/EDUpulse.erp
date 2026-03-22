import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaChevronDown,
  FaChevronUp,
  FaBook,
  FaStar,
  FaBullhorn,
  FaGraduationCap
} from "react-icons/fa";

const ViewAssFeed = () => {
  const [feedback, setFeedback] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Please login to view feedback");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:7000/viewassfeedback", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setFeedback(res.data.feedback || []);
      } catch {
        setError("Unable to load feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <p className="text-lg text-gray-700 flex items-center gap-2">
        <FaStar className="animate-spin text-blue-500" /> Loading Feedback...
      </p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <p className="text-red-600 text-lg flex items-center gap-2">
        <FaBullhorn /> {error}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex flex-col items-center">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaGraduationCap className="text-blue-500" /> Assignment Feedback
      </h1>

      {feedback.length === 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl text-center text-gray-600">
          No feedback available
        </div>
      )}

      <div className="w-full max-w-2xl space-y-4">
        {feedback.map((fb, index) => (
          <div
            key={fb._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
          >
            <div
              className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gradient-to-r from-blue-100 to-cyan-100"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FaBook className="text-blue-500" /> Assignment ID: {fb.assign}
              </div>

              <div className="flex items-center gap-2 text-yellow-500 font-semibold">
                <FaStar /> {fb.marks}
              </div>

              {openIndex === index ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
            </div>

            {/* Accordion Body */}
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-gray-200 space-y-2 text-gray-700">
                <p><strong>Student Name:</strong> {fb.stuName}</p>
                <p><strong>Email:</strong> {fb.stuEmail}</p>

                <div className="mt-2 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg flex items-start gap-2">
                  <FaBullhorn className="text-blue-500 mt-1" />
                  <div>
                    <strong>Feedback:</strong>
                    <p className="mt-1 text-gray-700">{fb.feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAssFeed;