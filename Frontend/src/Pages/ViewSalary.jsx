import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaMoneyCheckAlt,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import Cookies from "js-cookie";
import "../CSS/viewsal.css";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const ViewSalary = () => {

  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchSalaryData = async () => {

    setLoading(true);

    try {

      const response = await axios.get(`${BASE_URL}/salaryview`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("emtoken")}`
        },
        withCredentials: true
      });

      setSalaries(response.data.salary || []);

    } catch (err) {

      console.error(err);

      if (err.response && err.response.status === 401) {
        setError("Unauthorized access, please login.");
        navigate("/login");
      } else {
        setError("Failed to fetch salary data.");
      }

    } finally {
      setLoading(false);
    }
  };

  const deleteSalary = async (id) => {

    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    try {

      await axios.delete(`${BASE_URL}/salarydelete/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("emtoken")}`
        },
        withCredentials: true
      });

      setSalaries(salaries.filter((s) => s._id !== id));

    } catch (err) {
      console.error(err);
      setError("Failed to delete salary record.");
    }
  };

  const calculateNetSalary = (basic, allowance, deduction) => {
    return (
      parseFloat(basic || 0) +
      parseFloat(allowance || 0) -
      parseFloat(deduction || 0)
    ).toFixed(2);
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  if (loading) {
    return (
      <div className="staff-container loading-state">
        <FaSpinner className="spinner-icon" />
        <p>Loading Salary Data...</p>
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
              <th colSpan="9">

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#344054" }}>
                    Salary Records
                  </span>

                  <button
                    className="add-user-button flex items-center gap-2"
                    onClick={() => navigate("/SalaryRegister")}
                  >
                    <FaPlus /> Record New Salary
                  </button>

                </div>

              </th>
            </tr>

            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Basic Salary (₹)</th>
              <th>Allowance (₹)</th>
              <th>Deduction (₹)</th>
              <th>Net Salary (₹)</th>
              <th>Pay Date</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {salaries.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500">
                  No salary records found.
                </td>
              </tr>
            ) : (
              salaries.map((salary, index) => (
                <tr key={salary._id}>

                  <td>{index + 1}</td>

                  <td>{salary.employee}</td>

                  <td>{salary.department}</td>

                  <td>
                    ₹{parseFloat(salary.basicsalary).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹{parseFloat(salary.allowance).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹{parseFloat(salary.deduction).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹{calculateNetSalary(
                      salary.basicsalary,
                      salary.allowance,
                      salary.deduction
                    )}
                  </td>

                  <td>
                    {new Date(salary.paydate).toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="table-button update-button"
                      onClick={() => navigate(`/UpdateSalary/${salary._id}`)}
                    >
                      <FaEdit /> Update
                    </button>

                    <button
                      className="table-button delete-button"
                      onClick={() => deleteSalary(salary._id)}
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

export default ViewSalary;