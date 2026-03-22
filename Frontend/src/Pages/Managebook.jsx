import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSyncAlt,
  FaUndoAlt,
  FaRegCalendarAlt,
  FaClock,
  FaBook
} from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:7000';
const OVERDUE_DAYS = 2;

const calculateDaysIssued = (date) => {
  const issued = new Date(date);
  return Math.max(0, Math.ceil((Date.now() - issued.getTime()) / (1000 * 60 * 60 * 24)));
};

const IssuedBookRow = ({ book, onReturn, isReturning }) => {
  const id = book.bookId || book._id;
  const days = calculateDaysIssued(book.date);
  const isOverdue = days > OVERDUE_DAYS;

  return (
    <tr className={`${isOverdue ? 'bg-red-50' : ''} border-b border-gray-200`}>
      <td className="py-3 px-4 font-semibold text-gray-800">{id}</td>
      <td className="py-3 px-4 text-gray-700">{book.studentName || 'N/A'}</td>
      <td className={`py-3 px-4 flex items-center gap-2 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
        {days} Days {isOverdue && <FaClock />}
      </td>
      <td className="py-3 px-4">
        <button
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-400 to-pink-300 text-white text-sm font-semibold hover:scale-105 transition"
          onClick={() => onReturn(book)}
          disabled={isReturning === id}
        >
          {isReturning === id ? <FaSpinner className="animate-spin" /> : <FaUndoAlt />}
          Return
        </button>
      </td>
    </tr>
  );
};

const Managebook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReturning, setIsReturning] = useState(null);

  const navigate = useNavigate();
  const token = Cookies.get('token');

  const fetchIssuedBooks = async () => {
    if (!token) return navigate('/login');
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API_BASE_URL}/issued`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setIssuedBooks(data?.books || []);
    } catch {
      setError('Could not fetch issued books. Please reload.');
      setIssuedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (book) => {
    const bookId = book.bookId || book._id;
    if (!window.confirm('Are you sure you want to return this book?')) return;
    if (!token) return navigate('/login');

    const timeDiff = Date.now() - new Date(book.date).getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    setIsReturning(bookId);

    try {
      await axios.post(`${API_BASE_URL}/penalty`, { bookId, daysDiff }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      await axios.post(`${API_BASE_URL}/returnbook`, { bookId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setIssuedBooks(prev => prev.filter(b => (b.bookId || b._id) !== bookId));
    } catch {
      setError('Return failed. Please retry.');
    } finally {
      setIsReturning(null);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <FaSpinner className="animate-spin text-4xl text-indigo-400" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center gap-2 backdrop-blur-md">
        <FaExclamationTriangle /> {error}
      </div>
    </div>
  );

  if (!issuedBooks.length) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 text-gray-700">
      <FaInfoCircle className="mr-2" /> No active issued books
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50 p-8">

      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6">

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-700">
              <FaBook /> Active Book Issue Management
            </h1>
            <p className="text-sm text-gray-600">Track issued books and overdue status</p>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-400 to-pink-300 text-white rounded-lg font-semibold hover:scale-105 transition"
            onClick={fetchIssuedBooks}
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600">
                <th className="py-3 px-4 text-left">Book ID</th>
                <th className="py-3 px-4 text-left">Student</th>
                <th className="py-3 px-4 text-left">
                  <FaRegCalendarAlt className="inline mr-1" /> Days
                </th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map(book => (
                <IssuedBookRow
                  key={book.bookId || book._id}
                  book={book}
                  onReturn={handleReturn}
                  isReturning={isReturning}
                />
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Managebook;