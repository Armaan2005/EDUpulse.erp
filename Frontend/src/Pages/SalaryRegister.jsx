import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMoneyBillWave, FaSave, FaChevronLeft, FaSpinner } from "react-icons/fa";
import Cookies from "js-cookie";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const SalaryRegister = () => {

const navigate = useNavigate();

const [formData, setFormData] = useState({
department: "",
employee: "",
basicsalary: "",
allowance: "",
deduction: "",
paydate: "",
});

const [dept, setDept] = useState([]);
const [employees, setEmployees] = useState([]);
const [filteredEmployees, setFilteredEmployees] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

const fetchDept = useCallback(async () => {
try {
const res = await axios.get(`${BASE_URL}/viewdepartment`,{
    headers: {
        Authorization: `Bearer ${Cookies.get('emtoken')}`,
    },
    withCredentials: true,
});
setDept(res.data.dept);
} catch {
setError("Failed to fetch department data.");
}
}, []);

const fetchEmployees = useCallback(async () => {
try {
const res = await axios.get(`${BASE_URL}/viewstaff`, { headers: { Authorization: `Bearer ${Cookies.get('emtoken')}` }, withCredentials: true });
setEmployees(res.data.staff);
} catch (err) {
if (err.response?.status === 401) {
navigate("/login");
} else {
setError("Failed to fetch employee data.");
}
}
}, [navigate]);

useEffect(() => {
setLoading(true);
Promise.all([fetchDept(), fetchEmployees()]).finally(() => setLoading(false));
}, [fetchDept, fetchEmployees]);

useEffect(() => {

setFormData(prev => ({ ...prev, employee: "" }));

if (formData.department) {
const filtered = employees.filter(emp => emp.department === formData.department);
setFilteredEmployees(filtered);
} else {
setFilteredEmployees([]);
}

}, [formData.department, employees]);

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {

e.preventDefault();

setSubmitMessage({ type: "loading", text: "Processing Salary Record..." });

try {

const payload = {
...formData,
basicsalary: parseFloat(formData.basicsalary) || 0,
allowance: parseFloat(formData.allowance) || 0,
deduction: parseFloat(formData.deduction) || 0,
};

const res = await axios.post(`${BASE_URL}/salaryregister`, payload, {
headers: {
Authorization: `Bearer ${Cookies.get('emtoken')}`,
},
withCredentials: true,
});

if (res.status === 200 || res.status === 201) {

setSubmitMessage({ type: "success", text: "Salary registered successfully!" });

setFormData({
department: "",
employee: "",
basicsalary: "",
allowance: "",
deduction: "",
paydate: "",
});

setTimeout(() => navigate("/dashboard"), 1500);

}

} catch (err) {

setSubmitMessage({
type: "error",
text: err.response?.data?.msg || err.response?.data?.message || "Salary registration failed"
});

}

};

const netSalary = (
parseFloat(formData.basicsalary || 0) +
parseFloat(formData.allowance || 0) -
parseFloat(formData.deduction || 0)
).toFixed(2);

return (

<div className="salary-page__containers flex justify-center items-start p-[40px_20px] bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 min-h-screen font-sans">

<div className="salary-card__wraps bg-white/90 backdrop-blur-md p-[30px_40px] rounded-xl shadow-xl w-full max-w-[800px]">

<div className="salary-card__headers flex justify-between items-center border-b-2 border-indigo-100 pb-4 mb-6">

<h1 className="salary-card__titles text-[1.8rem] text-indigo-700 font-bold flex items-center">

<FaMoneyBillWave className="title__icons mr-3 text-indigo-500"/>

New Salary Payment

</h1>

<button
onClick={() => navigate(-1)}
className="header__back-buttons bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-2 rounded text-sm hover:bg-indigo-100 hover:text-indigo-800 flex items-center gap-2"
>
<FaChevronLeft/> Back
</button>

</div>

{submitMessage.text && (

<div className={`message__bars p-4 mb-5 rounded-lg font-medium text-center
${submitMessage.type === "success" && "bg-green-100 text-green-900 border border-green-300"}
${submitMessage.type === "error" && "bg-red-100 text-red-800 border border-red-300"}
${submitMessage.type === "loading" && "bg-blue-100 text-blue-800 border border-blue-300"}
`}>

{submitMessage.type === "loading" && <FaSpinner className="animate-spin inline mr-2"/>}

{submitMessage.text}

</div>

)}

<form onSubmit={handleSubmit} className="salary-forms flex flex-col gap-6">


<div className="form-sections form-section--selectors grid grid-cols-2 gap-5 p-4 rounded-lg bg-indigo-50 border border-indigo-100">

<div className="form-groups flex flex-col">

<label className="form-labels font-semibold text-gray-800 mb-2 text-sm">
Department
</label>

<select
name="department"
value={formData.department}
onChange={handleChange}
required
className="form-inputs p-3 border border-gray-300 rounded w-full bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
>

<option value="">Select Department</option>

{dept.map(d => (
<option key={d._id} value={d.departId}>
{d.departName}
</option>
))}

</select>

</div>

<div className="form-groups flex flex-col">

<label className="form-labels font-semibold text-gray-800 mb-2 text-sm">
Employee
</label>

<select
name="employee"
value={formData.employee}
onChange={handleChange}
required
disabled={!formData.department}
className="form-inputs p-3 border border-gray-300 rounded w-full bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
>

<option value="">Select Employee</option>

{filteredEmployees.map(emp => (
<option key={emp._id} value={emp.name}>
{emp.name} ({emp.employeeId})
</option>
))}

</select>

</div>

</div>


<div className="form-sections form-section--finances grid grid-cols-3 gap-5 p-4 rounded-lg bg-indigo-50 border border-indigo-100">

<div className="form-groups flex flex-col">

<label className="form-labels font-semibold text-gray-800 mb-2 text-sm">
Basic Salary
</label>

<input
type="number"
name="basicsalary"
value={formData.basicsalary}
onChange={handleChange}
required
className="form-inputs p-3 border border-gray-300 rounded w-full bg-white"
/>

</div>

<div className="form-groups flex flex-col">

<label className="form-labels font-semibold text-gray-800 mb-2 text-sm">
Allowance
</label>

<input
type="number"
name="allowance"
value={formData.allowance}
onChange={handleChange}
className="form-inputs p-3 border border-gray-300 rounded w-full bg-white"
/>

</div>

<div className="form-groups flex flex-col">

<label className="form-labels font-semibold text-gray-800 mb-2 text-sm">
Deduction
</label>

<input
type="number"
name="deduction"
value={formData.deduction}
onChange={handleChange}
className="form-inputs p-3 border border-gray-300 rounded w-full bg-white"
/>

</div>

</div>


<div className="form-sections form-section--final grid grid-cols-[2fr_3fr] gap-5 items-end p-4 rounded-lg bg-indigo-100 border border-indigo-200">

<div className="form-groups flex flex-col">

<label className="form-labels font-semibold text-gray-800 mb-2 text-sm">
Pay Date
</label>

<input
type="date"
name="paydate"
value={formData.paydate}
onChange={handleChange}
required
className="form-inputs p-3 border border-gray-300 rounded w-full bg-white"
/>

</div>

<div className="net-salary__displays flex flex-col p-[10px_15px] bg-emerald-500 text-white rounded text-right h-full justify-center">

<span className="net-salary__labell text-sm font-medium mb-1">
Net Salary
</span>

<span className="net-salary__values text-2xl font-bold">
₹ {netSalary}
</span>

</div>

</div>

<div className="form-actions mt-5 text-center">

<button
type="submit"
disabled={loading}
className="form-button__submits bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-8 rounded-lg text-lg font-semibold w-full max-w-[400px] inline-flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-blue-700 disabled:bg-indigo-300"
>

{loading ? (
<>
<FaSpinner className="animate-spin"/>
Saving...
</>
) : (
<>
<FaSave/>
Register Salary
</>
)}

</button>

</div>

</form>

</div>

</div>

);

};

export default SalaryRegister;