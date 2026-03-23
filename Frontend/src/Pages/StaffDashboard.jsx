import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import cookie from 'js-cookie';
import { FaMoneyBillWave } from 'react-icons/fa';
import AIChatBox from '../Components/AIChatBox';
import { 
    Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, 
    Typography, IconButton, CssBaseline, Button, Collapse, 
    ListItemIcon, Paper, Grid, Avatar, Divider, CircularProgress, Card, CardContent 
} from '@mui/material';
import {
    Menu as MenuIcon, People, Assignment, Notifications,
    ExpandLess, ExpandMore, AccountCircle, Home,
    Grading, Assessment, AccessTime, Campaign, Logout,
    EventNote, AccessAlarm, AutoAwesome 
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const drawerWidth = 260;
const API_BASE_URL = 'http://localhost:7000';
const primaryColor = '#0f2a44';
const lightBg = '#eef1f5';
const secondaryColor = '#0f7fbf';
const greyText = '#5f7b8d';
const brandColor = '#0f7fbf';

const MetricCard = ({ title, value, icon: Icon, color, bgColor, loading }) => (
    <Card elevation={0} sx={{ borderRadius: '12px', minHeight: 150, backgroundColor: bgColor, boxShadow: '0 8px 25px rgba(0,0,0,0.05)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-3px)' } }}>
        <CardContent>
            <Box sx={{ color, mb: 1.5, fontSize: 32 }}><Icon fontSize="inherit" /></Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
                {loading ? <CircularProgress size={24} sx={{ color }} /> : value}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color, opacity: 0.8, mt: 1 }}>{title}</Typography>
        </CardContent>
    </Card>
);

const ModernCalendarWidget = ({ now }) => {
    const [selectedDate, setSelectedDate] = useState(now);
    useEffect(() => { setSelectedDate(now); }, [now]);
    return (
        <Paper elevation={3} sx={{ borderRadius: '16px', p: 1.5, minHeight: 370, boxShadow: '0 10px 25px rgba(2,6,23,0.08)' }}>
            <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 600, px: 1, pt: 1, mb: 1 }}>Academic Calendar</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar value={selectedDate} onChange={(v) => v && setSelectedDate(v)}
                    sx={{ width: '100%', '& .MuiDayCalendar-weekDayLabel': { color: secondaryColor, fontWeight: 600 }, '& .MuiPickersDay-root': { '&.Mui-selected': { backgroundColor: secondaryColor, color: 'white' }, '&:hover': { backgroundColor: '#e0f7fa' } } }}
                />
            </LocalizationProvider>
        </Paper>
    );
};

const StaffDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openAssignment, setOpenAssignment] = useState(false);
    const [now, setNow] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalStudents: 0, totalSubmissions: 0, totalNotices: 0 });
    const [recentNotices, setRecentNotices] = useState([]);

    // AI Chat popup state
    const [aiOpen, setAiOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = cookie.get('emstoken');
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

            const [studentsRes, noticesRes, submissionsRes] = await Promise.allSettled([
                axios.get(`${API_BASE_URL}/viewstudent`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/viewnotice`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/viewsubmission`, { headers: authHeaders, withCredentials: true })
            ]);

            const students = studentsRes.status === 'fulfilled' ? (studentsRes.value?.data?.student || []) : [];
            const notices = noticesRes.status === 'fulfilled' ? (noticesRes.value?.data?.notices || []) : [];
            const submissions = submissionsRes.status === 'fulfilled' ? (submissionsRes.value?.data?.submission || []) : [];

            setStats({ totalStudents: students.length, totalSubmissions: submissions.length, totalNotices: notices.length });
            setRecentNotices([...notices].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)).slice(0, 3));
        } catch (err) {
            console.error('Staff dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const refreshTimer = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(refreshTimer);
    }, []);

    const currentTime = now.toLocaleTimeString();
    const currentDateText = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const menuItems = [
        { text: "Dashboard", icon: <Home />, path: '/StaffDashboard' },
        { text: "Student Attendance", icon: <AccessTime />, path: '/StuAttendance' },
        { text: "PTM", path: '/ptm' },
        {
            text: "Assignment", icon: <Assignment />,
            onClick: () => setOpenAssignment(!openAssignment), open: openAssignment,
            subItems: [{ text: "Add Assignment", path: '/Assignment' }, { text: "View Submission", path: '/ViewSubmission' }]
        },
        { text: "View Notices", icon: <Notifications />, path: '/ViewNotices' },
        { text: "View Students", icon: <People />, path: '/ViewStudent' },
        { text: "Enter Marks", icon: <Grading />, path: '/marks' },
        { text: "Manage Tests", icon: <Assessment />, path: '/Test' },
        { text: "My Payments", icon: <FaMoneyBillWave />, path: '/staffpayment' },
        { text: "Staff Profile", icon: <AccountCircle />, path: '/StaffProfile' },
    ];

    const drawerContent = (
        <>
            <Toolbar sx={{ backgroundColor: 'white', borderBottom: '1px solid #eee', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: primaryColor }}>
                    <span style={{ color: secondaryColor }}>Edu</span>Pulse
                </Typography>
            </Toolbar>

            {/* Nav items — scrollable */}
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem button onClick={item.path ? () => navigate(item.path) : item.onClick}
                                sx={{ py: 1.5, '&:hover': { backgroundColor: lightBg }, ...(location.pathname === item.path && { backgroundColor: lightBg }) }}>
                                <ListItemIcon sx={{ minWidth: 45, color: location.pathname === item.path ? primaryColor : '#888' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}
                                    sx={{ '& .MuiListItemText-primary': { fontWeight: location.pathname === item.path ? 700 : 500, fontSize: '0.9rem', color: location.pathname === item.path ? primaryColor : '#555' } }}
                                />
                                {item.subItems && (item.open ? <ExpandLess sx={{ color: primaryColor }} /> : <ExpandMore sx={{ color: '#888' }} />)}
                            </ListItem>
                            {item.subItems && (
                                <Collapse in={item.open} timeout="auto">
                                    <List disablePadding>
                                        {item.subItems.map((sub, i) => (
                                            <ListItem key={i} button onClick={() => navigate(sub.path)} sx={{ pl: 6, py: 0.8, '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                                <ListItemText primary={sub.text} primaryTypographyProps={{ fontSize: '0.85rem', color: '#666' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* AI Button — neeche fixed */}
            <Divider />
            <Box sx={{ p: 1.5 }}>
                <Button
                    fullWidth
                    variant={aiOpen ? "contained" : "outlined"}
                    startIcon={<AutoAwesome sx={{ color: aiOpen ? '#FFD700' : secondaryColor }} />}
                    onClick={() => setAiOpen(!aiOpen)}
                    sx={{
                        borderRadius: 3, py: 1.2, textTransform: 'none', fontWeight: 700,
                        fontSize: '0.9rem',
                        bgcolor: aiOpen ? primaryColor : 'white',
                        color: aiOpen ? 'white' : primaryColor,
                        border: `2px solid ${primaryColor}`,
                        '&:hover': { bgcolor: aiOpen ? secondaryColor : lightBg },
                        transition: 'all 0.2s',
                    }}
                >
                    {aiOpen ? 'Close AI Chat' : '✨ Ask AI Assistant'}
                </Button>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: '#eef1f5' }}>
            <CssBaseline />

            <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#ffffff', color: primaryColor, zIndex: (theme) => theme.zIndex.drawer + 1, borderBottom: '1px solid #dce3eb', width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton sx={{ mr: 2, color: primaryColor, display: { sm: 'none' } }}><MenuIcon /></IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryColor }}>Staff Dashboard</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '14px', mr: 2 }}>{currentTime}</Typography>
                        <AccountCircle sx={{ color: primaryColor, mr: 0.5 }} />
                        <Button color="inherit" onClick={() => navigate('/logout')}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Permanent Drawer */}
            <Drawer variant="permanent"
                sx={{ display: { xs: 'none', sm: 'block' }, width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", bgcolor: 'white', color: primaryColor, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' } }}
                open
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, background: 'linear-gradient(180deg, #f4f7fb 0%, #e8edf5 55%, #dceaef 100%)', overflowY: 'auto', width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard title="No. of Students" value={stats.totalStudents} icon={People} color="#4c8bf5" bgColor="rgba(76,139,245,0.1)" loading={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard title="Assignments Submitted" value={stats.totalSubmissions} icon={Assignment} color="#3ecf8e" bgColor="rgba(62,207,142,0.1)" loading={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard title="Total Notices" value={stats.totalNotices} icon={Notifications} color="#f5b849" bgColor="rgba(245,184,73,0.1)" loading={loading} />
                    </Grid>

                    <Grid item xs={12} lg={7}>
                        <Paper sx={{ p: 3.5, borderRadius: '22px', minHeight: 370, display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(2,6,23,0.08)' }}>
                            <Typography sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Campaign color="error" /> View Notices
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
                                ) : recentNotices.length > 0 ? (
                                    recentNotices.map((notice) => (
                                        <Box key={notice._id} sx={{ p: 1.6, mb: 1.3, bgcolor: '#F8FAFF', borderRadius: '12px', border: '1px solid #E5EDFF' }}>
                                            <Typography sx={{ fontWeight: 700, color: primaryColor, fontSize: 14 }}>{notice.title || 'Untitled'}</Typography>
                                            <Typography sx={{ color: greyText, fontSize: 12, mt: 0.3 }}>
                                                {notice.issueDate ? new Date(notice.issueDate).toLocaleDateString('en-GB') : 'N/A'}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography sx={{ color: greyText }}>No notices available</Typography>
                                )}
                            </Box>
                            <Button variant="contained" sx={{ mt: 1, bgcolor: brandColor, '&:hover': { bgcolor: '#00918A' } }} onClick={() => navigate('/ViewNotices')}>
                                View All Notices
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <ModernCalendarWidget now={now} />
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3.5, borderRadius: '22px', minHeight: 200, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(160deg, #FFFFFF 0%, #F0FDFA 100%)', boxShadow: '0 10px 25px rgba(2,6,23,0.08)' }}>
                            <Box sx={{ mb: 2 }}><AccessAlarm sx={{ fontSize: 48, color: brandColor }} /></Box>
                            <Typography sx={{ color: greyText, fontWeight: 700 }}>Live Time</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: primaryColor, mt: 0.5 }}>{currentTime}</Typography>
                            <Typography sx={{ color: greyText, fontWeight: 700, mt: 1 }}>{currentDateText}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography sx={{ fontWeight: 700, color: primaryColor }}>Auto refresh every 1 minute</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* AI Chat Popup — sidebar ke baad */}
            {aiOpen && (
                <Box sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: drawerWidth + 16,
                    zIndex: 1300,
                    animation: 'slideUp 0.25s ease',
                }}>
                    <AIChatBox role="staff" onClose={() => setAiOpen(false)} />
                </Box>
            )}

            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </Box>
    );
};

export default StaffDashboard;