import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBuilding,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import Cookies from "js-cookie";
import "../CSS/viewdept.css";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const ViewDepartment = () => {

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchDepartmentData = async () => {

    setLoading(true);

    try {

      const response = await axios.get(`${BASE_URL}/viewdepartment`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("emtoken")}`
        },
        withCredentials: true
      });

      setDepartments(response.data.dept || []);

    } catch (err) {

      console.error("Fetch Error:", err);

      if (err.response && err.response.status === 401) {
        setError("Unauthorized access, please login.");
        navigate("/login");
      } else {
        setError("Failed to fetch department data.");
      }

    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {

    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {

      await axios.delete(`${BASE_URL}/deletedepartment/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("emtoken")}`
        },
        withCredentials: true
      });

      setDepartments(departments.filter((d) => d._id !== id));

    } catch (err) {
      console.error(err);
      setError("Failed to delete department.");
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  if (loading) {
    return (
      <div className="staff-container loading-state">
        <FaSpinner className="spinner-icon" />
        <p>Loading Department Data...</p>
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
              <th colSpan="6">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#344054" }}>
                    Department Records
                  </span>

                  <button
                    className="add-user-button flex items-center gap-2"
                    onClick={() => navigate("/DeptRegistration")}
                  >
                    <FaPlus /> Add Department
                  </button>

                </div>
              </th>
            </tr>

            <tr>
              <th>#</th>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Description</th>
              <th colSpan="2" className="action-header">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {departments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No departments found in the system.
                </td>
              </tr>
            ) : (
              departments.map((dept, index) => (
                <tr key={dept._id}>

                  <td>{index + 1}</td>

                  <td className="staff-id-col">{dept.departId}</td>

                  <td className="staff-name-col">{dept.departName}</td>

                  <td>{dept.departDescription || "No description"}</td>

                  <td>
                    <button
                      className="table-button update-button"
                      onClick={() => navigate(`/UpdateDepartment/${dept._id}`)}
                    >
                      <FaEdit /> Update
                    </button>
                  </td>

                  <td>
                    <button
                      className="table-button delete-button"
                      onClick={() => deleteDepartment(dept._id)}
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

export default ViewDepartment;