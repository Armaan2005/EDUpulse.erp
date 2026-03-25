import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaTrophy, FaChartLine, FaSpinner, FaTimesCircle, FaCheckCircle, FaStar, FaQuestionCircle } from 'react-icons/fa';

const ViewResult = () => {
  const { title } = useParams();  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      const token = Cookies.get('token');
      setLoading(true);

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ViewResult/${title}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, 
        });

        if (response.data.success && response.data.result) {
          setResult(response.data.result);
          setError('');
        } else {
          setError('No result found for this quiz.');
        }
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [title]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <FaSpinner className="animate-spin text-5xl text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50 text-red-600">
      <FaTimesCircle className="text-5xl mr-2" />
      <p className="text-lg">{error}</p>
    </div>
  );

  if (!result || !result.totalQuestions) return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-600">
      <FaStar className="text-4xl mr-2" />
      <p>No result data available for: {title}</p>
    </div>
  );

  const scorePercentage = ((result.score / result.totalQuestions) * 100).toFixed(1);
  const passed = result.score / result.totalQuestions >= 0.6;
  const scoreStatus = passed ? 'Great Job!' : 'Needs Improvement';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaChartLine className="text-3xl text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-800">Quiz Results: {title}</h1>
      </div>

      {/* Score Summary */}
      <div className={`flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mb-6
        ${passed ? 'border-green-400' : 'border-red-400'} border-2`}>
        <div className="text-6xl mr-6 text-yellow-400">
          <FaTrophy />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-xl font-semibold">{scoreStatus}</p>
          <p className="text-3xl font-bold text-gray-800">{result.score} / {result.totalQuestions}</p>
          <p className="text-lg text-gray-600">{scorePercentage}% Correct</p>
        </div>
      </div>

      {/* Detailed Breakdown Header */}
      <div className="flex items-center gap-2 text-gray-700 font-semibold text-lg mb-4">
        <FaQuestionCircle /> Detailed Breakdown
      </div>

      {/* Questions List */}
      <div className="w-full max-w-3xl space-y-4">
        {result.details && result.details.length > 0 ? (
          result.details.map((detail, index) => {
            const isCorrect = detail.isCorrect;
            return (
              <div key={index} className="bg-white rounded-2xl shadow p-4 border-l-4
                transition hover:shadow-lg
                border-l-green-400 dark:border-l-red-400"
                >
                <div className={`flex items-center gap-2 mb-2 font-semibold text-sm
                  ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </div>
                <p className="text-gray-800 mb-2"><strong>Q {index + 1}:</strong> {detail.questionText}</p>
                <div className="flex flex-col md:flex-row gap-4 text-gray-700">
                  <p><strong>Correct Answer:</strong> <span className="text-green-600">{detail.correctAnswer || 'N/A'}</span></p>
                  <p><strong>Your Answer:</strong> <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{detail.studentAnswer || 'Not Answered'}</span></p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-600 text-center p-4 bg-white rounded-2xl shadow">
            Detailed question breakdown is not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResult;