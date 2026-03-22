import React from 'react'
import { useEffect , useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Adminviewhostel = () => {
    const API_BASE_URL = 'http://localhost:7000';
    const [studentHostels, setStudentHostels] = useState([]);
    const [error, setError] = useState('');

    const studentHostel=async()=>{
        try {
          const token = Cookies.get('emtoken');
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
                setStudentHostels(mergedData);
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        }
    }
  

    useEffect(() => {
        studentHostel();
    },[]);

  return (
    <div className="min-h-screen bg-purple-50 p-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Admin View Hostel</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-purple-100">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-purple-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Contact Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Date of Birth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Blood Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Allergies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Emergency Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Room Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Room Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Total Charge</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {studentHostels.map((hostel, index) => (
                  <tr key={hostel._id} className={`hover:bg-purple-50 ${index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.studentid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(hostel.dob).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.bloodGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.allergies}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.emergencyContact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.roomType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.roomNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hostel.totalCharge }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Adminviewhostel
