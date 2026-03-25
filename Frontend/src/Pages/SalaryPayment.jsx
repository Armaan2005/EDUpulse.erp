import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const SalaryPayment = () => {
  const [salaries, setSalaries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/salaryview`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('emtoken')}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const salariesWithStaffId = await Promise.all(
          response.data.salary.map(async (salary) => {
            try {
              const staffResponse = await axios.get(`${BASE_URL}/viewstaff`, {
                headers: {
                  Authorization: `Bearer ${Cookies.get('emtoken')}`,
                },
                withCredentials: true,
              });
              
              const staffRecord = staffResponse.data.staff.find(staff => staff.name === salary.employee);
              return {
                ...salary,
                staffId: staffRecord ? staffRecord.id : 'N/A'
              };
            } catch (err) {
              console.error('Error fetching staff details:', err);
              return {
                ...salary,
                staffId: 'N/A'
              };
            }
          })
        );
        
        setSalaries(salariesWithStaffId);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError('Failed to fetch salary data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (salaryId, employeeName, department, basicSalary, allowance, deduction) => {
    if (!selectedMonth) {
      setError('Please select a month first');
      return;
    }

    try {
      setPaymentLoading(salaryId);
      setError('');
      setSuccess('');

      const paymentData = {
        salaryId: salaryId,
        month: selectedMonth,
        paymentDate: new Date().toISOString()
      };

      const response = await axios.post(`${BASE_URL}/salarypayment`, paymentData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('emtoken')}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess(`Salary payment recorded successfully for ${employeeName}`);
        fetchSalaries();
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Payment failed');
      }
      console.error(err);
    } finally {
      setPaymentLoading(null);
    }
  };

  const calculateTotal = (basic, allowance, deduction) => {
    return basic + allowance - deduction;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FaMoneyBillWave className="text-green-600 text-2xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Salary Payment</h1>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month for Payment
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Choose Month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">Loading salaries...</p>
            </div>
          )}

          {!loading && salaries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff ID
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allowance
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deduction
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaries.map((salary) => (
                    <tr key={salary._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.staffId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.employee}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{salary.basicsalary}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{salary.allowance}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{salary.deduction}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{calculateTotal(salary.basicsalary, salary.allowance, salary.deduction)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handlePayment(
                            salary._id,
                            salary.employee,
                            salary.department,
                            salary.basicsalary,
                            salary.allowance,
                            salary.deduction
                          )}
                          disabled={paymentLoading === salary._id || !selectedMonth}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                            paymentLoading === salary._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : !selectedMonth
                              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          } transition-colors duration-150`}
                        >
                          {paymentLoading === salary._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaCreditCard className="mr-2" />
                              Pay Salary
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && salaries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No salary records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryPayment;
