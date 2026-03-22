import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { FaGraduationCap, FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const ExamMarksRegistration = () => {
  const [departments, setDepartments] = useState([]);
  const [branch, setBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [examType, setExamType] = useState('');
  const [marks, setMarks] = useState({ subject1: '', subject2: '', subject3: '', subject4: '', subject5: '', subject6: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = cookie.get('emtoken') || cookie.get('emstoken');
    if (!token) {
      setError('Login required');
      return;
    }

    const fetch = async () => {
      try {
        const [depRes, stuRes] = await Promise.all([
          axios.get('http://localhost:7000/viewdepartment', { withCredentials: true }),
          axios.get('http://localhost:7000/viewstudent', { withCredentials: true }),
        ]);

        const deptData = depRes.data?.dept || depRes.data?.departments || [];
        const studentData = stuRes.data?.student || stuRes.data?.students || [];

        setDepartments(deptData);
        setStudents(studentData);
      } catch (e) {
        console.error('Marks fetch error', e);
        setError('Unable to load data');
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    if (!branch) {
      setFilteredStudents([]);
      setStudentId('');
      setExamType('');
      return;
    }

    const matched = students.filter((s) => {
      const studentDept = (s.department || '').toLowerCase();
      const depObj = departments.find((d) => String(d.departId) === String(branch));
      return (studentDept === String(branch).toLowerCase() || studentDept === (depObj?.departName || '').toLowerCase());
    });

    setFilteredStudents(matched);
    setStudentId('');
    setExamType('');
  }, [branch, students, departments]);

  const changeMark = (key, value) => setMarks((p) => ({ ...p, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!studentId || !examType) {
      setError('Select student + exam type');
      return;
    }

    const token = cookie.get('emtoken') || cookie.get('emstoken');
    if (!token) return setError('Login required');

    const urls = { ut1: '/unittest1', ut2: '/unittest2', midterm: '/midTerm', final: '/final' };
    const url = urls[examType];
    if (!url) return setError('Invalid exam type');

    setLoading(true);
    try {
      await axios.post('http://localhost:7000' + url, { studentId, ...marks }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      setMarks({ subject1: '', subject2: '', subject3: '', subject4: '', subject5: '', subject6: '' });
      setStudentId('');
      setExamType('');
      setBranch('');
      setError('');
      alert('Submitted');
    } catch (err) {
      setError('Submit failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = filteredStudents.find((s) => String(s.id) === String(studentId));

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <header className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
          <FaGraduationCap className="text-indigo-600" />
          <h1 className="text-2xl font-semibold text-slate-800">Marks Submission</h1>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <FaTimesCircle className="inline mr-2" /> {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Department</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">-- Select --</option>
                {departments.map((d) => (
                  <option key={d.departId} value={d.departId}>{d.departName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                disabled={!branch || filteredStudents.length === 0}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
              >
                <option value="">-- Select --</option>
                {filteredStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo ?? 'N/A'})</option>
                ))}
              </select>
            </div>
          </div>

          {selectedStudent && (
            <div className="rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
              {selectedStudent.name} | Student Id: {selectedStudent.id ?? 'N/A'}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              required
              disabled={!studentId}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
            >
              <option value="">-- Select --</option>
              <option value="ut1">UT1</option>
              <option value="ut2">UT2</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
            </select>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {['subject1', 'subject2', 'subject3', 'subject4', 'subject5', 'subject6'].map((sub, i) => (
              <div key={sub}>
                <label className="block text-sm font-medium text-slate-700">Subject {i + 1}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marks[sub]}
                  onChange={(e) => changeMark(sub, e.target.value)}
                  required
                  disabled={!examType}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!examType || !studentId || loading}
          >
            {loading ? <FaSpinner className="inline mr-2 animate-spin" /> : <FaCheckCircle className="inline mr-2" />}
            {loading ? 'Submitting...' : 'Submit Marks'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamMarksRegistration;