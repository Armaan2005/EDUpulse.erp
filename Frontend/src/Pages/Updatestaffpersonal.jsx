import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

const Updatestaffpersonal = () => {
  const [staff, setStaff] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
    city: '',
    department: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = cookie.get('emtoken') || cookie.get('emstoken');

  const fetchStaff = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/staffprofile`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      const profile = response.data?.profile || response.data?.staff || {};
      setStaff({
        name: profile.name || '',
        email: profile.email || '',
        address: profile.address || '',
        contact: profile.contact || '',
        city: profile.city || '',
        department: profile.department || '',
        image: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff data.');
      console.error('fetchStaff error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', staff.name);
      formData.append('email', staff.email);
      formData.append('address', staff.address);
      formData.append('contact', staff.contact);
      formData.append('city', staff.city);
      formData.append('department', staff.department);
      if (staff.image instanceof File) {
        formData.append('image', staff.image);
      }

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/staffupdate`, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setSuccess('Staff information updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update staff information. Please try again.');
      console.error('handleSubmit error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className= "min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Update Staff Profile</h2>
        <p className="text-sm text-slate-500 mb-4">Fill the details and save your profile.</p>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        {loading ? (
          <div className="text-center py-8">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="mt-2 text-sm text-slate-600">Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name', field: 'name', type: 'text' },
              { label: 'Email', field: 'email', type: 'email' },
              { label: 'Address', field: 'address', type: 'text' },
              { label: 'Contact', field: 'contact', type: 'tel' },
              { label: 'City', field: 'city', type: 'text' },
              { label: 'Department', field: 'department', type: 'text' },
            ].map((item) => (
              <div key={item.field} className="grid gap-1">
                <label className="text-sm font-medium text-slate-700">{item.label}</label>
                <input
                  type={item.type}
                  value={staff[item.field]}
                  onChange={(e) => setStaff((prev) => ({ ...prev, [item.field]: e.target.value }))}
                  className="h-11 rounded-lg border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
            ))}

            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setStaff((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
                className="text-sm text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Updatestaffpersonal;
