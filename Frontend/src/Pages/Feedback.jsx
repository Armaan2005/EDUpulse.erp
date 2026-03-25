import React, { useState, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FaPaperPlane,
  FaStar,
  FaSmile,
  FaMeh,
  FaFrown
} from "react-icons/fa";

const Feedback = () => {

  const [rating, setRating] = useState(7);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentRatingText = useMemo(() => {
    if (rating <= 3) return "Needs Serious Improvement";
    if (rating <= 6) return "Average / Neutral";
    if (rating <= 8) return "Good Experience";
    return "Excellent! Highly Satisfied";
  }, [rating]);

  const sliderColor = useMemo(() => {
    if (rating <= 3) return "accent-red-500";
    if (rating <= 6) return "accent-yellow-500";
    if (rating <= 8) return "accent-blue-500";
    return "accent-green-500";
  }, [rating]);

  const ratingIcon = useMemo(() => {
    if (rating <= 3) return <FaFrown className="text-red-500 text-xl" />;
    if (rating <= 6) return <FaMeh className="text-yellow-500 text-xl" />;
    return <FaSmile className="text-green-500 text-xl" />;
  }, [rating]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!category || !comment) {
      setError("Please select a category and provide a detailed comment.");
      return;
    }

    if (comment.length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    const feedbackData = {
      rating: parseInt(rating),
      comment,
      category,
    };

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/addfeedback`,
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("emtoken")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {

        setSuccessMessage(
          "Thank you! Your feedback has been successfully submitted."
        );

        setRating(7);
        setComment("");
        setCategory("");

      } else {
        setError(response.data.message || "Submission failed.");
      }

    } catch (err) {

      console.error(err);
      setError("There was an error submitting feedback.");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">

      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200 p-10">


        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-2">
            <FaStar className="text-yellow-500" />
             Share Your Experience
          </h1>


        </div>

        {(error || successMessage) && (

          <div
            className={`mb-6 p-4 rounded-lg text-sm font-medium ${
              error
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {error || successMessage}
          </div>

        )}

        <form onSubmit={handleSubmit} className="space-y-7">


          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Department / Area *
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >

              <option value="" disabled>Select department</option>

              <option value="Computer Science">Computer Science Engineering</option>

              <option value="Electronics">Electronics & Communication</option>

              <option value="Mechanical">Mechanical Engineering</option>

              <option value="Civil">Civil Engineering</option>

              <option value="Electrical">Electrical Engineering</option>

              <option value="Applied Science">Applied Science</option>

              <option value="Administration">Administration</option>

              <option value="Library">Library</option>

              <option value="Hostel">Hostel & Mess</option>

              <option value="Facilities">Campus Facilities</option>

              <option value="General Suggestion">General Suggestion</option>

            </select>

          </div>


          <div>

            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Overall Satisfaction Rating
            </label>

            <div className="bg-gray-50 border rounded-lg p-5">

              <div className="flex items-center gap-4">

                <span className="text-xs text-gray-500">1</span>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className={`w-full cursor-pointer ${sliderColor}`}
                />

                <span className="text-xs text-gray-500">10</span>

              </div>

              <div className="flex justify-between mt-3 items-center">

                <span className="text-lg font-semibold text-indigo-600">
                  {rating} / 10
                </span>

                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  {ratingIcon}
                  {currentRatingText}
                </div>

              </div>

            </div>

          </div>


          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Detailed Comment *
            </label>

            <textarea
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain your experience and suggest improvements..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            ></textarea>

          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            <FaPaperPlane />
            Submit Anonymous Feedback
          </button>

        </form>

      </div>

    </div>

  );

};

export default Feedback;