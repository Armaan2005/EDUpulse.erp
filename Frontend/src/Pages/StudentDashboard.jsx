import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from '../Components/AIChatBox';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar,
    Typography, IconButton, CssBaseline, Button, Collapse,
    ListItemIcon, Divider, Paper, Grid, Card, CardContent,
    CircularProgress, Alert, Chip, Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon, School, Assignment, NotificationsOutlined,
    ExpandLess, ExpandMore, AccountCircle, Home, Grading,
    CalendarToday, EmojiObjects, Campaign as NoticeIcon,
    DirectionsBus, Payment, Hotel, LocalLibrary, RateReview,
    FaceRetouchingNatural, AutoAwesome
} from '@mui/icons-material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';

const drawerWidth = 260;
const primaryColor = '#0f2a44';
const lightBg = '#eef1f5';
const secondaryColor = '#0f7fbf';

const METRIC_COLORS = {
    weeklySales: { icon: EmojiObjects, color: '#4c8bf5', bgColor: 'rgba(76, 139, 245, 0.1)' },
    newUsers: { icon: School, color: '#3ecf8e', bgColor: 'rgba(62, 207, 142, 0.1)' },
    itemOrders: { icon: Grading, color: '#f5b849', bgColor: 'rgba(245, 184, 73, 0.1)' },
    bugReports: { icon: NotificationsOutlined, color: '#f54c7d', bgColor: 'rgba(245, 76, 125, 0.1)' },
};

const mockData = {
    weeklyFocus: '75%', newGrades: '1.35m', itemsDue: '1.72m', bugReports: 5,
};

const MetricCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card elevation={0} sx={{ borderRadius: '12px', minHeight: 150, backgroundColor: bgColor, boxShadow: '0 8px 25px rgba(0,0,0,0.05)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-3px)' } }}>
        <CardContent>
            <Box sx={{ color: color, mb: 1.5, fontSize: 32 }}><Icon fontSize="inherit" /></Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: color }}>{value}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: color, opacity: 0.8, mt: 1 }}>{title}</Typography>
        </CardContent>
    </Card>
);

const ModernCalendarWidget = () => {
    const [value, setValue] = useState(new Date());
    return (
        <Paper elevation={3} sx={{ borderRadius: '16px', p: 1.5, height: 400 }}>
            <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 600, px: 1, pt: 1, mb: 1 }}>Academic Calendar</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} sx={{ width: '100%', '& .MuiDayCalendar-weekDayLabel': { color: secondaryColor, fontWeight: 600 }, '& .MuiPickersDay-root': { '&.Mui-selected': { backgroundColor: secondaryColor, color: 'white' }, '&:hover': { backgroundColor: '#e0f7fa' } } }} />
            </LocalizationProvider>
        </Paper>
    );
};

const CurrentStatusWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
    return (
        <Paper elevation={3} sx={{ borderRadius: '16px', p: 3, height: 400, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundImage: `linear-gradient(135deg, ${secondaryColor} 0%, #00838f 100%)` }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Current Status</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>{format(currentTime, 'yyyy')}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: 2 }}>{format(currentTime, 'hh:mm')}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{format(currentTime, 'ss a')} IST</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{format(currentTime, 'EEEE, MMM do')}</Typography>
            </Box>
        </Paper>
    );
};

const NoticeWidget = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7000/viewnotice', { headers: { Authorization: `Bearer ${Cookies.get('token')}` }, withCredentials: true });
                setNotices(response.data.notices || []);
            } catch (err) { setError(err.response?.data?.msg || 'Failed to fetch notices.'); }
            finally { setLoading(false); }
        };
        fetchNotices();
    }, []);
    const sortedNotices = [...notices].sort((a, b) => new Date(b.issueDate || 0) - new Date(a.issueDate || 0));
    return (
        <Paper elevation={5} sx={{ borderRadius: '18px', p: 3.5, minHeight: 480, backgroundColor: '#ffffff', boxShadow: '0 22px 56px rgba(0,0,0,0.16)', mt: -14 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, mt: -2.4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <NoticeIcon sx={{ color: '#006a8a', fontSize: 38 }} />
                    <div>
                        <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 700 }}>Latest Notices</Typography>
                        <Typography variant="body2" sx={{ color: '#5f7b8d' }}>Keep track of current updates</Typography>
                    </div>
                </Box>
                <Chip label={`${notices.length} notices`} variant="outlined" color="primary" size="small" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <List sx={{ maxHeight: 420, overflowY: 'auto' }}>
                    {sortedNotices.length > 0 ? sortedNotices.map((notice) => (
                        <ListItem key={notice._id} sx={{ borderBottom: '1px solid #eee', py: 1.5 }} alignItems="flex-start">
                            <ListItemText
                                primary={<Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1f3251' }}>{notice.title || 'Untitled'}</Typography>}
                                secondary={<><Typography sx={{ fontSize: 14, color: '#464f5c' }}>{notice.content}</Typography><Typography sx={{ fontSize: 12, color: '#8696a5', mt: 0.5 }}>Issued: {notice.issueDate || 'N/A'}</Typography></>}
                            />
                            <Chip label={notice.type || 'General'} size="small" color={notice.type === 'Urgent' ? 'error' : notice.type === 'Event' ? 'warning' : 'info'} />
                        </ListItem>
                    )) : <Alert severity="info">No notices available.</Alert>}
                </List>
            )}
        </Paper>
    );
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openAcademics, setOpenAcademics] = useState(false);
    const [openTransport, setOpenTransport] = useState(false);
    const [openLibrary, setOpenLibrary] = useState(false);
    const [openHostel, setOpenHostel] = useState(false);

    // AI Chat popup state
    const [aiOpen, setAiOpen] = useState(false);

    const navigateTo = (route) => { navigate(route); };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get("http://localhost:7000/studentdashboard", { headers: { "Authorization": `Bearer ${Cookies.get("token")}` }, withCredentials: true });
                if (response.status === 200) setName(response.data.dashboard.name);
            } catch (err) { console.error("Dashboard Error:", err.message); }
        };
        fetchDashboard();
    }, []);

    const menuItems = [
        { text: "Dashboard", icon: <Home />, path: '/' },
        { text: "Student Profile", icon: <AccountCircle />, path: '/StudentProfile' },
        { text: "View Notices", path: '/ViewNotices', icon: <NotificationsOutlined /> },
        {
            text: "Academics", icon: <Assignment />, onClick: () => setOpenAcademics(!openAcademics), open: openAcademics,
            subItems: [{ text: "View Tests", path: '/viewTest' }, { text: "View Report Card", path: '/reportcard' }, { text: "View Assignments", path: '/ViewAssignment' }, { text: "Assign Feedback", path: '/ViewAssFeed' }, { text: "PTM", path: '/ptm' }]
        },
        {
            text: "Transport", icon: <DirectionsBus />, onClick: () => setOpenTransport(!openTransport), open: openTransport,
            subItems: [{ text: "Add Transport Details", path: '/studenttransportdetails' }, { text: "Student Transport Details", path: '/StudentTransportAllDetails' }, { text: "Live Tracking", path: '/liveTracker' }]
        },
        { text: "Fee Payment", icon: <Payment />, path: '/payfee' },
        {
            text: "Hostel Registration", icon: <Hotel />, onClick: () => setOpenHostel(!openHostel), open: openHostel,
            subItems: [{ text: "Add Hostel Details", path: '/hostelregistration' }, { text: "Hostel Fees Payment", path: '/hostelfees' }]
        },
        {
            text: "Library", icon: <LocalLibrary />, onClick: () => setOpenLibrary(!openLibrary), open: openLibrary,
            subItems: [{ text: "View Books", path: '/ViewBook' }, { text: "Issued Books", path: '/issued' }, { text: "View Penalties", path: '/paypenalty' }]
        },
        { text: "Face Attendance", icon: <FaceRetouchingNatural />, path: '/face-attendance' },
        { text: "Feedback", path: '/Feedback', icon: <RateReview /> },
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
                            <ListItem button onClick={item.path ? () => navigateTo(item.path) : item.onClick}
                                sx={{ py: 1.5, '&:hover': { backgroundColor: lightBg }, ...(item.path === '/' && { backgroundColor: lightBg }) }}>
                                <ListItemIcon sx={{ color: item.path === '/' ? primaryColor : '#888' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontWeight: item.path === '/' ? 700 : 500, fontSize: '0.9rem' } }} />
                                {item.subItems && (item.open ? <ExpandLess sx={{ color: primaryColor }} /> : <ExpandMore sx={{ color: '#888' }} />)}
                            </ListItem>
                            {item.subItems && (
                                <Collapse in={item.open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <ListItem key={subIndex} button sx={{ pl: 4, py: 0.8, '&:hover': { backgroundColor: '#f0f0f0' } }} onClick={() => navigateTo(subItem.path)}>
                                                <ListItemText primary={subItem.text} sx={{ '& .MuiListItemText-primary': { fontSize: '0.85rem', color: '#666' } }} />
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
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />

            <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#ffffff', color: primaryColor, zIndex: (theme) => theme.zIndex.drawer + 1, borderBottom: '1px solid #dce3eb', width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => setOpenDrawer(!openDrawer)} sx={{ mr: 2, display: { sm: 'none' } }}><MenuIcon /></IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>Student Dashboard &nbsp; {name}</Typography>
                    <AccountCircle sx={{ color: primaryColor, mr: 1 }} />
                    <Button color="inherit" onClick={() => navigateTo('/logout')}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Permanent Drawer */}
            <Drawer variant="permanent"
                sx={{ display: { xs: 'none', sm: 'block' }, width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", backgroundColor: 'white', color: primaryColor, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' } }}
                open
            >
                {drawerContent}
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer variant="temporary" open={openDrawer} onClose={() => setOpenDrawer(false)}
                sx={{ display: { xs: 'block', sm: 'none' }, "& .MuiDrawer-paper": { width: drawerWidth, display: 'flex', flexDirection: 'column' } }}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, background: 'linear-gradient(180deg, #f4f7fb 0%, #e8edf5 55%, #dceaef 100%)', overflowY: 'auto', width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            {[
                                { title: "Weekly Focus Completion", value: mockData.weeklyFocus, ...METRIC_COLORS.weeklySales },
                                { title: "New Grades Posted", value: mockData.newGrades, ...METRIC_COLORS.newUsers },
                                { title: "Items Due This Week", value: mockData.itemsDue, ...METRIC_COLORS.itemOrders },
                                { title: "Unread Notifications", value: mockData.bugReports, ...METRIC_COLORS.bugReports },
                            ].map((m, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <MetricCard title={m.title} value={m.value} icon={m.icon} color={m.color} bgColor={m.bgColor} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={6}><ModernCalendarWidget /></Grid>
                            <Grid item xs={12} lg={6}><CurrentStatusWidget /></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}><NoticeWidget /></Grid>
                </Grid>
            </Box>

            {/* AI Chat Popup — screen ke right side mein, sidebar ke upar */}
            {aiOpen && (
                <Box sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: drawerWidth + 16,
                    zIndex: 1300,
                    animation: 'slideUp 0.25s ease',
                }}>
                    <AIChatBox role="student" onClose={() => setAiOpen(false)} />
                </Box>
            )}

            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </Box>
    );
};

export default StudentDashboard;