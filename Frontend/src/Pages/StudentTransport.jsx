import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
    FaUserCircle, FaBusAlt, FaRoute, FaMapMarkerAlt, 
    FaPhone, FaEnvelope, FaGasPump, FaWrench, FaClock,
    FaSpinner, FaTimesCircle, FaCheckCircle 
} from 'react-icons/fa';
import '../CSS/StudentTransportView.css'

const StudentTransportDashboard = () => {
    const [studentTransport, setStudentTransport] = useState(null);
    const [driverDetails, setDriverDetails] = useState(null);
    const [busCondition, setBusCondition] = useState(null);
    const [routeDetails, setRouteDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchToken = Cookies.get('token');
        if (fetchToken) {
            setToken(fetchToken);
        } else {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchAllTransportData = async () => {
            try {
                const studentRes = await axios.get('http://localhost:7000/studenttransportview', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                const studentData = studentRes.data.studenttransport;
                setStudentTransport(studentData);

                if (!studentData || !studentData.Route) {
                    setError('Transport enrollment details are incomplete or not found.');
                    setLoading(false);
                    return;
                }

                const routeNo = studentData.Route;

                const driversRes = await axios.get('http://localhost:7000/viewdrivers', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                const driver = driversRes.data.driver.find(d => d.Route?.toString() === routeNo?.toString());
                setDriverDetails(driver || null);

                const conditionsRes = await axios.get('http://localhost:7000/conditionview', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                const condition = conditionsRes.data.data.find(c => c.routeNo?.toString() === routeNo?.toString());
                setBusCondition(condition || null);

                const routeRes = await axios.get(`http://localhost:7000/viewroutebyid/${encodeURIComponent(routeNo)}`, {
                    withCredentials: true,
                });
                setRouteDetails(routeRes.data.stops || null);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load transport data. Please verify your enrollment or check the server status.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllTransportData();
    }, [token]);

    const renderStatus = (icon, message, className) => (
        <div className="dashboard-container">
            <div className={`status-message ${className}`}>
                {icon}
                <p>{message}</p>
            </div>
        </div>
    );
    
    if (loading) {
        return renderStatus(<FaSpinner className="spinner" />, "Loading secure transport details...", "loading-state");
    }

    if (error) {
        return renderStatus(<FaTimesCircle />, error, "error-state");
    }
    
    if (!studentTransport) {
        return renderStatus(<FaTimesCircle />, "Transport enrollment not found for your account.", "no-data-state");
    }

    const getStatusClass = (status) => {
        if (!status) return 'status-unknown';
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('working') || lowerStatus.includes('good')) return 'status-good';
        if (lowerStatus.includes('maintenance') || lowerStatus.includes('pending')) return 'status-warning';
        if (lowerStatus.includes('breakdown') || lowerStatus.includes('error')) return 'status-danger';
        return 'status-unknown';
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header-v2">
                <FaBusAlt className="header-icon-v2" />
                <h1>Transport Tracking Dashboard</h1>
                <p>Real-time details for your assigned route.</p>
            </header>
            
            <section className="main-route-card">
                <div className="route-summary-section">
                    <FaRoute className="route-icon-lg" />
                    <div>
                        <p className="route-number-display">ROUTE {studentTransport.Route || 'N/A'}</p>
                        <h3>{studentTransport.studentName}'s Transport Details</h3>
                    </div>
                </div>

                <div className="route-details-grid">
                    <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <p>Stop Name</p>
                        <strong>{studentTransport.Stop }</strong>
                    </div>
                    <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <p>Morning Arrival</p>
                        <strong>{studentTransport.arrivalTime || 'N/A'}</strong>
                    </div>
                    <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <p>Evening Departure</p>
                        <strong>{studentTransport.departureTime || 'N/A'}</strong>
                    </div>
                </div>
            </section>

            <div className="auxiliary-details-grid">
                
                <div className="info-card-v2 driver-card-v2">
                    <div className="card-header-v2">
                        <FaUserCircle /> <h2>Assigned Driver</h2>
                    </div>
                    {driverDetails ? (
                        <div className="card-content-v2">
                            <p><strong>{driverDetails.name}</strong></p>
                            <div className="contact-info">
                                <p><FaPhone /> {driverDetails.phoneNumber}</p>
                                <p><FaEnvelope /> {driverDetails.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="missing-data-v2">Driver details not yet assigned.</p>
                    )}
                </div>

                <div className="info-card-v2 bus-card-v2">
                    <div className="card-header-v2">
                        <FaBusAlt /> <h2>Vehicle Status</h2>
                    </div>
                    {busCondition ? (
                        <div className="card-content-v2">
                            <p className="bus-no-label">Bus No: {busCondition.busNo} ({busCondition.busType})</p>
                            <div className="bus-status-metrics">
                                <div className="metric-item">
                                    <FaGasPump />
                                    <span>Fuel: {busCondition.currentFuel}/{busCondition.fuelCapacity} L</span>
                                </div>
                                <div className="metric-item">
                                    <FaWrench />
                                    <span>Last Service: {busCondition.lastMaintenanceDate || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="missing-data-v2">Bus condition details not yet updated.</p>
                    )}
                </div>
            </div>

            <section className="route-timeline-card">
                <div className="card-header-v2">
                    <FaMapMarkerAlt /> <h2>Route Breakdown</h2>
                </div>
                {routeDetails && routeDetails.length > 0 ? (
                    <ul className="route-timeline-list">
                        {routeDetails.map((stop, index) => (
                            <li key={index} className="route-stop-item">
                                <span className="stop-number">{index + 1}.</span>
                                <div>
                                    <p><strong>{stop.stopName || stop.name || 'Unnamed stop'}</strong></p>
                                    <p>Arrival: {stop.arrivalTime || 'N/A'} | Departure: {stop.departureTime || 'N/A'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="missing-data-v2">Route stops are unavailable. Ensure the route has been configured in Admin route settings.</p>
                )}
            </section>
            
        </div>
    );
};

export default StudentTransportDashboard;