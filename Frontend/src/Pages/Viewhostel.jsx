import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaSpinner, FaExclamationTriangle, FaBell } from 'react-icons/fa';

const Viewhostel = () => {
  const API_BASE_URL = 'http://localhost:7000';
  const [studentHostel, setStudentHostel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminderSending, setReminderSending] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('emtoken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_BASE_URL}/studenthostelview`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success) {
        const hostels = response.data.student ;
        const fees = response.data.feeDetails ;
        
        const mergedData = hostels.map(hostel => ({
          ...hostel,
          fee: fees.find(f => f.StudentId === hostel.studentid)
        }));
        
        setStudentHostel(mergedData);
      } else {
        throw new Error(response.data.msg || 'Failed to fetch data');
      }
    } catch (error) {
      setError(error.message || 'Error fetching hostel details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (email, amount) => {
    setReminderSending(studentId);
    try {
      const token = Cookies.get('emtoken');
      const response = await axios.post(
        `${API_BASE_URL}/sendfeesreminder`,
        { email, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      if (response.data.success) {
        alert(`Reminder sent to ${email} successfully.`);
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Error sending reminder: ' + (error.response?.data?.msg || error.message));
    } finally {
      setReminderSending(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading Hostel Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: "linear-gradient(135deg,#f9fafb 0%,#f4f3ff 50%,#eef2ff 100%)" }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="h-20 bg-gray-50 flex justify-between items-center px-8 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-700">Hostel Student Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentHostel.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-gray-500 font-semibold">
                    No hostel records found in the system.
                  </td>
                </tr>
              ) : (
                studentHostel.map((item, idx) => {
                  const isUnpaid = item.fee?.paymentStatus === 'unpaid';
                  const balance = (item.fee?.totalAmount || 0) - (item.fee?.amountPaid || 0);
                  
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.Name}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.studentid}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          {item.roomType} - {item.roomNo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.contactNumber}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ₹{item.fee.totalAmount }
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold ${
                        balance > 0 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        ₹{balance}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                          isUnpaid
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isUnpaid ? 'Unpaid' : 'Paid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isUnpaid && (
                          <button
                            onClick={() => sendReminder(item.email, item.totalCharge)}
                            disabled={reminderSending === item.email}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaBell size={12} />
                            {reminderSending === item.email ? 'Sending...' : 'Send'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Viewhostel;
