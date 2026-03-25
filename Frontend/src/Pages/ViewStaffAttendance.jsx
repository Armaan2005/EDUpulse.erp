import React, { useState } from 'react';
import axios from 'axios';
import {
  FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle,
  FaSearch, FaSpinner, FaClock
} from 'react-icons/fa';
import '../CSS/viewattendance.css';

const ViewStaffAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchAttendance = async () => {
    if (!selectedDate) { setError('Please select a date.'); return; }
    setLoading(true); setError(''); setData(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/viewStaffAttendanceByDate?date=${selectedDate}`,
        { withCredentials: true }
      );
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch attendance. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') fetchAttendance(); };

  const filtered = data?.attendance?.filter(r =>
    filter === 'All' ? true : r.status === filter
  ) || [];

  const statusIcon = (status) => {
    if (status === 'Full') return <FaCheckCircle className="va-icon va-present" />;
    if (status === 'Half') return <FaClock className="va-icon va-half" />;
    return <FaTimesCircle className="va-icon va-leave" />;
  };

  const statusLabel = (status) => {
    if (status === 'Full') return <span className="va-badge va-badge-present">Present</span>;
    if (status === 'Half') return <span className="va-badge va-badge-half">Half Day</span>;
    return <span className="va-badge va-badge-leave">Leave</span>;
  };

  return (
    <div className="va-container">
      <div className="va-header">
        <h1><FaUsers /> Staff Attendance — Date View</h1>
        <p className="va-subtitle">Admin Panel • Select any date to see who was present</p>
      </div>

      {/* Date Picker + Search */}
      <div className="va-search-bar">
        <div className="va-date-group">
          <FaCalendarAlt className="va-cal-icon" />
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            onKeyDown={handleKeyDown}
            className="va-date-input"
          />
        </div>
        <button className="va-search-btn" onClick={fetchAttendance} disabled={loading}>
          {loading ? <FaSpinner className="va-spin" /> : <FaSearch />}
          {loading ? ' Loading...' : ' View Attendance'}
        </button>
      </div>

      {error && <div className="va-error">{error}</div>}

      {/* Summary Cards */}
      {data && (
        <>
          <div className="va-summary">
            <div className="va-card va-card-total" onClick={() => setFilter('All')}>
              <span className="va-card-num">{data.summary.total}</span>
              <span className="va-card-label">Total Staff</span>
            </div>
            <div className="va-card va-card-present" onClick={() => setFilter('Full')}>
              <span className="va-card-num">{data.summary.present}</span>
              <span className="va-card-label">Present</span>
            </div>
            <div className="va-card va-card-half" onClick={() => setFilter('Half')}>
              <span className="va-card-num">{data.summary.half}</span>
              <span className="va-card-label">Half Day</span>
            </div>
            <div className="va-card va-card-leave" onClick={() => setFilter('Leave')}>
              <span className="va-card-num">{data.summary.leave}</span>
              <span className="va-card-label">On Leave</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="va-filter-tabs">
            {['All', 'Full', 'Half', 'Leave'].map(f => (
              <button
                key={f}
                className={`va-tab ${filter === f ? 'va-tab-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'Full' ? 'Present' : f === 'Leave' ? 'On Leave' : f}
                <span className="va-tab-count">
                  {f === 'All' ? data.summary.total
                    : f === 'Full' ? data.summary.present
                    : f === 'Half' ? data.summary.half
                    : data.summary.leave}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="va-table-wrapper">
            {filtered.length === 0 ? (
              <div className="va-empty">No records for selected filter.</div>
            ) : (
              <table className="va-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Staff Name</th>
                    <th>Staff ID</th>
                    <th>Status</th>
                    <th>Marked</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr key={row.id} className={`va-row va-row-${row.status.toLowerCase()}`}>
                      <td>{i + 1}</td>
                      <td className="va-name">
                        {statusIcon(row.status)} {row.name}
                      </td>
                      <td className="va-id">{row.id}</td>
                      <td>{statusLabel(row.status)}</td>
                      <td>{row.marked
                        ? <span className="va-marked yes">✓ Yes</span>
                        : <span className="va-marked no">✗ No</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewStaffAttendance;