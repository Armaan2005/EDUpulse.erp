import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaMoneyBillWave, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';

const BASE_URL = "http://localhost:7000";

const StaffPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/staffpaymentview`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('emstoken')}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setPayments(response.data.payment);
        const total = response.data.payment.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalBalance(total);
      } else {
        setError(response.data.msg || 'Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Staff Payment Records</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Balance Received</h2>
              <div className="flex items-center">
                <FaRupeeSign className="text-green-500 mr-2" />
                <span className="text-3xl font-bold text-green-600">{totalBalance.toLocaleString()}</span>
              </div>
            </div>
            <FaMoneyBillWave className="text-4xl text-green-500" />
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaMoneyBillWave className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payment records found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {payments.map((payment, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">{payment.month}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Department: {payment.staffDepartment}</p>
                  <p className="text-sm text-gray-600">Staff ID: {payment.staffId}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaRupeeSign className="text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-green-600">{payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPayment;
