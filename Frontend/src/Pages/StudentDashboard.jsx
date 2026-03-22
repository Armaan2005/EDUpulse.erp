import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar,
    Typography, IconButton, CssBaseline, Button, Collapse,
    ListItemIcon, Divider, Paper, Grid, Card, CardContent,
    CircularProgress, Alert, Chip, Badge, Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon, School, Assignment, NotificationsOutlined,
    ExpandLess, ExpandMore, AccountCircle, Home, Grading,
    CalendarToday, AccessTime, EmojiObjects,
    Campaign as NoticeIcon, FiberManualRecord, DirectionsBus,
    Payment, Hotel, LocalLibrary, RateReview
} from '@mui/icons-material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';

const drawerWidth = 300;
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
    weeklyFocus: '75%',
    newGrades: '1.35m',
    itemsDue: '1.72m',
    bugReports: 5,
    myActivityTrends: [
        { name: 'Mon', My_Activity: 40 },
        { name: 'Tue', My_Activity: 48 },
        { name: 'Wed', My_Activity: 60 },
        { name: 'Thu', My_Activity: 55 },
        { name: 'Fri', My_Activity: 50 },
        { name: 'Sat', My_Activity: 58 },
        { name: 'Sun', My_Activity: 52 },
    ],
    assignmentStatus: [
        { name: 'Completed', value: 34.7, color: '#3ecf8e' },
        { name: 'Pending', value: 27.7, color: '#f54c7d' },
        { name: 'Needs Revision', value: 28.4, color: '#f5b849' },
        { name: 'Grades Pending', value: 9.2, color: '#4c8bf5' },
    ],
};


const MetricCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: '12px',
            minHeight: 150,
            backgroundColor: bgColor,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'translateY(-3px)' }
        }}
    >
        <CardContent>
            <Box sx={{ color: color, mb: 1.5, fontSize: 32 }}>
                <Icon fontSize="inherit" />
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: color }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: color, opacity: 0.8, mt: 1 }}>
                {title}
            </Typography>
        </CardContent>
    </Card>
);

const ModernCalendarWidget = () => {
    const [value, setValue] = useState(new Date());

    return (
        <Paper elevation={3} sx={{ borderRadius: '16px', p: 1.5, height: 400 }}>
            <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 600, px: 1, pt: 1, mb: 1 }}>
                Academic Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    sx={{
                        width: '100%',
                        '& .MuiPickersCalendarHeader-root': { mb: 0.5, px: 2 },
                        '& .MuiDayCalendar-weekContainer': { px: 1 },
                        '& .MuiDayCalendar-weekDayLabel': { color: secondaryColor, fontWeight: 600 },
                        '& .MuiPickersDay-root': {
                            '&.Mui-selected': { backgroundColor: secondaryColor, color: 'white' },
                            '&:hover': { backgroundColor: '#e0f7fa' }
                        }
                    }}
                />
            </LocalizationProvider>
        </Paper>
    );
};

const CurrentStatusWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = format(currentTime, 'EEEE, MMM do');
    const formattedYear = format(currentTime, 'yyyy');

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: '16px',
                p: 3,
                height: 400,
                backgroundColor: secondaryColor,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundImage: `linear-gradient(135deg, ${secondaryColor} 0%, #00838f 100%)`
            }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Current Status
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                    {formattedYear}
                </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: 2 }}>
                    {format(currentTime, 'hh:mm')}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    {format(currentTime, 'ss a')} IST
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formattedDate}
                </Typography>
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
                const response = await axios.get('http://localhost:7000/viewnotice', {
                    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                    withCredentials: true,
                });
                setNotices(response.data.notices || []);
            } catch (err) {
                console.error('Notice fetch error:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.msg || 'Failed to fetch notices.');
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const sortedNotices = [...notices].sort((a, b) => {
        const dateA = new Date(a.issueDate || a.date || a.createdAt || 0);
        const dateB = new Date(b.issueDate || b.date || b.createdAt || 0);
        return dateB - dateA;
    });

    return (
        <Paper elevation={5} sx={{ borderRadius: '18px', p: 3.5, minHeight: 480, backgroundColor: '#ffffff', boxShadow: '0 22px 56px rgba(0,0,0,0.16)', mt: -14 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, mt: -2.4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <NoticeIcon sx={{ color: '#006a8a', fontSize: 38 }} />
                    <div>
                        <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 700, letterSpacing: 0.4 }}>
                            Latest Notices
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#5f7b8d' }}>
                            Keep track of current updates and announcements
                        </Typography>
                    </div>
                </Box>
                <Chip label={`${notices.length} notice${notices.length === 1 ? '' : 's'}`} variant="outlined" color="primary" size="small" />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && !error && (
                <List sx={{ maxHeight: 420, overflowY: 'auto', paddingRight: 1 }}>
                    {sortedNotices.length > 0 ? (
                        sortedNotices.map((notice) => (
                            <ListItem
                                key={notice._id || notice.id}
                                sx={{ borderBottom: '1px solid #eee', py: 1.5 }}
                                alignItems="flex-start"
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1f3251' }}>
                                            {notice.title || 'Untitled Notice'}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography sx={{ fontSize: 14, color: '#464f5c', mt: 0.25 }}>
                                                {notice.content || 'No additional details provided.'}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, color: '#8696a5', mt: 0.55 }}>
                                                Issued: {notice.issueDate || notice.date || 'N/A'} • Event: {notice.eventDate || 'N/A'}
                                            </Typography>
                                        </>
                                    }
                                />
                                <Chip
                                    label={notice.type || 'General'}
                                    size="small"
                                    sx={{ height: 24 }}
                                    color={notice.type === 'Urgent' ? 'error' : notice.type === 'Event' ? 'warning' : 'info'}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>No notices available.</Alert>
                    )}
                </List>
            )}
        </Paper>
    );
};

const DashboardMetrics = () => (
    <Grid item xs={12}>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <MetricCard title="Weekly Focus Completion" value={mockData.weeklyFocus} icon={METRIC_COLORS.weeklySales.icon} color={METRIC_COLORS.weeklySales.color} bgColor={METRIC_COLORS.weeklySales.bgColor} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <MetricCard title="New Grades Posted" value={mockData.newGrades} icon={METRIC_COLORS.newUsers.icon} color={METRIC_COLORS.newUsers.color} bgColor={METRIC_COLORS.newUsers.bgColor} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <MetricCard title="Items Due This Week" value={mockData.itemsDue} icon={METRIC_COLORS.itemOrders.icon} color={METRIC_COLORS.itemOrders.color} bgColor={METRIC_COLORS.itemOrders.bgColor} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <MetricCard title="Unread Notifications" value={mockData.bugReports} icon={METRIC_COLORS.bugReports.icon} color={METRIC_COLORS.bugReports.color} bgColor={METRIC_COLORS.bugReports.bgColor} />
            </Grid>
        </Grid>
    </Grid>
);

const DashboardWidgets = () => (
    <Grid item xs={12}>
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <ModernCalendarWidget />
            </Grid>
            <Grid item xs={12} lg={6}>
                <CurrentStatusWidget />
            </Grid>
        </Grid>
    </Grid>
);

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [name, setName] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);

    const [openAcademics, setOpenAcademics] = useState(false);
    const [openTransport, setOpenTransport] = useState(false);
    const [openLibrary, setOpenLibrary] = useState(false);
    const [openHostel, setOpenHostel] = useState(false);

    const navigateTo = (route) => { navigate(route); };
    const toggleDrawer = () => setOpenDrawer(!openDrawer);
    const toggleAcademics = () => setOpenAcademics(!openAcademics);
    const toggleTransport = () => setOpenTransport(!openTransport);
    const toggleLibrary = () => setOpenLibrary(!openLibrary);
    const toggleHostel = () => setOpenHostel(!openHostel);
    useEffect(() => {
      fetchDashboard();
    }, []);
  
      const fetchDashboard = async () => {setLoading(true);
        try {
          const response = await axios.get("http://localhost:7000/studentdashboard", {
            headers: {
                       "Content-Type": "application/json",
                       "Authorization": `Bearer ${Cookies.get("token")}`,
                     },
                     withCredentials: true,
          });
          if (response.status === 200) {
            setEmail(response.data.dashboard.email);
            setContact(response.data.dashboard.contact);
            setName(response.data.dashboard.name);
          }
        } catch (err) {
          console.error("Dashboard Error:", err.response ? err.response.data : err.message);
          setMessage(err.response?.data?.message || "Failed to load dashboard");
        } finally {
          setLoading(false);
        }
  
      };

    useEffect(() => {
        const scriptId = 'noupe-embed-script';
        const scriptUrl = 'https://www.noupe.com/embed/019b3ce8eb9373fbbd8c28bfada2fa47808e.js';

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = scriptUrl;
            script.async = true;
            document.body.appendChild(script);

            return () => {
                const existingScript = document.getElementById(scriptId);
                if (existingScript) {
                    document.body.removeChild(existingScript);
                }
            };
        }
    }, []); 

    const menuItems = [
        { text: "Dashboard", icon: <Home />, path: '/', alwaysOpen: true },
        { text: "Student Profile", icon: <AccountCircle />, path: '/StudentProfile' },
        { text: "View Notices", path: '/ViewNotices', icon: <NotificationsOutlined /> },

        {
            text: "Academics",
            icon: <Assignment />,
            onClick: toggleAcademics,
            open: openAcademics,
            subItems: [
                { text: "View Tests", path: '/viewTest' },
                { text: "View Report Card", path: '/reportcard' },
                { text: "View Assignments", path: '/ViewAssignment' },
                { text: "Assign Feedback", path: '/ViewAssFeed' },
                {text:"PTM" , path:'/ptm'},
            ]
        },

        {
            text: "Transport",
            icon: <DirectionsBus />,
            onClick: toggleTransport,
            open: openTransport,
            subItems: [
                { text: "Add Transport Details", path: '/studenttransportdetails' },
                { text: "Student Transport Details", path: '/StudentTransportAllDetails'},
                { text: "Live Tracking", path: '/liveTracker' }
            ]
        },
        { text: "Fee Payment", icon: <Payment />, path: '/payfee' },

        {
            text: "Hostel Registration",
            icon: <Hotel />,
            onClick: toggleHostel,
            open: openHostel,
            subItems:[
                {text:"Add Hostel Details", path:'/hostelregistration'},
                {text:"Hostel Fees Payment",path:'/hostelfees'},
            ]
        },

        {
            text: "Library",
            icon: <LocalLibrary />,
            onClick: toggleLibrary,
            open: openLibrary,
            subItems:[
                {text:"View Books", path:'/ViewBook'},
                {text:"Issued Books",path:'/issued'},
                {text:"View Penalties", path:'/paypenalty'},
            ]
        },
        { text: "Feedback", path: '/Feedback', icon: <RateReview /> },
    ];


    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: '#ffffff',
                    color: primaryColor,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottom: '1px solid #dce3eb',
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}
                        sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Student Dashboard  {name}
                    </Typography>

                    <AccountCircle sx={{ color: primaryColor, mr: 1 }} />
                    <Button color="inherit" onClick={() => navigateTo('/logout')}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: 'white',
                        color: primaryColor,
                        borderRight: '1px solid #e0e0e0',
                    },
                }}
                open
            >
                <Toolbar sx={{ backgroundColor: 'white', borderBottom: '1px solid #eee', justifyContent: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: primaryColor }}>
                        <span style={{ color: secondaryColor }}>Edu</span>Pulse
                    </Typography>
                </Toolbar>
                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                button
                                onClick={item.path ? () => navigateTo(item.path) : item.onClick}
                                sx={{
                                    py: 1.5,
                                    transition: 'background-color 0.2s',
                                    '&:hover': { backgroundColor: lightBg },
                                    ...(item.path === '/' && { backgroundColor: lightBg, color: primaryColor, fontWeight: 700 })
                                }}
                            >
                                <ListItemIcon sx={{ color: item.path === '/' ? primaryColor : '#888' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontWeight: item.path === '/' ? 700 : 500, fontSize: '0.95rem' } }} />
                                {item.subItems && (item.open ? <ExpandLess sx={{ color: primaryColor }}/> : <ExpandMore sx={{ color: '#888' }}/>)}
                            </ListItem>
                            {item.subItems && (
                                <Collapse in={item.open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <ListItem key={subIndex} button sx={{ pl: 4, py: 1, '&:hover': { backgroundColor: '#f0f0f0' } }} onClick={() => navigateTo(subItem.path)}>
                                                <ListItemText primary={subItem.text} sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem', color: '#666' } }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    background: 'linear-gradient(180deg, #f4f7fb 0%, #e8edf5 55%, #dceaef 100%)',
                    overflowY: 'auto',
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Grid container spacing={3}>
                    <DashboardMetrics />
                    <DashboardWidgets />
                    <Grid item xs={12}>
                        <NoticeWidget />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default StudentDashboard;