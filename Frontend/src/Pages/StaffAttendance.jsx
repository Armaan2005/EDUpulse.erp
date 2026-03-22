import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaSave, FaUsers, FaSpinner } from 'react-icons/fa';
import '../CSS/staffattendance.css';

const StaffAttendance = () => {
    const [staff, setStaff] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchStaffData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get("http://localhost:7000/viewstaff", { withCredentials: true });
            setStaff(response.data.staff || []);
        } catch (error) {
            console.error("Error fetching staff data:", error);
            setError("Failed to fetch staff list. Please try again.");
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffData();
    }, []);

    useEffect(() => {
        if (staff.length > 0) {
            const initialRecords = staff.map((member) => ({
                id: member.id,
                name: member.name,
                status: 'Leave',
                date: selectedDate
            }));
            setRecords(initialRecords);
        }
    }, [staff]);

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setRecords(prevRecords => prevRecords.map(record => ({
            ...record,
            date: date
        })));
    };

    const handleRadioChange = (e, staffId) => {
        const status = e.target.value;
        setRecords(prevRecords => prevRecords.map(record => 
            record.id === staffId ? { ...record, status: status } : record
        ));
    };

    const funsave = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            setError("Please select the attendance date.");
            return;
        }

        const dataToSend = records.filter(r => r.date === selectedDate);
        if (dataToSend.length === 0) {
             setError("No attendance records to save for the selected date.");
             return;
        }

        setIsSaving(true);
        setError('');

        try {
            const response = await axios.post("http://localhost:7000/Sattendancecheck", { records: dataToSend });
            alert("Attendance saved successfully!");
        } catch (error) {
            console.error("Error saving attendance:", error.response?.data || error);
            setError("Error saving attendance. Check server connection or data format.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="attendance-container loading-state">
                <FaSpinner className="spinner-icon" />
                <p>Loading Staff Data...</p>
            </div>
        );
    }
    
    if (staff.length === 0 && !error) {
         return (
            <div className="attendance-container error-state">
                <FaUsers />
                <p>No staff members found.</p>
            </div>
        );
    }

    return (
        <div className="attendance-container">
            <h1 className="attendance-title"><FaClock /> Staff Daily Attendance</h1>
            
            <form onSubmit={funsave}>
                
                <div className="date-selector-bar">
                    <label htmlFor="attendance-date"><FaCalendarAlt /> Select Date:</label>
                    <input
                        id="attendance-date"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        required
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>
                
                {error && <div className="message-box error-message">{error}</div>}
                
                <div className="attendance-table-wrapper">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Staff Name</th>
                                <th>Full Day</th>
                                <th>Half Day</th>
                                <th>Leave</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => (
                                <tr key={record.id} className={record.status === 'Leave' ? 'status-leave' : ''}>
                                    <td>{index + 1}</td>
                                    <td className="staff-name-col">{staff.find(m => m.id === record.id)?.name || 'N/A'}</td>
                                    
                                    <td className="radio-col">
                                        <input
                                            type="radio"
                                            name={`attendance_${record.id}`}
                                            value="Full"
                                            checked={record.status === 'Full'}
                                            onChange={(e) => handleRadioChange(e, record.id)}
                                            disabled={!selectedDate}
                                        />
                                        {record.status === 'Full' && <FaCheckCircle className="check-icon full-day" />}
                                    </td>
                                    
                                    <td className="radio-col">
                                        <input
                                            type="radio"
                                            name={`attendance_${record.id}`}
                                            value="Half"
                                            checked={record.status === 'Half'}
                                            onChange={(e) => handleRadioChange(e, record.id)}
                                            disabled={!selectedDate}
                                        />
                                        {record.status === 'Half' && <FaCheckCircle className="check-icon half-day" />}
                                    </td>
                                    
                                    <td className="radio-col">
                                        <input
                                            type="radio"
                                            name={`attendance_${record.id}`}
                                            value="Leave"
                                            checked={record.status === 'Leave'}
                                            onChange={(e) => handleRadioChange(e, record.id)}
                                            disabled={!selectedDate}
                                        />
                                        {record.status === 'Leave' && <FaTimesCircle className="check-icon leave-status" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button 
                    type='submit' 
                    className='save-button' 
                    disabled={isSaving || !selectedDate || staff.length === 0}
                >
                    <FaSave /> {isSaving ? 'Saving...' : 'Save Attendance'}
                </button>
            </form>
        </div>
    );
};

export default StaffAttendance;