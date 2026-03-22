import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

const Updatestudentpersonal = () => {
    
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = cookie.get('token');

    const fetchstudentprofile = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/studentprofile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setStudent(response.data.student);
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError("Failed to load profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>
    {
        fetchstudentprofile();
    },[]);

    const updatestudentpersonal=async(e)=>
    {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:7000/updatestudentpersonal`,student,{
                headers:{
                        Authorization:`Bearer ${token}`,
                },
                withCredentials:true,
            });
            alert("Profile updated successfully!");
        }
        catch(err)
        {
            console.error("Profile update error:",err);
            alert("Failed to update profile. Please try again later.");
        }

    }

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl">
        <div className="bg-linear-to-r from-blue-600 to-sky-500 p-6 rounded-t-2xl text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">Update Student Profile</h1>
          <p className="text-sm text-cyan-100 mt-1">Edit your personal details and save changes securely.</p>
        </div>

        <div className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={updatestudentpersonal}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="text"
                value={student?.name || ''}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="email"
                value={student?.email || ''}
                onChange={(e) => setStudent({ ...student, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Phone</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="text"
                value={student?.contact || ''}
                onChange={(e) => setStudent({ ...student, contact: e.target.value })}
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Address</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                type="text"
                value={student?.address || ''}
                onChange={(e) => setStudent({ ...student, address: e.target.value })}
                placeholder="Address"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Updatestudentpersonal
