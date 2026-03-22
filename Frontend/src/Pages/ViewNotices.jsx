import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBell,
  FaClock,
  FaCalendarAlt,
  FaBullhorn,
  FaCircle,
  FaExclamationCircle,
  FaSpinner
} from "react-icons/fa";

const ViewNotices = () => {

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getNoticeMetadata = (type) => {

    switch (type) {
      case "Important":
        return { icon: <FaBullhorn />, color: "bg-red-500", label: "URGENT" };

      case "New Event":
        return { icon: <FaCalendarAlt />, color: "bg-green-500", label: "EVENT" };

      case "Urgent Alert":
        return { icon: <FaExclamationCircle />, color: "bg-yellow-500", label: "ALERT" };

      case "General Announcement":
        return { icon: <FaBell />, color: "bg-blue-500", label: "INFO" };

      default:
        return { icon: <FaCircle />, color: "bg-gray-500", label: "GENERAL" };
    }

  };

  const fetchNotices = async () => {

    try {

      const response = await axios.get("http://localhost:7000/viewnotice");

      const noticesWithTypes = response.data.notices.map((notice) => {

        const types = [
          "Important",
          "New Event",
          "General Announcement",
          "Urgent Alert",
          "Information"
        ];

        const randomType = types[Math.floor(Math.random() * types.length)];

        const issueDate = new Date(notice.issueDate);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return {
          ...notice,
          type: randomType,
          isNew: issueDate > sevenDaysAgo
        };

      });

      noticesWithTypes.sort(
        (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
      );

      setNotices(noticesWithTypes);

    } catch (err) {

      console.error(err);
      setError("Failed to fetch notices.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        <FaSpinner className="animate-spin mr-3" />
        Loading notices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-100 p-8">

      {/* Header */}

      <div className="flex items-center gap-3 mb-10">

        <FaBell className="text-3xl text-indigo-600" />

        <h1 className="text-3xl font-bold text-gray-800">
          Official Notices & Announcements
        </h1>

      </div>

      {/* Notice list */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {notices.map((notice) => {

          const { icon, color, label } = getNoticeMetadata(notice.type);

          const issueDate = new Date(notice.issueDate).toLocaleDateString();

          const eventDate = new Date(notice.eventDate).toLocaleDateString();

          return (

            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100"
            >

              {/* Top */}

              <div className="flex justify-between items-center mb-3">

                <div className="flex gap-2 items-center">

                  <span
                    className={`${color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                  >
                    {icon}
                    {label}
                  </span>

                  {notice.isNew && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}

                </div>

                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <FaClock />
                  {issueDate}
                </span>

              </div>

              {/* Title */}

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {notice.title}
              </h3>

              {/* Content */}

              <p className="text-gray-600 text-sm mb-4">
                {notice.content}
              </p>

              {/* Footer */}

              <div className="flex items-center text-sm text-gray-500 gap-2">

                <FaCalendarAlt />

                <span>
                  Event / Last Date:
                  <b className="ml-1 text-gray-700">{eventDate}</b>
                </span>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

};

export default ViewNotices;