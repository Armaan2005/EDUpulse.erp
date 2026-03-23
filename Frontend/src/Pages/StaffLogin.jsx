import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookie from 'js-cookie';
import { 
    Box, Typography, TextField, Button, CircularProgress, 
    Alert, Paper, IconButton, InputAdornment, CssBaseline, Link 
} from '@mui/material';
import { 
    People, Email, Lock, Visibility, VisibilityOff, ArrowForward, School 
} from '@mui/icons-material';

const primaryColor = '#1e2a38';
const secondaryColor = '#007bff';
const lightBg = '#eef2f6';
const cardShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';

const StaffLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            return 'Please fill in both Email and Password.';
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return 'Please enter a valid email address.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'http://localhost:7000/stafflogin',
                formData,
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            if (response.status === 200 && response.data.token) {
                cookie.set('emstoken', response.data.token, { expires: 1 });
                navigate('/StaffDashboard'); 
            } else {
                setError(response.data.message || 'Invalid login credentials');
            }
        } catch (err) {
            console.error('Login Error:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Login failed! Please check your network or credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: lightBg,
                p: 2,
            }}
        >
            <CssBaseline />
            
            <Paper 
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 5 }, 
                    borderRadius: '16px',
                    maxWidth: 480,
                    width: '100%',
                    backgroundColor: '#fff',
                    boxShadow: cardShadow,
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: 8, 
                    backgroundColor: secondaryColor,
                }} />

                <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
                    <People sx={{ fontSize: 65, color: secondaryColor, mb: 1.5, border: `2px solid ${secondaryColor}`, borderRadius: '50%', p: 1 }} />
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ fontWeight: 800, color: primaryColor }}
                    >
                        Staff / Teacher Login
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your credentials to manage academic operations.
                    </Typography>
                </Box>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                        <TextField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: secondaryColor,
                                    borderWidth: '2px',
                                },
                            }}
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: secondaryColor,
                                    borderWidth: '2px',
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ mt: 1.5, textAlign: 'right' }}>
                        <Link 
                            href="#" 
                            variant="body2" 
                            underline="none"
                            sx={{ color: secondaryColor, fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                        >
                            Forgot Password?
                        </Link>
                    </Box>

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        disabled={loading}
                        endIcon={!loading && <ArrowForward />}
                        sx={{
                            mt: 4, 
                            py: 1.5,
                            backgroundColor: primaryColor,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            transition: 'background-color 0.3s, transform 0.3s',
                            '&:hover': {
                                backgroundColor: secondaryColor, 
                                transform: 'translateY(-2px)'
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Log in to Staff Dashboard'
                        )}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default StaffLogin;
