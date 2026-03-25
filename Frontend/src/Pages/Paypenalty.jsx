import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const Paypenalty = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewpenalty`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setPenalties(response.data.penalties);
    } catch (error) {
      console.error('Error fetching penalties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (penaltyId) => {
    try {
      const token = Cookies.get('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/paypenalty`, {
        penaltyId: penaltyId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert('Penalty paid successfully.');
      fetchPenalties();
    } catch (error) {
      console.error('Error paying penalty:', error);
      alert('Failed to pay penalty. Please try again.');
    }
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  const payablePenalties = penalties.filter((p) => p.status === 'Unpaid' && p.penaltyAmount > 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-3">Your Penalties</h2>
        <p className="text-slate-500 mb-6">Here are your pending penalties. Click pay to mark as paid.</p>

        {loading ? (
          <div className="text-slate-600">Loading penalties...</div>
        ) : payablePenalties.length === 0 ? (
          <div className="text-slate-600">No unpaid penalties found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="text-xs uppercase bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Book ID</th>
                  <th className="px-4 py-3">Days Overdue</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payablePenalties.map((penalty) => (
                  <tr key={penalty._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{penalty.bookId}</td>
                    <td className="px-4 py-3">{penalty.daysOverdue} days</td>
                    <td className="px-4 py-3 font-semibold">₹{penalty.penaltyAmount}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handlePay(penalty._id)}
                        className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Paypenalty;
