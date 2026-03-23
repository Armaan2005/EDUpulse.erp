import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Test = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [questions, setQuestions] = useState([
        { text: '', options: ['', '', '', ''], correctAnswer: '' },
        { text: '', options: ['', '', '', ''], correctAnswer: '' },
        { text: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [messageType, setMessageType] = useState('');

    const updateQuestion = (index, field, value) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const updateOption = (qIndex, optIndex, value) => {
        const newQs = [...questions];
        newQs[qIndex].options[optIndex] = value;
        setQuestions(newQs);
    };

    const checkForm = () => {
        if (!quizTitle.trim()) {
            setMessage('Quiz title is required.');
            setMessageType('error');
            return false;
        }
        if (!startTime) {
            setMessage('Start time is required.');
            setMessageType('error');
            return false;
        }
        if (!endTime) {
            setMessage('End time is required.');
            setMessageType('error');
            return false;
        }
        if (new Date(startTime) >= new Date(endTime)) {
            setMessage('End time must be after start time.');
            setMessageType('error');
            return false;
        }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) {
                setMessage(`Question ${i + 1}: Text is missing.`);
                setMessageType('error');
                return false;
            }
            if (q.options.some(o => !o.trim())) {
                setMessage(`Question ${i + 1}: All options must be filled.`);
                setMessageType('error');
                return false;
            }
            if (!q.correctAnswer) {
                setMessage(`Question ${i + 1}: Correct answer not selected.`);
                setMessageType('error');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkForm()) return;

        setIsSaving(true);
        setMessage('');
        try {
            await axios.post('http://localhost:7000/addquestion', {
                title: quizTitle,
                startTime: startTime,
                endTime: endTime,
                questions: questions
            }, {
                headers: { Authorization: `Bearer ${Cookies.get('emstoken')}` },
                withCredentials: true
            });
            setMessage('Quiz successfully saved!');
            setMessageType('success');
            setQuestions([
                { text: '', options: ['', '', '', ''], correctAnswer: '' },
                { text: '', options: ['', '', '', ''], correctAnswer: '' },
                { text: '', options: ['', '', '', ''], correctAnswer: '' }
            ]);
            setQuizTitle('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setMessageType('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
             
                <div className="flex items-center gap-3 mb-6">
                    <FaPlus className="text-2xl text-blue-500" />
                    <h1 className="text-3xl font-semibold text-gray-800">Create New Assessment</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                    </div>

                    {questions.map((q, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-xl p-6 space-y-4 shadow-inner border-l-4 border-blue-400">
                            <h3 className="text-xl font-semibold text-gray-800">Question {idx + 1}</h3>
                            <textarea
                                value={q.text}
                                onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
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
                                        onChange={(e) => updateOption(idx, i, e.target.value)}
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
                                    onChange={(e) => updateQuestion(idx, 'correctAnswer', e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="" disabled>Choose correct option</option>
                                    {['A', 'B', 'C', 'D'].map(opt => <option key={opt} value={opt}>Option {opt}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}

                    {message && (
                        <div className={`flex items-center gap-2 font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {messageType === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />} {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving}
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