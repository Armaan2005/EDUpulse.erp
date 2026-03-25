import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewfeedback`,{
            headers: {
              Authorization: `Bearer ${Cookies.get("emtoken")}`,
            },
            withCredentials: true,
        });
        setFeedbacks(res.data.feedback || []);
      } catch {
        setError("Unable to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbacks.length
        ).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Loading feedback...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-10">

      
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Feedback Dashboard
        </h1>
      </div>

    
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm">Total Feedback</h3>
          <p className="text-3xl font-bold text-gray-800">
            {feedbacks.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm">Average Rating</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {avgRating} / 10
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm">Latest Feedback</h3>
          <p className="text-lg text-gray-700">
            {feedbacks.length > 0
              ? formatDate(feedbacks[0].createdAt)
              : "N/A"}
          </p>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {feedbacks.map((fb, index) => {
          const ratingColor =
            fb.rating >= 8
              ? "bg-green-100 text-green-700"
              : fb.rating >= 5
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700";

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 font-medium">
                  {fb.category || "General"}
                </span>

                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${ratingColor}`}
                >
                  {fb.rating}/10
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {fb.comment || "No comment provided."}
              </p>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Anonymous</span>
                <span>{formatDate(fb.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewFeedback;