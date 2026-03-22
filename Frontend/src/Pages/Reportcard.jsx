import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FaChartLine,
  FaClipboardList,
  FaBookOpen,
  FaAward,
  FaGraduationCap,
} from "react-icons/fa";

const ReportCard = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [studentName, setStudentName] = useState("Student");

  const reportItems = [
    {
      id: "ut1",
      name: "Unit Test 1 (UT1)",
      path: "/ut1",
      icon: <FaClipboardList />,
    },
    {
      id: "ut2",
      name: "Unit Test 2 (UT2)",
      path: "/ut2",
      icon: <FaBookOpen />,
    },
    {
      id: "midterm",
      name: "Mid Term",
      path: "/midterm",
      icon: <FaChartLine />,
    },
    {
      id: "final",
      name: "Final Report Card",
      path: "/final",
      icon: <FaAward />,
    },
  ];

  useEffect(() => {
    const verifyAuth = async () => {
      setLoadingAuth(true);
      const token = Cookies.get("token");

      if (!token) {
        setIsAuthenticated(false);
        setLoadingAuth(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:7000/studentprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setIsAuthenticated(true);
          setStudentName(response.data.student.name || "Student");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    verifyAuth();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg mb-10">
        <div className="flex items-center gap-4">
          <FaGraduationCap className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">Academic Report Dashboard</h1>
            <p className="text-lg opacity-90">
              Welcome, <span className="font-semibold">{studentName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col items-center text-center hover:-translate-y-1"
          >
            <div className="text-indigo-600 text-4xl mb-4">
              {item.icon}
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {item.name}
            </h2>

            <span className="text-indigo-500 font-medium">
              View Report →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCard;