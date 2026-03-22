import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { FaGraduationCap, FaSchool, FaBook, FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import '../CSS/Subject.css';

const SubjectRegistration = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [subjects, setSubjects] = useState({
    subject1: '',
    subject2: '',
    subject3: '',
    subject4: '',
    subject5: '',
    subject6: '',
  });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:7000/viewdepartment', {
        headers: {
          Authorization: `Bearer ${cookie.get('emtoken')}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setDepartments(response.data.dept || []);
      } else {
        setAuthError('Failed to load departments. Server returned unexpected response.');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setAuthError('Unable to load departments. Please try again later.');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);



  const handleDepartmentChange = (e) => {
    setDepartmentId(e.target.value);
    setSubjects({
      subject1: '', subject2: '', subject3: '', 
      subject4: '', subject5: '', subject6: '',
    });
    setAuthError('');
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjects((prev) => ({
      ...prev,
      [name]: value
    }));
    setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const token = cookie.get('emtoken'); 
    if (!token) {
      setAuthError('You must log in to submit the form.');
      return;
    }

    const subjectData = {
      departmentId,
      subject1: subjects.subject1,
      subject2: subjects.subject2,
      subject3: subjects.subject3,
      subject4: subjects.subject4,
      subject5: subjects.subject5,
      subject6: subjects.subject6,
    };

    try {
      setLoading(true); 
      const response = await axios.post('http://localhost:7000/subjectregister', subjectData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('Subjects Registered Successfully!');
        setDepartmentId('');
        setSubjects({
          subject1: '', subject2: '', subject3: '', 
          subject4: '', subject5: '', subject6: '',
        });
      } else {
        setAuthError('Failed to register subjects. Server returned unexpected response.');
      }
    } catch (error) {
      setAuthError(`Error registering subjects: ${error.response?.data?.msg || error.message}`);
      console.error('Error registering subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentDeptName = departments.find((d) => String(d.departId) === String(departmentId))?.departName || 'Department';

  return (
    <div className="form-container modern-layout-final">
      <header className="form-header">
        <h1 className="main-title"><FaBook className="icon-main" /> Subject Registration</h1>
        <p className="subtitle">Register the core subjects for a specific department.</p>
      </header>

      {authError && (
        <div className="alert-message alert-error">
          <FaTimesCircle />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="subject-form">
        <div className="form-step active-step">
          <h3 className="step-header">
            <span className="step-number">1</span>
            <FaSchool /> Select Department
          </h3>
          <div className="form-group">
            <label htmlFor="department">Department Name</label>
            <select
              id="department"
              value={departmentId}
              onChange={handleDepartmentChange}
              className="form-control"
              required
            >
              <option value="" disabled>-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept.departId} value={dept.departId}>
                  {dept.departName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`form-step ${!departmentId ? 'disabled-step' : 'active-step'}`}>
          <h3 className="step-header">
            <span className="step-number">2</span>
            <FaBook /> Enter Subjects for {currentDeptName}
          </h3>
          <div className="subjects-grid-2col">
            {['subject1', 'subject2', 'subject3', 'subject4', 'subject5', 'subject6'].map((subject, index) => (
              <div key={subject} className="form-group subject-input-item">
                <label htmlFor={subject}>Subject {index + 1} Name</label>
                <input
                  type="text"
                  id={subject}
                  name={subject}
                  value={subjects[subject]}
                  onChange={handleSubjectChange}
                  placeholder={`e.g., Data Structures`}
                  className="form-control"
                  required
                  disabled={!departmentId}
                />
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={!departmentId || loading}
        >
          {loading ? <FaSpinner className="spinner" /> : <FaCheckCircle />}
          {loading ? 'Registering Subjects...' : 'Register Subjects'}
        </button>
      </form>
    </div>
  );
};

export default SubjectRegistration;
