import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBus, FaTable, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaWrench, FaBan, FaGasPump, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../CSS/busconditionview.css'; 
import Cookies from 'js-cookie';

const BusConditionView = () => {
    const [busConditions, setBusConditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [updating, setUpdating] = useState(false);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        fetchBusConditions();
        fetchRoutes();
    }, []);

    const fetchBusConditions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/conditionview`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('emtoken')}`
                },
                withCredentials: true
            });
            setBusConditions(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bus conditions:', err);
            setError('Error fetching bus conditions. Please try again.');
            setLoading(false);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/viewroutes`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('emtoken')}`
                },
                withCredentials: true
            });
            const availableRoutes = response.data.routes.map(route => route.routeNumber);
            setRoutes(availableRoutes);
        } catch (err) {
            console.error('Error fetching routes:', err);
        }
    };

    const handleEdit = (condition) => {
        setEditingId(condition._id);
        setEditForm({
            busNo: condition.busNo,
            size: condition.size,
            fuelCapacity: condition.fuelCapacity,
            currentFuel: condition.currentFuel,
            routeNo: condition.routeNo,
            busType: condition.busType,
            mileage: condition.mileage,
            lastRefuelDate: condition.lastRefuelDate ? new Date(condition.lastRefuelDate).toISOString().split('T')[0] : '',
            lastMaintenanceDate: condition.lastMaintenanceDate ? new Date(condition.lastMaintenanceDate).toISOString().split('T')[0] : '',
            status: condition.status
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveEdit = async () => {
        setUpdating(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/conditionupdate/${editingId}`, editForm, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('emtoken')}`
                },
                withCredentials: true
            });
            setEditingId(null);
            setEditForm({});
            fetchBusConditions(); 
        } catch (err) {
            console.error('Error updating condition:', err);
            setError('Error updating bus condition. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderStatusBadge = (status) => {
        let icon;
        let className;
        const lowerStatus = status.toLowerCase();

        if (lowerStatus.includes('active')) {
            icon = <FaCheckCircle />;
            className = 'status-active';
        } else if (lowerStatus.includes('maintenance')) {
            icon = <FaWrench />;
            className = 'status-maintenance';
        } else {
            icon = <FaBan />;
            className = 'status-off-duty';
        }

        return <span className={`status-badge ${className}`}>{icon} {status}</span>;
    };

    if (loading) {
        return (
            <div className="view-container">
                <div className="loading-state"><FaSpinner className="spinner" /> Loading bus conditions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-container">
                <div className="error-state"><FaExclamationTriangle /> {error}</div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <h1 className="page-title"><FaBus className="title-icon" /> Bus Condition Details Overview</h1>

            {busConditions.length === 0 ? (
                <div className="no-data-message">
                    <p>No bus conditions available in the database.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="condition-table">
                        <thead>
                            <tr>
                                <th><FaBus /> Bus No. / Route</th>
                                <th>Size / Type</th>
                                <th><FaGasPump /> Fuel Status</th>
                                <th>Mileage (Km)</th>
                                <th><FaWrench /> Last Maint.</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {busConditions.map((condition) => (
                                <tr key={condition._id} className="data-row">
                                    <td data-label="Bus / Route" className="bus-route-cell">
                                        {editingId === condition._id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editForm.busNo}
                                                    onChange={(e) => handleInputChange('busNo', e.target.value)}
                                                    className="edit-input"
                                                    placeholder="Bus Number"
                                                />
                                                <select
                                                    value={editForm.routeNo}
                                                    onChange={(e) => handleInputChange('routeNo', e.target.value)}
                                                    className="edit-select"
                                                >
                                                    <option value="">Select Route</option>
                                                    {routes.map((route, index) => (
                                                        <option key={index} value={route}>{route}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="bus-number">{condition.busNo}</div>
                                                <div className="route-number">Route: {condition.routeNo}</div>
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td data-label="Size / Type">
                                        {editingId === condition._id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editForm.size}
                                                    onChange={(e) => handleInputChange('size', e.target.value)}
                                                    className="edit-input"
                                                    placeholder="Size"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.busType}
                                                    onChange={(e) => handleInputChange('busType', e.target.value)}
                                                    className="edit-input"
                                                    placeholder="Bus Type"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="bus-size">{condition.size}</div>
                                                <div className="bus-type">({condition.busType})</div>
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td data-label="Fuel Status" className="fuel-cell">
                                        {editingId === condition._id ? (
                                            <div>
                                                <input
                                                    type="number"
                                                    value={editForm.fuelCapacity}
                                                    onChange={(e) => handleInputChange('fuelCapacity', e.target.value)}
                                                    className="edit-input"
                                                    placeholder="Fuel Capacity"
                                                />
                                                <input
                                                    type="number"
                                                    value={editForm.currentFuel}
                                                    onChange={(e) => handleInputChange('currentFuel', e.target.value)}
                                                    className="edit-input"
                                                    placeholder="Current Fuel"
                                                />
                                                <input
                                                    type="date"
                                                    value={editForm.lastRefuelDate}
                                                    onChange={(e) => handleInputChange('lastRefuelDate', e.target.value)}
                                                    className="edit-input"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="fuel-capacity">Capacity: {condition.fuelCapacity} L</div>
                                                <div className="current-fuel">Current: <span className="fuel-level">{condition.currentFuel} L</span></div>
                                                <div className="refuel-date">Last Refuel: {new Date(condition.lastRefuelDate).toLocaleDateString()}</div>
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td data-label="Mileage">
                                        {editingId === condition._id ? (
                                            <input
                                                type="number"
                                                value={editForm.mileage}
                                                onChange={(e) => handleInputChange('mileage', e.target.value)}
                                                className="edit-input"
                                                placeholder="Mileage"
                                            />
                                        ) : (
                                            condition.mileage
                                        )}
                                    </td>
                                    
                                    <td data-label="Last Maintenance">
                                        {editingId === condition._id ? (
                                            <input
                                                type="date"
                                                value={editForm.lastMaintenanceDate}
                                                onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                                                className="edit-input"
                                            />
                                        ) : (
                                            new Date(condition.lastMaintenanceDate).toLocaleDateString()
                                        )}
                                    </td>
                                    
                                    <td data-label="Status" className="status-cell">
                                        {editingId === condition._id ? (
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="edit-select"
                                            >
                                                <option value="active">Active</option>
                                                <option value="under maintenance">Under Maintenance</option>
                                                <option value="off-duty">Off Duty</option>
                                            </select>
                                        ) : (
                                            renderStatusBadge(condition.status)
                                        )}
                                    </td>

                                    <td data-label="Actions" className="actions-cell">
                                        {editingId === condition._id ? (
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={handleSaveEdit} 
                                                    disabled={updating}
                                                    className="save-btn"
                                                >
                                                    {updating ? <FaSpinner className="spinner" /> : <FaSave />}
                                                </button>
                                                <button 
                                                    onClick={handleCancelEdit} 
                                                    className="cancel-btn"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleEdit(condition)} 
                                                className="edit-btn"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BusConditionView;