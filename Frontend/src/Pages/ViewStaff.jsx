import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaUser,
  FaClipboardList,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import "../CSS/viewstaff.css";

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewstaff`, { withCredentials: true });
      setStaff(response.data.staff || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access, please login.");
        navigate("/login");
      } else {
        setError("Failed to fetch staff data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deletestaff/${id}`, { withCredentials: true });
      setStaff(staff.filter((s) => s._id !== id));
    } catch {
      setError("Failed to delete staff.");
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  if (loading) {
    return (
      <div className="staff-container loading-state">
        <FaSpinner className="spinner-icon" />
        <p>Loading Staff Data...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="staff-container error-state">
        <FaExclamationTriangle />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className="staff-container"
      style={{ background: "linear-gradient(135deg,#f9fafb 0%,#f4f3ff 50%,#eef2ff 100%)" }}
    >
      <div className="staff-table-wrapper">
        <table className="staff-table w-full">
          <thead>
            <tr style={{ height: "70px", background: "#f9fafb" }}>
              <th colSpan="8">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#344054" }}>Staff Records</span>
                  <button className="add-user-button flex items-center gap-2" onClick={() => navigate("/registration")}>
                    <FaUserPlus /> Add New Staff
                  </button>
                </div>
              </th>
            </tr>
            <tr>
              <th>#</th>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Email</th>
              <th colSpan="4" className="action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No staff members found in the system.
                </td>
              </tr>
            ) : (
              staff.map((s, idx) => (
                <tr key={s._id}>
                  <td>{idx + 1}</td>
                  <td className="staff-id-col">{s.id}</td>
                  <td className="staff-name-col">{s.name}</td>
                  <td>{s.email}</td>
                  <td>
                    <button className="table-button update-button" onClick={() => navigate(`/UpdateStaff/${s._id}`)}>
                      <FaEdit /> Update
                    </button>
                  </td>
                  <td>
                    <button className="table-button profile-button" onClick={() => navigate(`/viewbyidstaff/${s._id}`)}>
                      <FaUser /> Profile
                    </button>
                  </td>
                  <td>
                    <button className="table-button attendance-button" onClick={() => navigate(`/StaffAttendance/${s.id}`)}>
                      <FaClipboardList /> Attendance
                    </button>
                  </td>
                  <td>
                    <button className="table-button delete-button" onClick={() => deleteStaff(s._id)}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStaff;