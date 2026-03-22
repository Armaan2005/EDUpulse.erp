import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaUserGraduate,
  FaClipboardList,
  FaBookOpen,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";

import "../CSS/viewstudent.css";

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:7000/viewstudent", {
        withCredentials: true
      });

      setStudents(response.data.student || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access, please login.");
        navigate("/login");
      } else {
        setError("Failed to fetch student data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`http://localhost:7000/deletestudent/${id}`, {
        withCredentials: true
      });

      setStudents(students.filter((s) => s._id !== id));
    } catch {
      setError("Failed to delete student.");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="student-container loading-state">
        <FaSpinner className="spinner-icon" />
        <p>Loading Student Data...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="student-container error-state">
        <FaExclamationTriangle />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className="student-container"
      style={{ background: "linear-gradient(135deg,#f9fafb 0%,#f4f3ff 50%,#eef2ff 100%)" }}
    >
      <div className="staff-table-wrapper">
        <table className="staff-table w-full">
          <thead>
            <tr style={{ height: "70px", background: "#f9fafb" }}>
              <th colSpan="9">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#344054" }}>
                    Student Records
                  </span>

                  <button
                    className="add-user-button flex items-center gap-2"
                    onClick={() => navigate("/Admission")}
                  >
                    <FaUserPlus /> Add New Student
                  </button>
                </div>
              </th>
            </tr>

            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th colSpan="5" className="action-header">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  No students found in the system.
                </td>
              </tr>
            ) : (
              students.map((s, idx) => (
                <tr key={s._id}>
                  <td>{idx + 1}</td>
                  <td className="staff-id-col">{s.id}</td>
                  <td className="staff-name-col">{s.name}</td>
                  <td>{s.email}</td>

                  <td>
                    <button
                      className="table-button update-button"
                      onClick={() => navigate(`/UpdateStudent/${s._id}`)}
                    >
                      <FaEdit /> Update
                    </button>
                  </td>

                  <td>
                    <button
                      className="table-button profile-button"
                      onClick={() => navigate(`/ProfileStudent/${s._id}`)}
                    >
                      <FaUserGraduate /> Profile
                    </button>
                  </td>

                  <td>
                    <button
                      className="table-button attendance-button"
                      onClick={() => navigate(`/StudentAttendance/${s.id}`)}
                    >
                      <FaClipboardList /> Attendance
                    </button>
                  </td>

                  <td>
                    <button
                      className="table-button assignment-button"
                      onClick={() => navigate(`/StudentAssignments/${s._id}`)}
                    >
                      <FaBookOpen /> Assignments
                    </button>
                  </td>

                  <td>
                    <button
                      className="table-button delete-button"
                      onClick={() => deleteStudent(s._id)}
                    >
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

export default ViewStudent;