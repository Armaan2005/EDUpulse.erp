import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaGraduationCap, FaSpinner, FaTimesCircle, FaCheckCircle, FaPaperPlane, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const QuizDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [token, setToken] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get auth token
  useEffect(() => {
    const Token = Cookies.get('token');
    if (Token) setToken(Token);
    else setError('Authentication token missing. Please log in.');
  }, []);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:7000/viewAssessment/${title}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setQuiz(response.data.quiz);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching quiz details.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchQuizDetails();
  }, [title, token]);

  // Track answer
  const handleAnswerChange = (questionId, optionKey) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  // Next / Previous
  const handleNext = () => {
    const question = quiz.questions[currentStep];
    if (!answers[question.questionId]) {
      alert("Please select an option before moving forward.");
      return;
    }
    if (currentStep < quiz.questions.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  // Final submit
  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      if (!window.confirm(`You answered ${Object.keys(answers).length} out of ${quiz.questions.length}. Submit anyway?`)) return;
    }

    try {
      await axios.post('http://localhost:7000/AssessmentSubmission', {
        quizTitle: quiz.title,
        answers,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setIsSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Error submitting quiz.");
    }
  };

  // Loading screen
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <FaSpinner className="animate-spin text-5xl text-blue-500" />
    </div>
  );

  // Error screen
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50 text-red-600">
      <FaTimesCircle className="text-5xl mr-2" />
      <p>{error}</p>
    </div>
  );

  // Submission success
  if (isSubmitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <FaCheckCircle className="text-7xl text-green-500 mb-4" />
      <h2 className="text-3xl font-semibold mb-2 text-gray-800">Submission Successful!</h2>
      <p className="text-gray-700 mb-6 text-center">
        Your answers for <strong>{quiz.title}</strong> have been recorded.
      </p>
      <button
        onClick={() => navigate(`/Viewresult/${encodeURIComponent(quiz.title)}`)}
        className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-3 rounded-2xl transition shadow flex items-center gap-2 font-semibold"
      >
        View Your Result <FaPaperPlane />
      </button>
    </div>
  );

  // Current question
  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FaGraduationCap className="text-2xl text-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-800">{quiz.title}</h2>
        </div>
        <p className="text-gray-600">Answer the questions below.</p>
        <hr className="my-4 border-blue-200" />

        {/* Progress */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
          <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}></div>
        </div>
        <p className="text-gray-700 text-sm mb-4">Question {currentStep + 1} of {totalQuestions}</p>

        {/* Question card */}
        <div className="space-y-4">
          <p className="text-gray-800 font-medium">{currentStep + 1}. {question.questionText}</p>
          <div className="flex flex-col gap-2">
            {Object.keys(question.options).map(optKey => (
              <label
                key={optKey}
                className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition
                  hover:border-blue-400 hover:bg-blue-50
                  ${answers[question.questionId] === optKey ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-400' : 'bg-white border-gray-200'}`}
              >
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value={optKey}
                  checked={answers[question.questionId] === optKey}
                  onChange={() => handleAnswerChange(question.questionId, optKey)}
                  className="form-radio text-blue-500"
                />
                <span className="font-semibold">{optKey}.</span>
                <span className="text-gray-700">{question.options[optKey]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl transition shadow flex items-center gap-2 font-semibold
              ${currentStep === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            <FaArrowLeft /> Previous
          </button>

          {currentStep < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl transition shadow flex items-center gap-2 font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-2xl transition shadow flex items-center gap-2 font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
            >
              Submit <FaPaperPlane />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;