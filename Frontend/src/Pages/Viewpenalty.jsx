import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'


const Viewpenalty = () => {

   const [penalties, setPenalties] = useState([]);

   const fetchPenalties = async () => {
    try {
      const token = Cookies.get('emtoken');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewallpenalty`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setPenalties(response.data.penalties);
    } catch (error) {
      console.error('Error fetching penalties:', error);
    }
  };

   const handleRemind = async (studentId, amount) => {
    try {
      const token = Cookies.get('emtoken');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/penaltyreminder`, {
        studentId,
        amount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder.');
    }
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Penalty Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {penalties.filter(penalty => penalty.penaltyAmount > 0).map((penalty, index) => (
              <tr key={penalty._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{penalty.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{penalty.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{penalty.bookId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{penalty.daysOverdue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{penalty.penaltyAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{penalty.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(penalty.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {penalty.status === 'Unpaid' && (
                    <button 
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2" 
                      onClick={() => handleRemind(penalty.studentId, penalty.penaltyAmount)}
                    >
                      Remind
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Viewpenalty
