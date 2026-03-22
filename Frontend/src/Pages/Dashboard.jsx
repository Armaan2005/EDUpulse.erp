import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar,
    Typography, Button, ListItemIcon, Collapse, Divider, Paper, Grid,
    Tooltip, IconButton, CircularProgress
} from '@mui/material';
import {
    AccessTime, People, School, RateReview, BusAlert, Business, AttachMoney,
    NotificationsOutlined, LocalLibrary, ExpandLess, ExpandMore, Hotel, Logout,
    AccountCircle, Dashboard as DashboardIcon, MenuBook, BedroomChild, Subject
} from '@mui/icons-material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip,
    Legend, ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

const drawerWidth = 260;
const primaryColor = '#815f9b';
const sidebarBg = '#ffffff';
const headerBg = '#ffffff';
const contentBg = '#f2f2f8';
const purpleHover = '#e0e0f0';
const darkPurple = '#594473';

const API_BASE_URL = 'http://localhost:7000'; 
const feedbackBucketsDefault = [
    { rating: 'Excellent (8-10)', count: 0 },
    { rating: 'Good (5-7)', count: 0 },
    { rating: 'Needs Improvement (1-4)', count: 0 },
];

const GradientMetricCard = ({ title, value, icon, change, color1, color2 }) => (
    <Paper
        elevation={8}
        sx={{
            background: `linear-gradient(to right, ${color1}, ${color2})`,
            p: 3,
            borderRadius: '12px',
            color: '#ffffff',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        {React.cloneElement(icon, { sx: {
            position: 'absolute', top: 20, right: 20, fontSize: 60, opacity: 0.3, color: '#fff'
        } })}

        <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 1, zIndex: 10 }}>
            {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, zIndex: 10 }}>
            
            {value === null || value === "" ? <CircularProgress size={24} color="inherit" /> : value.toLocaleString()}{title.includes("%") ? '%' : ''}
            {title.includes("Sales") && (
                <Typography component="span" variant="h3" sx={{ fontWeight: 800 }}>
                    <AttachMoney sx={{ fontSize: '1.8rem', verticalAlign: 'top', ml: 0.5 }} />
                </Typography>
            )}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, zIndex: 10 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mr: 1 }}>
                {change}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {change.includes('+') ? 'Increased by' : 'Decreased by'} {Math.abs(parseFloat(change))}%
            </Typography>
        </Box>
    </Paper>
);

const VisitSalesChart = ({ chartTitle, data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { usePointStyle: true, boxWidth: 8, padding: 20, color: darkPurple }
            },
            title: { display: false },
            chartTooltip: { mode: 'index', intersect: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { drawBorder: false, color: '#e5e5e5' } },
            x: { grid: { display: false } },
        },
    };

    return (
        <Paper elevation={8} sx={{ p: 3, borderRadius: '12px', height: '100%', bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ color: darkPurple, fontWeight: 600, mb: 3 }}>
                {chartTitle}
            </Typography>
            <Box sx={{ height: '350px' }}>
                <Bar data={data} options={options} />
            </Box>
        </Paper>
    );
};

const TrafficSourcesChart = ({ chartTitle, data, isLoading }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 15,
                    color: darkPurple,
                    generateLabels: (chart) => {
                        const labels = chart.data.labels;
                        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentages = chart.data.datasets[0].data.map(val => Math.round(val / (total || 1) * 100));
                        const colors = chart.data.datasets[0].backgroundColor;

                        return labels.map((label, i) => ({
                            text: `${label} (${percentages[i]}%)`,
                            fillStyle: colors[i],
                            hidden: false,
                            index: i
                        }));
                    }
                }
            },
            title: { display: false },
            chartTooltip: { enabled: true },
        },
    };

    return (
        <Paper elevation={8} sx={{ p: 3, borderRadius: '12px', height: '100%', bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ color: darkPurple, fontWeight: 600, mb: 3 }}>
                {chartTitle}
            </Typography>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
                    <CircularProgress sx={{ color: primaryColor }} /> 
                    <Typography variant="body2" sx={{ ml: 2, color: darkPurple }}>Loading feedback data...</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', height: '350px' }}>
                    <Doughnut data={data} options={options} />
                </Box>
            )}
        </Paper>
    );
};

const FeedbackOverview = ({ feedbacks, isLoading, onViewAll }) => (
    <Paper elevation={8} sx={{ p: 3, borderRadius: '14px', height: '100%', bgcolor: '#ffffff', border: '1px solid #ececf5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RateReview sx={{ color: darkPurple, mr: 1, fontSize: 28 }} />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: darkPurple, lineHeight: 1.2 }}>
                        Latest Feedback
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8a94a6' }}>
                        Recent responses from users
                    </Typography>
                </Box>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#8a94a6' }}>
                {feedbacks.length} items
            </Typography>
        </Box>
        <Divider sx={{ mb: 2, borderColor: '#e8eaf2' }} />
        <List disablePadding sx={{ maxHeight: 360, overflowY: 'auto', pr: 0.5 }}>
            {isLoading ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <CircularProgress size={30} sx={{ color: primaryColor }} /> 
                    <Typography variant="body2" sx={{ mt: 1, color: darkPurple }}>Loading feedback...</Typography>
                </Box>
            ) : feedbacks.length > 0 ? (
                feedbacks.slice(0, 6).map((feedback, index) => (
                    <ListItem key={index} secondaryAction={
                        <Typography variant="caption" sx={{ color: '#9AA3B2', fontWeight: 600 }}>
                            {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                        </Typography>
                    } sx={{ borderBottom: '1px solid #f2f2f8', '&:last-child': { borderBottom: 'none' }, py: 1.4, borderRadius: 1, '&:hover': { backgroundColor: '#f8f9fc' } }}>
                        <ListItemIcon sx={{ minWidth: 35 }}><RateReview sx={{ color: primaryColor, fontSize: 20 }} /></ListItemIcon>
                        <ListItemText
                            primary={`Rating: ${feedback.rating || 0}/10`}
                            secondary={feedback.comment || 'No comment provided'}
                            primaryTypographyProps={{ fontWeight: 700, color: darkPurple, fontSize: 14.5 }}
                            secondaryTypographyProps={{ style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}
                        />
                    </ListItem>
                ))
            ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="body2" sx={{ mt: 1, color: darkPurple }}>No feedback found.</Typography>
                </Box>
            )}
        </List>
        <Button size="small" variant="contained" onClick={onViewAll} sx={{ mt: 2, bgcolor: primaryColor, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: darkPurple } }}>View All Feedback</Button>
    </Paper>
);

const DepartmentWidget = ({ departments, isLoading, onViewAll }) => (
    <Paper elevation={8} sx={{ p: 3, borderRadius: '14px', height: '100%', bgcolor: '#ffffff', border: '1px solid #ececf5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ color: darkPurple, mr: 1, fontSize: 26 }} />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: darkPurple, lineHeight: 1.2 }}>
                        Departments
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8a94a6' }}>
                        Active academic units
                    </Typography>
                </Box>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#8a94a6' }}>
                {departments.length} total
            </Typography>
        </Box>
        <Divider sx={{ mb: 2, borderColor: '#e8eaf2' }} />

        {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 7 }}>
                <CircularProgress size={28} sx={{ color: primaryColor }} />
                <Typography variant="body2" sx={{ mt: 1, color: darkPurple }}>Loading departments...</Typography>
            </Box>
        ) : (
            <List disablePadding sx={{ maxHeight: 310, overflowY: 'auto' }}>
                {departments.length > 0 ? (
                    departments.slice(0, 8).map((dept, idx) => (
                        <ListItem key={dept._id || idx} sx={{ px: 0, py: 1, borderBottom: '1px solid #f2f2f8', '&:last-child': { borderBottom: 'none' } }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: primaryColor }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={dept.departName || 'Unnamed Department'}
                                primaryTypographyProps={{ fontWeight: 600, color: darkPurple, fontSize: 14 }}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ color: darkPurple, py: 4, textAlign: 'center' }}>
                        No departments found.
                    </Typography>
                )}
            </List>
        )}

        <Button
            size="small"
            variant="contained"
            onClick={onViewAll}
            sx={{ mt: 2, bgcolor: primaryColor, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: darkPurple } }}
        >
            View Departments
        </Button>
    </Paper>
);

const SimpleMetricCard = ({ title, value, icon, bgColor, isPercentage = true }) => (
    <Paper
        elevation={4}
        sx={{
            p: 3,
            borderRadius: '12px',
            bgcolor: bgColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
        }}
    >
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {value === null || value === "" ? <CircularProgress size={24} color="inherit" /> : `${value.toLocaleString()}${isPercentage ? '%' : ''}`}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', mt: 1 }}>
                {title}
            </Typography>
        </Box>
        {React.cloneElement(icon, { sx: { fontSize: 40, opacity: 0.8 } })}
    </Paper>
);

const Dashboard = () => {
    const navigate = useNavigate();

    const [metrics, setMetrics] = useState({
        booksIssued: null, 
        totalBooks: null,
        totalRooms: null,
        roomsOccupied: null, 
        totalStudents: null,
        totalStaff: null,
        hostelOccupancy: null, 
        transportOpted: 85,
        libraryMembership: 90,
        totalRoutes: null,
        totalDrivers: null,
    });
    const [feedbackData, setFeedbackData] = useState(feedbackBucketsDefault);
    const [feedbackList, setFeedbackList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [loadingFeedback, setLoadingFeedback] = useState(true);

    const fetchData = async (url, options = {}) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                console.error(`Fetch failed with status: ${response.status} from ${url}`);
                return null;
            }
            return response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    };


    const handleFetchMetricsAndNotices = async () => {
        setLoadingMetrics(true);
        try {
            const token = Cookies.get('emtoken');
            const metricsResponse = await fetchData(`${API_BASE_URL}/dashboard`); 

            if (metricsResponse && metricsResponse.success && metricsResponse.data) {
                const totalRooms = metricsResponse.data.total || 0;
                const roomsOccupied = metricsResponse.data.roomsOccupied || 0;
                const occupancy = totalRooms > 0 ? Math.round((roomsOccupied / totalRooms) * 100) : 0;

                setMetrics(prevMetrics => ({
                    ...prevMetrics,
                    booksIssued: metricsResponse.data.issued ?? 0,
                    totalBooks: metricsResponse.data.totalStock ?? 0,
                    totalRooms: totalRooms,
                    totalStudents: metricsResponse.data.students ?? 0,
                    totalStaff: metricsResponse.data.staff ?? 0,
                    roomsOccupied: roomsOccupied,
                    hostelOccupancy: occupancy,
                    transportOpted: metricsResponse.data.transportOpted ?? prevMetrics.transportOpted ?? 0,
                    libraryMembership: metricsResponse.data.libraryMembership ?? prevMetrics.libraryMembership ?? 0,
                }));
            } else {
                console.warn("Metrics data fetch failed or returned an empty payload.");
                setMetrics(prevMetrics => ({
                    ...prevMetrics,
                    booksIssued: 0, totalBooks: 0, totalRooms: 0, totalStudents: 0, totalStaff: 0, roomsOccupied: 0, hostelOccupancy: 0
                }));
            }
            const [routesResponse, driversResponse, departmentsResponse] = await Promise.all([
                fetchData(`${API_BASE_URL}/viewroutes`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    credentials: 'include'
                }),
                fetchData(`${API_BASE_URL}/viewdrivers`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    credentials: 'include'
                }),
                fetchData(`${API_BASE_URL}/viewdepartment`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    credentials: 'include'
                })
            ]);

            setMetrics(prevMetrics => ({
                ...prevMetrics,
                totalRoutes: Array.isArray(routesResponse?.routes) ? routesResponse.routes.length : 0,
                totalDrivers: Array.isArray(driversResponse?.driver) ? driversResponse.driver.length : 0,
            }));
            setDepartments(Array.isArray(departmentsResponse?.dept) ? departmentsResponse.dept : []);

        } catch (error) {
            console.error("API Fetch Error (Metrics/Notices):", error);
            setMetrics(prevMetrics => ({
                ...prevMetrics,
                booksIssued: 0, totalBooks: 0, totalRooms: 0, totalStudents: 0, totalStaff: 0, roomsOccupied: 0, hostelOccupancy: 0, totalRoutes: 0, totalDrivers: 0
            }));
        } finally {
            setLoadingMetrics(false);
        }
    };

    const handleFetchFeedback = async () => {
        setLoadingFeedback(true);
        try {
       
            const token = Cookies.get('emtoken');
            const response = await fetchData(`${API_BASE_URL}/viewfeedback`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                credentials: 'include'
            });

            if (response && response.success && Array.isArray(response.feedback) && response.feedback.length > 0) {
                const feedbacks = response.feedback;
                setFeedbackList(feedbacks);
                const grouped = feedbacks.reduce((acc, item) => {
                    const rating = Number(item.rating) || 0;
                    if (rating >= 8) acc[0].count += 1;
                    else if (rating >= 5) acc[1].count += 1;
                    else acc[2].count += 1;
                    return acc;
                }, [
                    { rating: 'Excellent (8-10)', count: 0 },
                    { rating: 'Good (5-7)', count: 0 },
                    { rating: 'Needs Improvement (1-4)', count: 0 },
                ]);
                setFeedbackData(grouped); 
            } else {
                setFeedbackData(feedbackBucketsDefault);
                setFeedbackList([]);
            }
        } catch (error) {
            console.error("API Fetch Error (Feedback):", error);
            setFeedbackData(feedbackBucketsDefault);
            setFeedbackList([]);
        } finally {
            setLoadingFeedback(false);
        }
    };

    useEffect(() => {
        handleFetchMetricsAndNotices();
        handleFetchFeedback();
    }, []);

    const [openAttendance, setOpenAttendance] = useState(false);
    const [openStaff, setOpenStaff] = useState(false);
    const [openStudent, setOpenStudent] = useState(false);
    const [openDepartment, setOpenDepartment] = useState(false);
    const [openSalary, setOpenSalary] = useState(false);
    const [openLibrary, setOpenLibrary] = useState(false);
    const [openNotice, setOpenNotice] = useState(false);
    const [openHostel, setOpenHostel] = useState(false);
    const [openTransport, setOpenTransport] = useState(false);

    const coreMetricsConfig = [
        { title: "Books Issued", value: metrics.booksIssued, change: '+15%', color1: '#ff5e62', color2: '#ff9966', icon: <MenuBook /> },
        { title: "Total Books", value: metrics.totalBooks, change: '-2%', color1: '#4a92e8', color2: '#89b6f8', icon: <LocalLibrary /> },
        { title: "Total Rooms", value: metrics.totalRooms, change: '+0%', color1: '#2af598', color2: '#009efd', icon: <BedroomChild /> },
        { title: "No. of Students", value: metrics.totalStudents, change: '+12%', color1: '#3ddcff', color2: '#6fe8e8', icon: <School /> },
        { title: "No. of Staff", value: metrics.totalStaff, change: '+5%', color1: '#ffa800', color2: '#ffcc66', icon: <People /> },
        { title: "No. of Routes", value: metrics.totalRoutes, change: '+0%', color1: '#8e44ad', color2: '#c0392b', icon: <BusAlert /> },
        { title: "No. of Drivers", value: metrics.totalDrivers, change: '+0%', color1: '#16a085', color2: '#27ae60', icon: <People /> },
    ];
    const extraMetricsConfig = [
        { title: "Hostel Occupancy", value: metrics.hostelOccupancy, bgColor: primaryColor, icon: <Hotel /> },
        { title: "Transport Opted", value: metrics.transportOpted, bgColor: '#ff9966', icon: <BusAlert /> },
        { title: "Library Membership", value: metrics.libraryMembership, bgColor: '#4a92e8', icon: <LocalLibrary /> },
    ];

    const dynamicFeedbackChartData = feedbackData ? {
        labels: feedbackData.map(item => item.rating), 
        datasets: [
            {
                data: feedbackData.map(item => item.count),
                backgroundColor: ['#2af598', '#4a92e8', '#ff5e62'], 
                hoverBackgroundColor: ['#1fc780', '#3a7ac8', '#e04a52'],
                borderWidth: 0,
            },
        ],
    } : { labels: [], datasets: [{ data: [] }] };

    const navigateTo = (route) => { navigate(route); };
    const toggleAttendance = () => setOpenAttendance(!openAttendance);
    const toggleNotice = () => setOpenNotice(!openNotice);
    const toggleLibrary = () => setOpenLibrary(!openLibrary);
    const toggleDepartment = () => setOpenDepartment(!openDepartment);
    const toggleSalary = () => setOpenSalary(!openSalary);
    const toggleStaff = () => setOpenStaff(!openStaff);
    const toggleStudent = () => setOpenStudent(!openStudent);
    const toggleHostel = () => setOpenHostel(!openHostel);
    const toggleTransport = () => setOpenTransport(!openTransport);


    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: '/', alwaysOpen: true },
        {
            text: "Attendance", icon: <AccessTime />, onClick: toggleAttendance, open: openAttendance,
            subItems: [{ text: "Staff Attendance", path: '/StaffAttendance' }]
        },
        {
            text: "Staff Details", icon: <People />, onClick: toggleStaff, open: openStaff,
            subItems: [
                { text: "Staff Registration", path: '/StaffRegistration' },
                { text: "View Staff", path: '/ViewStaff' }
            ]
        },
        {
            text: "Student Details", icon: <School />, onClick: toggleStudent, open: openStudent,
            subItems: [
                { text: "View Student", path: '/ViewStudent' },
                { text: "Student Registration", path: '/Admission' }
            ]
        },
        { text: "Feedback", icon: <RateReview />, path: '/ViewFeedback' }, 
        
        { text: "Subject Management", icon: <Subject />, path: '/SubjectRegistration' },

        {
            text: "Department", icon: <Business />, onClick: toggleDepartment, open: openDepartment,
            subItems: [
                { text: "Department Register", path: '/DeptRegistration' },
                { text: "View Department", path: '/ViewDepartment' }
            ]
        },
        {
            text: "Salary", icon: <AttachMoney />, onClick: toggleSalary, open: openSalary,
            subItems: [
                { text: "Salary Register", path: '/SalaryRegistration' },
                { text: "View Salary", path: '/ViewSalary' },
                { text:"Salary Payment", path: '/payment'},
            ]
        },
        {
            text: "Notice", icon: <NotificationsOutlined />, onClick: toggleNotice, open: openNotice,
            subItems: [
                { text: "Drop Notice", path: '/Notice' },
                { text: "View Notices", path: '/ViewNotice2' } 
            ]
        },
        {
            text: "Hostel", icon: <Hotel />, onClick: toggleHostel, open: openHostel,
            subItems: [
                { text: "Add Room", path: '/addroom' },
                {text: "View Student Details" ,path: '/adminviewstudentdetails'},
                { text: "Hostel Fee Status", path: '/viewhostel' },
            ]
        },
        {
            text: "Library", icon: <LocalLibrary />, onClick: toggleLibrary, open: openLibrary,
            subItems: [
                { text: "Add Book", path: '/AddBook' },
                { text: "View Book", path: '/ViewBook2' },
                { text: "View Penalty", path: '/viewpenalty' },
                {text: "Issued Books", path: '/currentissued'},
                { text: "Book Activity", path: '/bookactivity' }, 

            ]
        },
        {
            text: "Transport", icon: <BusAlert />, onClick: toggleTransport, open: openTransport,
            subItems: [
                { text: "Update Bus Condition", path: '/busconditionupdate' },
                { text: "View Bus Condition", path: '/busconditionview' },
                { text: "Driver Details", path: '/driverdetail' },
                { text: "View Drivers", path: '/driverdetailview' },
                { text: "Add Routes", path: '/addroute' },
                { text: "View Routes", path: '/viewroutes'},
                { text: "View Student (Transport)", path: '/viewallstudenttransport'},
                { text: "Track Live Bus", path: '/liveTracker'}
            ]
        },
        { text: "Admin Profile", icon: <AccountCircle />, path: '/Adminprofile' },
    ];

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: contentBg }}>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth, flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: sidebarBg,
                        color: darkPurple,
                        borderRight: '1px solid #e0e0e0',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Toolbar sx={{ backgroundColor: sidebarBg, py: 2, justifyContent: 'center', borderBottom: '1px solid #eee' }}>
                    <Typography variant="h4" sx={{ color: primaryColor, fontWeight: 900, letterSpacing: 1 }}>
                        EduPulse
                    </Typography>
                </Toolbar>

                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <img
                        src="https://i.pravatar.cc/50?img=68"
                        alt="Profile"
                        style={{ borderRadius: '50%', width: 40, height: 40, marginRight: 10 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: darkPurple }}>
                            Admin User
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                            ERP Manager
                        </Typography>
                    </Box>
                </Box>

                <List sx={{ pt: 0, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: primaryColor, borderRadius: '4px' } }}>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                button
                                onClick={item.path ? () => navigateTo(item.path) : item.onClick}
                                sx={{
                                    py: 1.2,
                                    px: 2,
                                    '&:hover': { backgroundColor: purpleHover },
                                    ...(item.path === '/' && { backgroundColor: purpleHover, borderLeft: `5px solid ${primaryColor}` })
                                }}
                            >
                                <ListItemIcon sx={{ color: primaryColor }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.95rem' } }} />
                                {item.subItems && (item.open ? <ExpandLess sx={{ color: primaryColor }}/> : <ExpandMore sx={{ color: primaryColor }}/>)}
                            </ListItem>
                            {item.subItems && (
                                <Collapse in={item.open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <ListItem key={subIndex} button onClick={() => navigateTo(subItem.path)} sx={{ pl: 6, py: 0.8, backgroundColor: '#f9f9f9', '&:hover': { backgroundColor: purpleHover } }}>
                                                <ListItemText primary={subItem.text} sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
                <ListItem button onClick={() => navigateTo('/AdminLogin')} sx={{ position: 'sticky', bottom: 0, mt: 'auto', borderTop: '1px solid #eee', bgcolor: sidebarBg, '&:hover': { backgroundColor: purpleHover } }}>
                    <ListItemIcon sx={{ color: primaryColor }}><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.95rem', color: primaryColor } }} />
                </ListItem>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: `calc(100% - ${drawerWidth}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{
                    flexGrow: 1,
                    p: 3,
                    overflowY: 'auto',
                    pt: 3,
                }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DashboardIcon sx={{ color: primaryColor, mr: 1.5, fontSize: 30 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: darkPurple }}>
                                Dashboard Overview
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {coreMetricsConfig.map((metric, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                <GradientMetricCard
                                    title={metric.title}
                                    value={metric.value}
                                    icon={metric.icon}
                                    change={metric.change}
                                    color1={metric.color1}
                                    color2={metric.color2}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} lg={4}>
                            <TrafficSourcesChart
                                chartTitle="Overall Feedback Distribution (1-10 Rating Scale)"
                                data={dynamicFeedbackChartData}
                                isLoading={loadingFeedback || !feedbackData}
                            />
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <FeedbackOverview feedbacks={feedbackList} isLoading={loadingFeedback} onViewAll={() => navigateTo('/ViewFeedback')} />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <DepartmentWidget
                                departments={departments}
                                isLoading={loadingMetrics}
                                onViewAll={() => navigateTo('/ViewDepartment')}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: darkPurple, fontWeight: 700, mb: 2 }}>
                                Facility Metrics (%)
                            </Typography>
                            <Grid container spacing={3}>
                                {extraMetricsConfig.map((metric, index) => (
                                    <Grid item xs={12} sm={4} key={index}>
                                        <SimpleMetricCard
                                            title={metric.title}
                                            value={metric.value}
                                            icon={metric.icon}
                                            bgColor={metric.bgColor}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>

                </Box>

                <Box
                    component="footer"
                    sx={{
                        width: '100%',
                        py: 1,
                        px: 3,
                        backgroundColor: '#ffffff',
                        color: darkPurple,
                        textAlign: 'center',
                        borderTop: '1px solid #ddd'
                    }}
                >
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        &copy; {new Date().getFullYear()} EduPulse ERP Admin Panel. All rights reserved. | By Dolisha Gandhi.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;