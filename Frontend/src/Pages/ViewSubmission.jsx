import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { 
    FaListAlt, FaUserGraduate, FaEnvelope, FaFilePdf, FaEdit, 
    FaSpinner, FaTimesCircle, FaLink, FaCalendarAlt, FaIdBadge, FaHourglassHalf 
} from 'react-icons/fa';
import '../CSS/viewsubmissionss.css';
const FILE_BASE_URL = 'http://localhost:7000/uploads/'; 

const ViewSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const fetchSubmissions = async () => {
        const token = cookie.get('emtoken');
        if (!token) {
            setError("You need to be logged in. Redirecting to login...");
            setTimeout(() => navigate('/login'), 2000);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:7000/viewsubmission', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const sortedSubmissions = response.data.submission.sort((a, b) => 
                new Date(b.submissionDate) - new Date(a.submissionDate)
            );
            setSubmissions(sortedSubmissions); 
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError('Failed to fetch submissions. Please check the server connection or API endpoint.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleAddRemarkClick = (submissionId) => {
        navigate(`/AssFeed/${submissionId}`);
    };

 
    
    if (error) {
        return (
            <div className="submissions-container error-state">
                <FaTimesCircle className="status-icon" />
                <p>{error}</p>
                <button className="error-button" onClick={() => navigate('/')}>Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="submissions-container">
            <h1 className="page-title"><FaListAlt /> All Submitted Assignments ({submissions.length})</h1>
            
            {submissions.length === 0 ? (
                <div className="no-data-state">
                    <FaHourglassHalf className="status-icon" />
                    <p>No assignment submissions found yet for your assigned list.</p>
                </div>
            ) : (
                <div className="submission-list">
                    {submissions.map((submission) => {
                        const fullPdfUrl = submission.submissionFile 
                                         ? `${FILE_BASE_URL}${submission.submissionFile}` 
                                         : null;

                        return (
                            <div key={submission._id} className="submission-row-card">
                                <div className="card-primary-details">
                                    <h3 className="student-name-header">
                                        <FaUserGraduate /> {submission.studentName || 'Unknown Student'}
                                    </h3>
                                    <p className="student-id-highlight">
                                        <FaIdBadge /> Student ID: <strong>{submission.studentId || 'N/A'}</strong>
                                    </p>
                                    <p className="submission-date-info">
                                        <FaCalendarAlt /> Submitted On: <span>{formatDate(submission.submissionDate)}</span>
                                    </p>
                                </div>
                                
                                <div className="card-secondary-details">
                                    <p className="assignment-id-info">
                                        Assignment ID: {submission.assignId || 'N/A'}
                                    </p>
                                    <p className="email-info">
                                        <FaEnvelope /> {submission.studentEmail || 'N/A'}
                                    </p>
                                    <p className="record-id-info">
                                        Record ID: {submission._id}
                                    </p>
                                </div>

                                <div className="card-actions">
                                    {fullPdfUrl ? (
                                        <a href={fullPdfUrl} target="_blank" rel="noopener noreferrer" className="action-button view-pdf-button">
                                            <FaLink /> View File
                                        </a>
                                    ) : (
                                        <span className="file-missing-tag">
                                            <FaTimesCircle /> File Missing
                                        </span>
                                    )}
                                    
                                    <button onClick={() => handleAddRemarkClick(submission._id)} className="action-button remark-button">
                                        <FaEdit /> Grade & Feedback
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ViewSubmissions;