import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Button, Paper, CircularProgress,
  Alert, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton
} from '@mui/material';
import {
  CameraAlt, CheckCircle, FaceRetouchingNatural,
  LocationOn, History, ArrowBack, HowToReg
} from '@mui/icons-material';

const API = `${import.meta.env.VITE_API_BASE_URL}`;
const primaryColor = '#0f2a44';
const secondaryColor = '#0f7fbf';

export default function FaceAttendance() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [step, setStep] = useState('idle');   // idle | camera | processing | done | error
  const [mode, setMode] = useState('mark');   // mark | register
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [history, setHistory] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadHistory();
    return () => stopCamera();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${API}/face-attendance/history`, { withCredentials: true });
      if (res.data.success) {
        setHistory(res.data.records || []);
        setTotalDays(res.data.total || 0);
      }
    } catch (err) {
      console.log('History fetch error:', err.message);
    }
    setLoadingHistory(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStep('camera');
      setMsg({ text: '', type: '' });
    } catch {
      setMsg({ text: 'Camera access denied. Please allow camera permission.', type: 'error' });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const captureBlob = () =>
    new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });

  const getLocation = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Latitude:", pos.coords.latitude);
        console.log("Longitude:", pos.coords.longitude);
        console.log("Accuracy (meters):", pos.coords.accuracy);

        resolve(pos.coords);
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  );


  const handleMarkAttendance = async () => {
    setStep('processing');
    setMsg({ text: 'Getting your location...', type: 'info' });
    try {
      const coords = await getLocation();
      setMsg({ text: 'Verifying your face...', type: 'info' });

      const blob = await captureBlob();
      const fd = new FormData();
      fd.append('image', blob, 'face.jpg');
      fd.append('lat', coords.latitude);
      fd.append('lon', coords.longitude);

      const res = await axios.post(`${API}/face-attendance/mark`, fd, { withCredentials: true });

      stopCamera();
      setStep('done');
      setMsg({ text: `✅ Attendance marked on ${res.data.date} at ${res.data.time}`, type: 'success' });
      loadHistory();
    } catch (err) {
      stopCamera();
      setStep('error');
      setMsg({ text: err.response?.data?.msg || 'Something went wrong. Try again.', type: 'error' });
    }
  };

  const handleRegisterFace = async () => {
    setStep('processing');
    setMsg({ text: 'Registering your face...', type: 'info' });
    try {
      const blob = await captureBlob();
      const fd = new FormData();
      fd.append('image', blob, 'face.jpg');

      const res = await axios.post(`${API}/face-attendance/register`, fd, { withCredentials: true });

      stopCamera();
      setStep('done');
      setMsg({ text: res.data.msg, type: 'success' });
      setMode('mark');
    } catch (err) {
      stopCamera();
      setStep('error');
      setMsg({ text: err.response?.data?.msg || 'Face registration failed.', type: 'error' });
    }
  };

  const handleCapture = () => mode === 'mark' ? handleMarkAttendance() : handleRegisterFace();
  const reset = () => { setStep('idle'); setMsg({ text: '', type: '' }); };

  return (
    <Box sx={{ minHeight: '100vh', background: '#eef1f5', p: 3 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <IconButton onClick={() => navigate('/StudentDashboard')}>
          <ArrowBack />
        </IconButton>
        <FaceRetouchingNatural sx={{ color: primaryColor, fontSize: 32 }} />
        <Typography variant="h5" fontWeight="bold" color={primaryColor}>
          Smart Face Attendance
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* ── Camera Panel ── */}
        <Paper elevation={3} sx={{ borderRadius: 3, p: 3, flex: '1 1 340px', maxWidth: 420 }}>

          {/* Mode Toggle */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={mode === 'mark' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<CheckCircle />}
              onClick={() => { setMode('mark'); reset(); }}
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: mode === 'mark' ? primaryColor : undefined }}
            >
              Mark Attendance
            </Button>
            <Button
              variant={mode === 'register' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<HowToReg />}
              onClick={() => { setMode('register'); reset(); }}
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: mode === 'register' ? secondaryColor : undefined }}
            >
              Register Face
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {mode === 'mark'
              ? '📍 Mark today\'s attendance using face + GPS. Must be on campus.'
              : '📸 Register your face once before marking attendance for the first time.'}
          </Typography>

          {/* Video Box */}
          <Box sx={{
            width: '100%', height: 240, borderRadius: 2, overflow: 'hidden',
            background: '#1a1a2e', display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative', mb: 2,
          }}>
            {step !== 'camera' && step !== 'processing' && (
              <Box textAlign="center" color="white">
                <CameraAlt sx={{ fontSize: 48, opacity: 0.4 }} />
                <Typography variant="caption" display="block" sx={{ opacity: 0.5 }}>
                  Camera inactive
                </Typography>
              </Box>
            )}
            <video
              ref={videoRef}
              autoPlay
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                display: step === 'camera' || step === 'processing' ? 'block' : 'none',
              }}
            />
            {step === 'processing' && (
              <Box sx={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', color: 'white', gap: 1,
              }}>
                <CircularProgress color="inherit" size={36} />
                <Typography variant="caption">{msg.text}</Typography>
              </Box>
            )}
          </Box>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Alert */}
          {msg.text && step !== 'processing' && (
            <Alert
              severity={msg.type === 'error' ? 'error' : msg.type === 'success' ? 'success' : 'info'}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {msg.text}
            </Alert>
          )}

          {/* Action Button */}
          {(step === 'idle' || step === 'done' || step === 'error') && (
            <Button
              variant="contained" fullWidth startIcon={<CameraAlt />}
              onClick={startCamera}
              sx={{ borderRadius: 2, py: 1.2, textTransform: 'none', fontWeight: 'bold', bgcolor: primaryColor }}
            >
              {step === 'idle' ? 'Open Camera' : 'Try Again'}
            </Button>
          )}
          {step === 'camera' && (
            <Button
              variant="contained" fullWidth
              startIcon={mode === 'mark' ? <LocationOn /> : <HowToReg />}
              onClick={handleCapture}
              sx={{
                borderRadius: 2, py: 1.2, textTransform: 'none', fontWeight: 'bold',
                bgcolor: mode === 'mark' ? '#27ae60' : secondaryColor,
              }}
            >
              {mode === 'mark' ? '📸 Verify & Mark Attendance' : '✅ Capture & Register Face'}
            </Button>
          )}
        </Paper>

        {/* ── Stats + History Panel ── */}
        <Box sx={{ flex: '1 1 340px' }}>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Paper elevation={2} sx={{
              flex: 1, borderRadius: 3, p: 2.5, textAlign: 'center',
              background: `linear-gradient(135deg, ${primaryColor}, #1a3d6e)`, color: 'white',
            }}>
              <Typography variant="h3" fontWeight="bold">{totalDays}</Typography>
              <Typography variant="caption">Days Present</Typography>
            </Paper>
            <Paper elevation={2} sx={{
              flex: 1, borderRadius: 3, p: 2.5, textAlign: 'center',
              background: `linear-gradient(135deg, ${secondaryColor}, #0a5a8a)`, color: 'white',
            }}>
              <Typography variant="h4" fontWeight="bold">
                {history.length > 0 ? history[0].date?.slice(5) : '—'}
              </Typography>
              <Typography variant="caption">Last Attended</Typography>
            </Paper>
          </Box>

          {/* History Table */}
          <Paper elevation={2} sx={{ borderRadius: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <History sx={{ color: primaryColor }} />
              <Typography fontWeight="bold" color={primaryColor}>Recent Attendance</Typography>
            </Box>

            {loadingHistory ? (
              <Box textAlign="center" py={3}><CircularProgress size={24} /></Box>
            ) : history.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                No records yet. Mark your first attendance above!
              </Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((r, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          {r.timestamp ? r.timestamp.split('T')[1]?.slice(0, 5) : '—'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={r.status} size="small" color="success"
                            sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>

      </Box>
    </Box>
  );
}