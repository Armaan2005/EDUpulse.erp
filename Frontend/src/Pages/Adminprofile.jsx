import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaCity } from 'react-icons/fa';
import '../CSS/profiles.css'; 

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const fetchProfile = async () => {
        const token = cookie.get('emtoken');
        if (!token) {
            setError('You need to log in to view your profile.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:7000/adminprofile', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data.success) {
                setProfile(response.data.profile);
            } else {
                setError('Failed to fetch profile. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            if (error.response && error.response.status === 401) {
                 setError('Session expired. Please log in again.');
            } else {
                 setError('An error occurred while fetching your profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="profile-container">
            <div className="simple-card profile-loading">
                <div className="spinner"></div>
                <p>Loading Admin Profile...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="profile-container">
            <div className="simple-card profile-error">
                {error}
            </div>
        </div>
    );

    return (
        <div className="profile-container">
            {profile ? (
                <div className="simple-card">
                    
                    <div className="simple-header">
                        <FaUserCircle className="staff-photo-placeholder" /> 
                        <h2 className="profile-name">Admin Profile</h2>
                        <p className="profile-role">System Administrator</p>
                    </div>

                    <div className="simple-details">
            
                        <div className="detail-row">
                            <FaEnvelope className="detail-icon" />
                            <strong>Email:</strong> <span className="link-style">{profile.email}</span>
                        </div>
                       
                        <div className="detail-row">
                            <FaPhone className="detail-icon" />
                            <strong>Contact:</strong> <span>{profile.contact}</span>
                        </div>
                        <hr/>
                    
                        <div className="detail-row">
                            <FaBuilding className="detail-icon" />
                            <strong>Organization:</strong> <span>{profile.organization}</span>
                        </div>
                    
                        <div className="detail-row">
                            <FaCity className="detail-icon" />
                            <strong>City:</strong> <span>{profile.city}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="simple-card profile-not-found">
                    <p>⚠️ No Admin Profile Data available.</p>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;