import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaIdCard, FaMapMarkerAlt, FaCity } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../CSS/staffprofile.css';

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updatestaff = () => {
    navigate('/updatestaffpersonal');
  };

  const fetchStaffProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:7000/staffprofile', { withCredentials: true });
      const profileData = response.data?.profile || response.data?.staff || null;
      if (!profileData) {
        setError('No profile data found.');
        setStaff(null);
      } else {
        setStaff(profileData);
        setError('');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch staff profile. Please log in again.';
      setError(errorMessage);
      setStaff(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Review and update your personal details.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-slate-600">Loading Staff Profile...</p>
          </div>
        ) : staff ? (
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                {staff.image ? (
                  <img
                    src={`http://localhost:7000/images/${staff.image}`}
                    alt={staff.name || 'Staff'}
                    className="h-20 w-20 rounded-full object-cover border-2 border-indigo-200"
                  />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-indigo-100 text-indigo-500">
                    <FaUserCircle className="h-12 w-12" />
                  </div>
                )}
                <div>   
                  <h2 className="text-xl font-semibold text-slate-900">{staff.name || 'Name not set'}</h2>
                  <p className="text-sm text-slate-500">{staff.department || 'Department not available'}</p>
                </div>
              </div>

              <button
                onClick={updatestaff}
                className="rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid gap-4 pt-6 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Staff ID</p>
                <p className="mt-1 text-sm text-slate-700">{staff.id || 'N/A'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Department</p>
                <p className="text-sm text-slate-700">{staff.department || 'N/A'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <FaPhone />
                  <span className="text-xs font-semibold uppercase tracking-wide">Contact</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{staff.contact || 'N/A'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <FaEnvelope />
                  <span className="text-xs font-semibold uppercase tracking-wide">Email</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{staff.email || 'N/A'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <FaMapMarkerAlt />
                  <span className="text-xs font-semibold uppercase tracking-wide">Address</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{staff.address || 'N/A'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <FaCity />
                  <span className="text-xs font-semibold uppercase tracking-wide">City</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{staff.city || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-600">No staff profile found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
