import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const createInitialQuestions = (count) => {
    if (count <= 0) return [];
    return Array.from({ length: count }, () => ({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
    }));
};

const Test = () => {
    const [quizTitle, setQuizTitle] = useState('New ERP Assessment');
    const [questionCount, setQuestionCount] = useState(3);
    const [questions, setQuestions] = useState(createInitialQuestions(3));
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const newQuestions = createInitialQuestions(questionCount);
        setQuestions(prevQuestions => {
            const preservedQuestions = prevQuestions.slice(0, questionCount);
            return [
                ...preservedQuestions,
                ...newQuestions.slice(preservedQuestions.length)
            ];
        });
    }, [questionCount]);

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, option) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = option;
        setQuestions(newQuestions);
    };

    const handleQuestionCountChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= 50) setQuestionCount(value);
        else if (e.target.value === '') setQuestionCount(0);
    };

    const validateQuiz = () => {
        if (!quizTitle.trim()) { setMessage('Quiz title is required.'); setMessageType('error'); return false; }
        if (questions.length === 0) { setMessage('Please enter questions.'); setMessageType('error'); return false; }
        for (const [index, q] of questions.entries()) {
            if (!q.text.trim()) { setMessage(`Question ${index + 1}: Text is missing.`); setMessageType('error'); return false; }
            if (q.options.some(opt => !opt.trim())) { setMessage(`Question ${index + 1}: All options must be filled.`); setMessageType('error'); return false; }
            if (!q.correctAnswer) { setMessage(`Question ${index + 1}: Correct answer not selected.`); setMessageType('error'); return false; }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateQuiz()) return;

        setIsSaving(true); setMessage('');
        const quizData = { title: quizTitle, questions: questions.slice(0, questionCount) };

        try {
            await axios.post('http://localhost:7000/addquestion', quizData);
            setMessage('Quiz successfully saved!');
            setMessageType('success');
            setQuestions(createInitialQuestions(questionCount));
            setQuizTitle('New ERP Assessment');
        } catch (error) {
            setMessage(`Error saving quiz: ${error.message || 'Server error'}`);
            setMessageType('error');
        } finally { setIsSaving(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <FaPlus className="text-2xl text-blue-500" />
                    <h1 className="text-3xl font-semibold text-gray-800">Create New Assessment</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Quiz Title & Count */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-1">Assessment Title</label>
                            <input
                                type="text"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter assessment title"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-1">Number of Questions</label>
                            <input
                                type="number"
                                value={questionCount}
                                onChange={handleQuestionCountChange}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    {questions.slice(0, questionCount).map((q, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-xl p-6 space-y-4 shadow-inner border-l-4 border-blue-400">
                            <h3 className="text-xl font-semibold text-gray-800">Question {idx + 1}</h3>
                            <textarea
                                value={q.text}
                                onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                                placeholder="Enter question text..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows={2}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((opt, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        value={q.options[i]}
                                        onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                                        placeholder={`Option ${opt}`}
                                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <label className="font-medium text-gray-700">Correct Answer:</label>
                                <select
                                    value={q.correctAnswer}
                                    onChange={(e) => handleCorrectAnswerChange(idx, e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="" disabled>Choose correct option</option>
                                    {['A', 'B', 'C', 'D'].map(opt => <option key={opt} value={opt}>Option {opt}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}

                    {/* Message */}
                    {message && (
                        <div className={`flex items-center gap-2 font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {messageType === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />} {message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSaving || questionCount === 0}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center gap-2 justify-center w-full md:w-auto transition"
                    >
                        <FaSave /> {isSaving ? 'Saving Assessment...' : 'Save Quiz'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Test;