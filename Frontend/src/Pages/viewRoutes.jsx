import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBus, FaClock, FaCalendarAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaTimes, FaSearch, FaRoute } from 'react-icons/fa';
import '../CSS/viewroutes.css';

const ViewRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const toggleRow = (routeId) => {
        setExpandedRows(prev => ({
            ...prev,
            [routeId]: !prev[routeId]
        }));
    };

    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:7000/viewroutes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("emtoken")}`,
                },
                withCredentials: true,
            });
            setRoutes(response.data.routes);
        } catch (err) {
            console.error('Error fetching routes:', err);
            setError('Failed to load routes. Please check the server connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const filteredRoutes = routes.filter(route =>
        route.routeNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen text-gray-600">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="ml-4">Tracking routes...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen text-red-600">
            <div className="flex items-center bg-red-100 p-4 rounded-xl shadow-md">
                <FaTimes className="text-2xl mr-2" />
                <div>
                    <h3 className="font-semibold">Connection Error</h3>
                    <p>{error}</p>
                    <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={fetchRoutes}>Try Again</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 py-12 px-6">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <FaBus className="mr-2 text-blue-500" />
                            Transport Routes
                        </h1>
                        <p className="text-sm text-gray-500">Manage and view all active bus schedules</p>
                    </div>
                    <div className="flex items-center bg-white p-2 rounded-xl shadow-md w-64">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search Route #..."
                            className="w-full focus:outline-none text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Route List Section */}
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
                {filteredRoutes.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        <FaCalendarAlt className="text-4xl mb-4" />
                        <h3 className="text-xl font-semibold">No Routes Found</h3>
                        <p>There are no active routes matching your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="py-3 px-4 text-left">Route No.</th>
                                    <th className="py-3 px-4 text-left">Start Time</th>
                                    <th className="py-3 px-4 text-left">End Time</th>
                                    <th className="py-3 px-4 text-left">Stops</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoutes.map((route, index) => {
                                    const routeId = route.routeNumber;
                                    const isExpanded = expandedRows[routeId];

                                    return (
                                        <React.Fragment key={index}>
                                            <tr
                                                className={`cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
                                                onClick={() => toggleRow(routeId)}
                                            >
                                                <td className="py-3 px-4">
                                                    <span className="font-semibold text-gray-800">{route.routeNumber}</span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    <FaClock className="mr-2 text-gray-500" />
                                                    {route.startTime}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    <FaClock className="mr-2 text-gray-500" />
                                                    {route.endTime}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="bg-indigo-100 text-indigo-600 py-1 px-3 rounded-full">{route.stops.length} Stops</span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button className={`px-2 py-1 rounded-full ${isExpanded ? 'text-blue-600' : 'text-gray-600'}`}>
                                                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                    </button>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan="5" className="py-4 px-4">
                                                        <div className="timeline">
                                                            <h4 className="font-semibold text-gray-800 mb-3">Route Timeline</h4>
                                                            {route.stops.map((stop, idx) => (
                                                                <div key={idx} className="flex items-center mb-4">
                                                                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-4"></div>
                                                                    <div className="flex-1">
                                                                        <div className="text-gray-700 font-medium">{stop.stopName}</div>
                                                                        <div className="text-gray-500">
                                                                            <span>Arr: {stop.arrivalTime}</span>
                                                                            <span className="mx-2">•</span>
                                                                            <span>Dep: {stop.departureTime}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRoutes;