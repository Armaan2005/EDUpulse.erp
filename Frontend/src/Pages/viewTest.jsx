import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  FaBookOpen, FaClipboardList, FaSpinner,
  FaTimesCircle, FaChevronRight, FaCalendarAlt,
  FaStar, FaChartBar
} from 'react-icons/fa';

const ViewTest = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getQuizMetadata = (index) => {
    const gradients = [
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-yellow-300 to-orange-400",
      "from-pink-400 to-rose-500",
    ];

    const icons = [
      <FaBookOpen />,
      <FaCalendarAlt />,
      <FaStar />,
      <FaClipboardList />
    ];

    return {
      gradient: gradients[index % gradients.length],
      icon: icons[index % icons.length]
    };
  };

  const fetchQuizTitles = async () => {
    const token = Cookies.get('emstoken');
    try {
      const res = await axios.get('http://localhost:7000/viewTitle', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setQuizzes(res.data.titles || []);
    } catch {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizTitles();
  }, []);

  const handleQuizClick = (title) => navigate(`/view-test/${encodeURIComponent(title)}`);
  const handleResultClick = (title) => navigate(`/Viewresult/${encodeURIComponent(title)}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 text-red-500">
        <FaTimesCircle className="text-5xl mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-3xl text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">
            Quiz Dashboard
          </h1>
        </div>

        <span className="bg-white shadow px-4 py-1 rounded-full text-sm text-gray-700">
          {quizzes.length} Tests
        </span>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center mt-20">
          <FaStar className="text-6xl mx-auto text-yellow-400 animate-pulse mb-4" />
          <p className="text-lg text-gray-600">No quizzes available</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => {
            const { gradient, icon } = getQuizMetadata(index);
            const now = new Date();
            const start = new Date(quiz.startTime);
            const end = new Date(quiz.endTime);
            const canStart = now >= start && now <= end;

            return (
              <div
                key={index}
                className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-white/10 to-white/5 hover:from-blue-400 hover:to-indigo-500 transition duration-300"
              >
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg hover:shadow-2xl transition duration-300">

                  {/* Top */}
                  <div>
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-white text-xl mb-4 shadow-md`}>
                      {icon}
                    </div>

                    <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-gray-700 transition">
                      {quiz.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2">
                      Start: {new Date(quiz.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      End: {new Date(quiz.endTime).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {canStart && (
                      <button
                        onClick={() => handleQuizClick(quiz.title)}
                        className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-white shadow-md transition bg-blue-500 hover:bg-blue-600"
                      >
                        Start <FaChevronRight />
                      </button>
                    )}

                    <button
                      onClick={() => handleResultClick(quiz.title)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 text-gray-800 transition"
                    >
                      <FaChartBar /> Result
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewTest;