import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaBed, FaDoorOpen, FaSpinner } from "react-icons/fa";

const RoomAvailabilityComponent = () => {
  const [singleRooms, setSingleRooms] = useState("");
  const [doubleRooms, setDoubleRooms] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const Token = Cookies.get("emtoken");
    if (Token) {
      setToken(Token);
      fetchRoomDetails(Token);
    }
  }, []);

  const fetchRoomDetails = async (authToken) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewroom`);
      if (response.data.success && response.data.room.length > 0) {
        const roomData = response.data.room[0]; 
        setSingleRooms(roomData.singleRooms );
        setDoubleRooms(roomData.doubleRooms );
        setRoomId(roomData._id);
      }
    } catch (err) {
      setError("Error fetching room details");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!singleRooms || !doubleRooms) {
      setError("Please fill both room fields!");
      return;
    }

    if (!roomId) {
      setError("Room ID not found. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/updateroom/${roomId}`,
        { singleRooms, doubleRooms },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Room availability updated successfully!");
     
        fetchRoomDetails(token);
      }
    } catch (err) {
      setError("Error updating room details");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 p-6">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">

        <div className="flex items-center gap-3 mb-6">
          <FaDoorOpen className="text-3xl text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Room Availability Management
          </h2>
        </div>

        {fetchLoading && (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            <span className="ml-2 text-gray-600">Loading room details...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!fetchLoading && (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800 font-medium">Current Room Details:</p>
              <p className="text-xs text-blue-600">Single Rooms: {singleRooms || 'Not set'}</p>
              <p className="text-xs text-blue-600">Double Rooms: {doubleRooms || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Single Rooms
              </label>

              <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-indigo-400">
                <FaBed className="text-gray-400 mr-2" />
                <input
                  type="number"
                  value={singleRooms}
                  onChange={(e) => setSingleRooms(e.target.value)}
                  placeholder="Enter number of single rooms"
                  className="w-full py-2 outline-none"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Double Rooms
              </label>

              <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-indigo-400">
                <FaBed className="text-gray-400 mr-2" />
                <input
                  type="number"
                  value={doubleRooms}
                  onChange={(e) => setDoubleRooms(e.target.value)}
                  placeholder="Enter number of double rooms"
                  className="w-full py-2 outline-none"
                  min="0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Availability"
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default RoomAvailabilityComponent;